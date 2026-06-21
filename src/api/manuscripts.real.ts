// Cliente real del API Gateway.
// Los 3 endpoints del Manifiesto ya están confirmados y conectados:
// POST upload-url, GET status, GET results.

import type {
  ManuscriptResultsResponse,
  ManuscriptStatusResponse,
  UploadUrlRequest,
  UploadUrlResponse,
} from "../types/manuscript";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
console.log("[DEBUG] VITE_API_BASE_URL =", JSON.stringify(API_BASE_URL));
console.log("[DEBUG] import.meta.env completo =", import.meta.env);

function requireBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL no está definida. Revisa tu archivo .env (copia .env.example).",
    );
  }
  return API_BASE_URL.replace(/\/$/, "");
}

/**
 * POST /api/v1/manuscripts/upload-url
 * Conectado al backend real.
 */
export async function getUploadUrl(req: UploadUrlRequest): Promise<UploadUrlResponse> {
  const res = await fetch(`${requireBaseUrl()}/api/v1/manuscripts/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    throw new Error(`upload-url falló con status ${res.status}`);
  }

  return res.json();
}

/**
 * PUT directo a la presigned URL de S3 (no pasa por API Gateway).
 */
export async function uploadFileToStorage(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/pdf" },
  });

  if (!res.ok) {
    throw new Error(`Subida a S3 falló con status ${res.status}`);
  }
}

/**
 * GET /api/v1/manuscripts/{manuscriptId}
 * Conectado al backend real.
 *
 * El backend devuelve campos en español (estado, totalRefs, refsProcesadas,
 * tema, refsRetractadas) en vez del contrato original del Manifiesto.
 * Esta función normaliza esa forma cruda al shape que usa la UI.
 */
export async function getManuscriptStatus(
  manuscriptId: string,
): Promise<ManuscriptStatusResponse> {
  const res = await fetch(`${requireBaseUrl()}/api/v1/manuscripts/${manuscriptId}`);
  if (!res.ok) {
    throw new Error(`status falló con status ${res.status}`);
  }
  const raw = await res.json();
  return normalizeStatus(manuscriptId, raw);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeStatus(manuscriptId: string, raw: any): ManuscriptStatusResponse {
  const estadoRaw = String(raw.estado ?? "PROCESANDO").toUpperCase();

  const statusMap: Record<string, ManuscriptStatusResponse["status"]> = {
    PENDIENTE: "PENDING",
    PENDING: "PENDING",
    PROCESANDO: "PROCESSING",
    PROCESSING: "PROCESSING",
    COMPLETADO: "COMPLETED",
    COMPLETED: "COMPLETED",
    ERROR: "ERROR",
  };

  const totalBatches = Number(raw.totalRefs ?? 0);
  const processedBatches = Number(raw.refsProcesadas ?? 0);
  const status = statusMap[estadoRaw] ?? "PROCESSING";

  return {
    manuscriptId,
    fileName: raw.fileName ?? raw.nombreArchivo ?? "manuscrito.pdf",
    status,
    progress: { totalBatches, processedBatches },
    globalIntegrityIndex:
      status === "COMPLETED" ? Number(raw.indiceIntegridad ?? 0) : null,
    topic: raw.tema ?? raw.Topic,
  };
}

/**
 * GET /api/v1/manuscripts/{manuscriptId}/results
 * Conectado al backend real.
 *
 * El backend devuelve un array crudo de referencias (refId, doi, citaCruda,
 * contexto, estado/esZombi) en vez del shape {totalEvaluated, zombieCount, results}
 * del Manifiesto original. Normalizamos aquí.
 */
export async function getManuscriptResults(
  manuscriptId: string,
): Promise<ManuscriptResultsResponse> {
  const res = await fetch(`${requireBaseUrl()}/api/v1/manuscripts/${manuscriptId}/results`);
  if (!res.ok) {
    throw new Error(`results falló con status ${res.status}`);
  }
  const raw = await res.json();
  return normalizeResults(manuscriptId, raw);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeResults(manuscriptId: string, raw: any): ManuscriptResultsResponse {
  const items: any[] = Array.isArray(raw) ? raw : raw.results ?? raw.items ?? [];

  const results = items.map((item, i) => {
    const isZombie = Boolean(item.estaRetractada ?? false);
    const verificada = Boolean(item.verificada ?? false);

    const contextoBase = String(item.contexto ?? item.citaCruda ?? "");
    const analysisContext = isZombie
      ? contextoBase || "Esta referencia corresponde a un artículo retractado."
      : verificada
        ? "Verificada: no se encontraron registros de retractación para esta referencia."
        : "Aún no verificada por el sistema.";

    return {
      referenceId: String(item.referenceId ?? item.refId ?? i),
      citationText: String(
        item.citationText ?? item.citaCruda ?? item.doi ?? "Referencia sin texto disponible",
      ),
      isZombie,
      analysisContext,
    };
  });

  const zombieCount = results.filter((r) => r.isZombie).length;

  return {
    manuscriptId,
    totalEvaluated: results.length,
    zombieCount,
    results,
  };
}