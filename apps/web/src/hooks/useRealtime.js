import { useEffect } from "react";
import { getSocket } from "../realtime/socket";
import { useAppStore } from "../store/useAppStore";
export const useRealtime = () => {
    const addTraffic = useAppStore((state) => state.addTraffic);
    const setMetrics = useAppStore((state) => state.setMetrics);
    const updateService = useAppStore((state) => state.updateService);
    const addAlert = useAppStore((state) => state.addAlert);
    const setSocketConnections = useAppStore((state) => state.setSocketConnections);
    const addAnalyticsPoint = useAppStore((state) => state.addAnalyticsPoint);
    useEffect(() => {
        const socket = getSocket();
        socket.on("traffic:event", (payload) => {
            addTraffic(payload);
        });
        socket.on("metrics:update", (payload) => {
            setMetrics(payload);
            addAnalyticsPoint(payload);
        });
        socket.on("services:update", (payload) => {
            updateService(payload);
        });
        socket.on("alerts:new", (payload) => {
            addAlert(payload);
        });
        socket.on("socket:stats", (payload) => {
            setSocketConnections(payload.connections);
        });
        return () => {
            socket.off("traffic:event");
            socket.off("metrics:update");
            socket.off("services:update");
            socket.off("alerts:new");
            socket.off("socket:stats");
        };
    }, [addTraffic, addAlert, addAnalyticsPoint, setMetrics, setSocketConnections, updateService]);
};
