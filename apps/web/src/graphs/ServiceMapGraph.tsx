import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { ServiceSnapshot } from "../types/service";

interface ServiceMapGraphProps {
  services: ServiceSnapshot[];
}

export const ServiceMapGraph = ({ services }: ServiceMapGraphProps) => {
  if (services.length === 0) {
    return (
      <div className="flex h-[520px] items-center justify-center rounded-2xl border border-slate-200/70 bg-white/70 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-400">
        No services reporting yet.
      </div>
    );
  }

  const nodes = services.map((service, index) => ({
    id: service.serviceId,
    data: {
      label: `${service.name}\n${service.avgLatency}ms avg`
    },
    position: { x: (index % 4) * 220, y: Math.floor(index / 4) * 160 }
  }));

  const edges = services.slice(1).map((service, index) => ({
    id: `${services[0].serviceId}-${service.serviceId}`,
    source: services[0].serviceId,
    target: service.serviceId,
    label: `${service.p95Latency}ms p95`,
    animated: true
  }));

  return (
    <div className="h-[520px] rounded-2xl border border-slate-200/70 bg-white/70 dark:border-white/10 dark:bg-slate-950/40">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background gap={24} color="#1f2937" />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};
