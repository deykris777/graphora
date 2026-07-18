import { PropsWithChildren } from "react";
import { GlassPanel } from "./GlassPanel";

interface ChartCardProps {
  title: string;
  subtitle?: string;
}

export const ChartCard = ({ title, subtitle, children }: PropsWithChildren<ChartCardProps>) => {
  return (
    <GlassPanel>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{title}</div>
          {subtitle ? (
            <div className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-faint)' }}>{subtitle}</div>
          ) : null}
        </div>
        <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--pulse-dot)' }} />
      </div>
      <div className="mt-5 h-56">{children}</div>
    </GlassPanel>
  );
};
