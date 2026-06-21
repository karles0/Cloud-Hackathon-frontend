// Punto único de import para toda la app — los componentes solo importan de aquí.
//
// VITE_USE_REAL_UPLOAD=true  -> TODO el flujo (upload + status + results) va al
//                              backend real de API Gateway (requiere VITE_API_BASE_URL).
// VITE_USE_REAL_UPLOAD=false -> TODO el flujo usa el mock en memoria (sin red).
//
// Las 4 funciones se eligen con el MISMO flag. Mezclar real con mock produce IDs
// que no existen en el otro lado y, por tanto, 404 en el polling.

import * as real from "./manuscripts.real";
import * as mock from "./manuscripts.mock";

// Parseo tolerante: acepta "true" / "TRUE" / " true " / "1" / "yes".
const flag = String(import.meta.env.VITE_USE_REAL_UPLOAD ?? "").trim().toLowerCase();
const useReal = flag === "true" || flag === "1" || flag === "yes";

console.log(
  `[API] modo = ${useReal ? "REAL (backend)" : "MOCK (datos simulados)"} · ` +
    `VITE_USE_REAL_UPLOAD=${JSON.stringify(import.meta.env.VITE_USE_REAL_UPLOAD)} · ` +
    `VITE_API_BASE_URL=${JSON.stringify(import.meta.env.VITE_API_BASE_URL)}`,
);

export const getUploadUrl = useReal ? real.getUploadUrl : mock.getUploadUrl;
export const uploadFileToStorage = useReal ? real.uploadFileToStorage : mock.uploadFileToStorage;
export const getManuscriptStatus = useReal ? real.getManuscriptStatus : mock.getManuscriptStatus;
export const getManuscriptResults = useReal ? real.getManuscriptResults : mock.getManuscriptResults;
