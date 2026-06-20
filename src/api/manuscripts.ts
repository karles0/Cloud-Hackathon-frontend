// Punto único de import para toda la app — los componentes solo importan de aquí.
//
// VITE_USE_REAL_UPLOAD=true  -> getUploadUrl/uploadFileToStorage van al backend real.
// VITE_USE_REAL_UPLOAD=false -> todo el flujo usa el mock en memoria (sin red).
//
// getManuscriptStatus / getManuscriptResults siguen en mock hasta que el equipo
// de backend confirme esos 2 endpoints (ver TODOs en manuscripts.real.ts).

import * as real from "./manuscripts.real";
import * as mock from "./manuscripts.mock";

const useReal = import.meta.env.VITE_USE_REAL_UPLOAD === "true";

export const getUploadUrl = useReal ? real.getUploadUrl : mock.getUploadUrl;
export const uploadFileToStorage = useReal ? real.uploadFileToStorage : mock.uploadFileToStorage;

// Estos dos siempre usan la versión de manuscripts.real, que internamente
// hace fallback a mock hasta que se confirmen los endpoints reales.
export const getManuscriptStatus = real.getManuscriptStatus;
export const getManuscriptResults = real.getManuscriptResults;
