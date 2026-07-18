import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
export const TraceGraphView = ({ graph }) => {
    return (_jsx("div", { className: "h-72 rounded-2xl border border-slate-200/70 bg-white/70 dark:border-white/10 dark:bg-slate-950/40", children: _jsxs(ReactFlow, { nodes: graph.nodes, edges: graph.edges, fitView: true, children: [_jsx(Background, { gap: 24, color: "#1f2937" }), _jsx(Controls, {})] }) }));
};
