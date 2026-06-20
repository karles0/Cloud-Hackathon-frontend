// Punto único de import para toda la app.
// Cuando el backend esté listo: cambiar este re-export de "./manuscripts.mock"
// a un nuevo archivo "./manuscripts.real.ts" con fetch() reales al API Gateway.
// Los componentes nunca importan el mock directamente, así este swap no
// requiere tocar ninguna pantalla.

export {
  getUploadUrl,
  uploadFileToStorage,
  getManuscriptStatus,
  getManuscriptResults,
} from "./manuscripts.mock";
