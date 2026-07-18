import { LogRecord } from "../types/log";

interface LogsTableProps {
  logs: LogRecord[];
}

export const LogsTable = ({ logs }: LogsTableProps) => {
  if (logs.length === 0) {
    return <div className="text-sm text-slate-500 dark:text-slate-400">No logs yet.</div>;
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div
          key={log._id ?? log.message}
          className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5"
        >
          <div>
            <div className="text-sm text-slate-900 dark:text-white">{log.message}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {log.serviceId ?? "system"}
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{log.level}</div>
        </div>
      ))}
    </div>
  );
}