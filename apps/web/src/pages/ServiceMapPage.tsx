import { useAppStore } from "../store/useAppStore";
import { ServiceMapGraph } from "../graphs/ServiceMapGraph";

export const ServiceMapPage = () => {
  const services = useAppStore((state) => state.services);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900 dark:text-white">Service Map</div>
      <ServiceMapGraph services={services} />
    </div>
  );
};
