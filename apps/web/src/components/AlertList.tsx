import { AlertRecord } from "../types/alert";

interface AlertListProps {
  alerts: AlertRecord[];
}

export const AlertList = ({ alerts }: AlertListProps) => {
  if (alerts.length === 0) {
    return <div className="text-sm text-slate-500 dark:text-slate-400">No alerts yet.</div>;
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert._id ?? alert.message}
          className="rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5"
        >
          <div className="text-xs uppercase text-slate-500 dark:text-slate-400">
            {alert.severity}
          </div>
          <div className="text-sm text-slate-900 dark:text-white">{alert.message}</div>
        </div>
      ))}
    </div>
  );
};
