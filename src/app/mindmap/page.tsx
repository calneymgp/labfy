import { MindMapView } from "./mindmap-view";

export default function MindMapPage() {
  return (
    <section className="flex flex-1 flex-col gap-4 p-6">
      <div className="space-y-1.5">
        <h1 className="font-heading text-lg font-semibold tracking-tight">MindMap</h1>
        <p className="max-w-md text-xs text-muted-foreground">
          Visão em grafo do conhecimento do Labfy. Passe o mouse nas tags à direita para destacar
          os assuntos no grafo.
        </p>
      </div>
      <MindMapView />
    </section>
  );
}
