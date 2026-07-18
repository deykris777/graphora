import { useAppStore } from "../store/useAppStore";
import { AlertList } from "../components/AlertList";

export const AlertsPage = () => {
  const alerts = useAppStore((state) => state.alerts);

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-slate-900 dark:text-white">Alerts System</div>
      <AlertList alerts={alerts} />
    </div>
  );
};
