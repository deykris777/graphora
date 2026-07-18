import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChartCard } from "../components/ChartCard";
import { EventFeed } from "../components/EventFeed";
import { LiveTrafficGraph } from "../graphs/LiveTrafficGraph";
import { useAppStore } from "../store/useAppStore";
export const LiveTrafficPage = () => {
    const traffic = useAppStore((state) => state.traffic);
    return (_jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.2fr_0.8fr]", children: [_jsx(ChartCard, { title: "Latency Stream", subtitle: "Realtime request flow", children: _jsx(LiveTrafficGraph, { events: traffic }) }), _jsx(ChartCard, { title: "Live Event Feed", subtitle: "Trace spans", children: _jsx("div", { className: "h-56 overflow-y-auto", children: _jsx(EventFeed, {}) }) })] }));
};
