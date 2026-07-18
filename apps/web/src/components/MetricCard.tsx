import { GlassPanel } from "./GlassPanel";
import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
}

export const MetricCard = ({ label, value, detail }: MetricCardProps) => {
  return (
    <GlassPanel>
      <div className="text-[10px] uppercase tracking-[0.15em] font-mono" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <motion.div
        className="mt-3 text-2xl font-bold font-mono tabular-nums"
        style={{ color: 'var(--accent)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        key={value}
      >
        {value}
      </motion.div>
      <div className="mt-2 text-[11px]" style={{ color: 'var(--text-faint)' }}>{detail}</div>
    </GlassPanel>
  );
};
