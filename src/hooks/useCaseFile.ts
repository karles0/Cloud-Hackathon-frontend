import { useCallback, useEffect, useRef, useState } from "react";
import {
  getManuscriptResults,
  getManuscriptStatus,
  getUploadUrl,
  uploadFileToStorage,
} from "../api/manuscripts";
import type { CaseFile, ManuscriptResultsResponse } from "../types/manuscript";

const POLL_INTERVAL_MS = 3000;

interface UseCaseFileReturn {
  caseFile: CaseFile | null;
  results: ManuscriptResultsResponse | null;
  error: string | null;
  submit: (file: File) => Promise<void>;
  reset: () => void;
}

/**
 * Orquesta el flujo completo descrito en el Manifiesto de API:
 * 1. Pide upload-url
 * 2. Sube el archivo (PUT a la presigned URL)
 * 3. Hace polling cada 3s a /manuscripts/{id} hasta status === COMPLETED
 * 4. Pide /manuscripts/{id}/results
 */
export function useCaseFile(): UseCaseFileReturn {
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null);
  const [results, setResults] = useState<ManuscriptResultsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const submit = useCallback(
    async (file: File) => {
      setError(null);
      setResults(null);

      try {
        const { manuscriptId, uploadUrl } = await getUploadUrl({
          fileName: file.name,
          contentType: file.type || "application/pdf",
        });

        setCaseFile({
          manuscriptId,
          fileName: file.name,
          status: "PENDING",
          progress: { totalBatches: 0, processedBatches: 0 },
          globalIntegrityIndex: null,
          createdAt: Date.now(),
        });

        await uploadFileToStorage(uploadUrl, file);

        setCaseFile((prev) => (prev ? { ...prev, status: "PROCESSING" } : prev));

        pollRef.current = setInterval(async () => {
          try {
            const status = await getManuscriptStatus(manuscriptId);

            setCaseFile({
              manuscriptId: status.manuscriptId,
              fileName: status.fileName,
              status: status.status,
              progress: status.progress,
              globalIntegrityIndex: status.globalIntegrityIndex,
              topic: status.topic,
              createdAt: Date.now(),
            });

            if (status.status === "COMPLETED") {
              stopPolling();
              const finalResults = await getManuscriptResults(manuscriptId);
              setResults(finalResults);
            }

            if (status.status === "ERROR") {
              stopPolling();
              setError("El análisis no pudo completarse. Intenta con otro archivo.");
            }
          } catch {
            stopPolling();
            setError("Se perdió la conexión con el servidor de análisis.");
          }
        }, POLL_INTERVAL_MS);
      } catch {
        setError("No se pudo iniciar la subida. Verifica tu conexión e intenta de nuevo.");
      }
    },
    [stopPolling],
  );

  const reset = useCallback(() => {
    stopPolling();
    setCaseFile(null);
    setResults(null);
    setError(null);
  }, [stopPolling]);

  return { caseFile, results, error, submit, reset };
}
