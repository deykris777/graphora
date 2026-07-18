import { useAppStore } from "../store/useAppStore";
import { LogsTable } from "../components/LogsTable";

export const LogsPage = () => {
  const logs = useAppStore((state) => state.logs);

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-slate-900 dark:text-white">Logs Viewer</div>
      <LogsTable logs={logs} />
    </div>
  );
};
