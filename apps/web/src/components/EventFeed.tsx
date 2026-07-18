import { useAppStore } from "../store/useAppStore";
import { StatBadge } from "./StatBadge";
import { motion, AnimatePresence } from "framer-motion";

export const EventFeed = () => {
  const traffic = useAppStore((state) => state.traffic);

  return (
    <div className="space-y-2">
      {traffic.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-2xl mb-2">📡</div>
          <div className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>No live traffic yet.</div>
          <div className="text-[10px] mt-1" style={{ color: 'var(--text-faint)' }}>Waiting for incoming spans...</div>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {traffic.map((event) => (
            <motion.div
              key={`${event.traceId}-${event.timestamp}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="min-w-0">
                <div className="text-[13px] font-medium" style={{ color: 'var(--text-body)' }}>{event.service}</div>
                <div className="text-[10px] font-mono truncate" style={{ color: 'var(--text-faint)' }}>{event.traceId}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <div className="text-xs font-mono tabular-nums" style={{ color: 'var(--accent)' }}>{event.latency}ms</div>
                <StatBadge status={event.status} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};
