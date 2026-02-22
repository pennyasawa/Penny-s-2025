import { motion } from "framer-motion";
import type { Memory } from "@/lib/memories";

interface BoardingPassCardProps {
  memory: Memory;
  index: number;
  onClick: () => void;
  isScattered?: boolean;
}

export function BoardingPassCard({ memory, onClick }: BoardingPassCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        scale: 1.03,
        zIndex: 100,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
      }}
      whileTap={{ scale: 0.98 }}
      whileFocus={{
        y: -4,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View memories from ${memory.month} ${memory.year}: ${memory.from} to ${memory.to}`}
      className="cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-2xl"
      data-testid={`boarding-pass-${memory.id}`}
    >
      <div className="rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
        <img 
          src={memory.boardingPassImage} 
          alt={`Boarding pass from ${memory.from} to ${memory.to}`}
          className="w-full h-auto"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
