const STEPS = [
  {
    n: "01",
    title: "Extracción",
    body: "El manuscrito se convierte a texto y se aísla la sección de bibliografía, cita por cita.",
  },
  {
    n: "02",
    title: "Verificación",
    body: "Cada referencia se contrasta contra bases de retractaciones conocidas.",
  },
  {
    n: "03",
    title: "Contexto",
    body: "Un modelo de lenguaje analiza si el autor reconoce la retractación o la ignora.",
  },
  {
    n: "04",
    title: "Certificación",
    body: "Se emite un Índice de Integridad y el detalle de cada cita evaluada.",
  },
];

export function ProcessSteps() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-paper/12 bg-paper/12 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step) => (
        <div key={step.n} className="bg-ink px-6 py-7">
          <span className="font-mono text-xs text-seal">{step.n}</span>
          <h4 className="mt-3 font-display text-base text-paper">{step.title}</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-ink">{step.body}</p>
        </div>
      ))}
    </div>
  );
}
