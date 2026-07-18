import { useTheme } from "../app/theme";

export const SettingsPage = () => {
  const { mode } = useTheme();

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-slate-900 dark:text-white">Settings</div>
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        <div>Active theme: {mode}</div>
        <div className="mt-2">Theme selection persists across sessions.</div>
      </div>
    </div>
  );
};
