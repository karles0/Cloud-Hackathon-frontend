// Cliente real del API Gateway.
// Hoy solo confirmado: POST /manuscripts/upload-url
// getManuscriptStatus y getManuscriptResults siguen apuntando a datos simulados
// hasta que el equipo de backend confirme esos 2 endpoints — ver TODOs abajo.

import type {
  ManuscriptResultsResponse,
  ManuscriptStatusResponse,
  UploadUrlRequest,
  UploadUrlResponse,
} from "../types/manuscript";
import * as mock from "./manuscripts.mock";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

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
 *
 * TODO(equipo-backend): confirmar si este endpoint ya existe.
 * Mientras no esté confirmado, usamos el mock para no romper el flujo del front.
 * Cuando exista: descomentar el fetch real y borrar la línea del mock.
 */
export async function getManuscriptStatus(
  manuscriptId: string,
): Promise<ManuscriptStatusResponse> {
  // return fetch(`${requireBaseUrl()}/api/v1/manuscripts/${manuscriptId}`).then((r) => {
  //   if (!r.ok) throw new Error(`status falló con ${r.status}`);
  //   return r.json();
  // });
  return mock.getManuscriptStatus(manuscriptId);
}

/**
 * GET /api/v1/manuscripts/{manuscriptId}/results
 *
 * TODO(equipo-backend): confirmar si este endpoint ya existe.
 * Mismo patrón que getManuscriptStatus arriba.
 */
export async function getManuscriptResults(
  manuscriptId: string,
): Promise<ManuscriptResultsResponse> {
  // return fetch(`${requireBaseUrl()}/api/v1/manuscripts/${manuscriptId}/results`).then((r) => {
  //   if (!r.ok) throw new Error(`results falló con ${r.status}`);
  //   return r.json();
  // });
  return mock.getManuscriptResults(manuscriptId);
}
