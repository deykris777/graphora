import { PropsWithChildren } from "react";

export const GlassPanel = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)';
        e.currentTarget.style.boxShadow = `0 0 30px var(--glow)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </div>
  );
};
