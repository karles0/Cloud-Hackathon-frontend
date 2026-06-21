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
 */
export async function getManuscriptStatus(
  manuscriptId: string,
): Promise<ManuscriptStatusResponse> {
  const res = await fetch(`${requireBaseUrl()}/api/v1/manuscripts/${manuscriptId}`);
  if (!res.ok) {
    throw new Error(`status falló con status ${res.status}`);
  }
  return res.json();
}

/**
 * GET /api/v1/manuscripts/{manuscriptId}/results
 * Conectado al backend real.
 */
export async function getManuscriptResults(
  manuscriptId: string,
): Promise<ManuscriptResultsResponse> {
  const res = await fetch(`${requireBaseUrl()}/api/v1/manuscripts/${manuscriptId}/results`);
  if (!res.ok) {
    throw new Error(`results falló con status ${res.status}`);
  }
  return res.json();
}
