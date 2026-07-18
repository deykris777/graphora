import { ThemeToggle } from "./ThemeToggle";
import { ProfileMenu } from "./ProfileMenu";

export const Topbar = () => {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 lg:px-8 backdrop-blur-md transition-colors duration-300"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg-base) 85%, transparent)', borderBottom: '1px solid var(--border)' }}
    >
      <div>
        <div className="text-[9px] uppercase tracking-[0.25em] font-mono" style={{ color: 'var(--text-muted)' }}>Realtime Observability</div>
        <div className="text-sm font-bold tracking-tight mt-0.5" style={{ color: 'var(--text-heading)' }}>Command Center</div>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(224, 247, 250, 0.05)', border: '1px solid rgba(224, 247, 250, 0.1)' }}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
          <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--accent-secondary)' }}>Live Stream</span>
        </div>
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </header>
  );
};
