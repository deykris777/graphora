import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from "../store/useAppStore";
import { ServiceMapGraph } from "../graphs/ServiceMapGraph";
export const ServiceMapPage = () => {
    const services = useAppStore((state) => state.services);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "text-xl font-semibold text-slate-900 dark:text-white", children: "Service Map" }), _jsx(ServiceMapGraph, { services: services })] }));
};
