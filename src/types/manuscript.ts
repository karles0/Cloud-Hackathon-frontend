// Tipos derivados del "Manifiesto de API: Proyecto Centinela" v1.0.0
// Mantener sincronizado con el equipo de backend si el contrato cambia.

export type ManuscriptStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR";

export interface UploadUrlRequest {
  fileName: string;
  contentType: string;
}

export interface UploadUrlResponse {
  manuscriptId: string;
  fileKey: string;
  uploadUrl: string;
}

export interface ManuscriptProgress {
  totalBatches: number;
  processedBatches: number;
}

export interface ManuscriptStatusResponse {
  manuscriptId: string;
  fileName: string;
  status: ManuscriptStatus;
  progress: ManuscriptProgress;
  globalIntegrityIndex: number | null;
  /** Tema detectado por la Lambda Clasificador. No está en el manifiesto original
   *  pero es parte del flujo real (medicina | biotecnologia | ingenieria | general). */
  topic?: string;
}

export interface EvaluationResult {
  referenceId: string;
  citationText: string;
  isZombie: boolean;
  analysisContext: string;
}

export interface ManuscriptResultsResponse {
  manuscriptId: string;
  totalEvaluated: number;
  zombieCount: number;
  results: EvaluationResult[];
}

/** Estado local de una "investigación" (un manuscrito subido) en el front. */
export interface CaseFile {
  manuscriptId: string;
  fileName: string;
  status: ManuscriptStatus;
  progress: ManuscriptProgress;
  globalIntegrityIndex: number | null;
  topic?: string;
  createdAt: number;
}
