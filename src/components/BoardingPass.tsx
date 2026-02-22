import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, ArrowRight, ScanLine, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Departure } from "@shared/schema";

interface BoardingPassProps {
  category: string;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  restrictedItems: string;
  onUpdateItems: (val: string) => void;
  onClear: () => void;
  isClearing: boolean;
}

export function BoardingPass({
  category,
  index,
  isActive,
  isCompleted,
  restrictedItems,
  onUpdateItems,
  onClear,
  isClearing,
}: BoardingPassProps) {
  const [inputValue, setInputValue] = useState(restrictedItems);

  // Sync local input state with props only when becoming active or mounted
  useEffect(() => {
    setInputValue(restrictedItems);
  }, [restrictedItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    onUpdateItems(newVal);
  };

  const flightNumber = `2025-00${index + 1}`;
  
  // Animation variants
  const variants = {
    initial: { scale: 0.95, y: 40, opacity: 0, rotateX: 10 },
    active: { 
      scale: 1, 
      y: 0, 
      opacity: 1, 
      rotateX: 0,
      zIndex: 10,
      transition: { type: "spring", damping: 20, stiffness: 100 } 
    },
    completed: { 
      scale: 0.92, 
      y: -60 - (index * 10), 
      opacity: 0.6,
      rotateX: 5,
      zIndex: 5 - index,
      transition: { duration: 0.5, ease: "anticipate" } 
    },
    hidden: { scale: 0.9, y: 100, opacity: 0 }
  };

  const state = isActive ? "active" : isCompleted ? "completed" : "initial";

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate={state}
      className={cn(
        "relative w-full max-w-md mx-auto perspective-1000",
        !isActive && !isCompleted && "hidden" // Hide upcoming cards to reduce DOM clutter visually
      )}
    >
      {/* Main Pass Container */}
      <div className="bg-[#f0f0ea] text-zinc-900 rounded-3xl overflow-hidden shadow-2xl paper-texture relative transform-style-3d border border-white/40">
        
        {/* Top Section - Flight Info */}
        <div className="bg-zinc-900 text-white p-6 relative overflow-hidden">
          {/* Subtle noise on dark header too */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')]"></div>
          
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-zinc-400 mb-1">BOARDING PASS</div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Plane className="w-5 h-5 -rotate-45" />
                DEPARTURE
              </h2>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono tracking-widest text-zinc-400 mb-1">FLIGHT</div>
              <div className="font-mono text-lg text-amber-500">{flightNumber}</div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-zinc-800 pt-4">
            <div>
              <div className="text-[9px] font-mono text-zinc-500 uppercase">From</div>
              <div className="font-bold text-lg">2025</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <ArrowRight className="w-5 h-5 text-zinc-600" />
            </div>
            <div className="text-right">
              <div className="text-[9px] font-mono text-zinc-500 uppercase">To</div>
              <div className="font-bold text-lg text-amber-500">RELEASE</div>
            </div>
          </div>
        </div>

        {/* Perforation Line */}
        <div className="relative h-4 bg-[#f0f0ea] flex items-center">
          <div className="absolute left-0 w-4 h-4 rounded-r-full bg-background -ml-2"></div>
          <div className="w-full border-b-2 border-dashed border-zinc-300 mx-4"></div>
          <div className="absolute right-0 w-4 h-4 rounded-l-full bg-background -mr-2"></div>
        </div>

        {/* Body Section */}
        <div className="p-6 pt-2">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">PASSENGER</div>
              <div className="font-semibold text-zinc-800">YOU</div>
            </div>
            <div>
              <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">DATE</div>
              <div className="font-semibold text-zinc-800">DEC 31</div>
            </div>
            <div>
              <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">GATE</div>
              <div className="font-semibold text-zinc-800">{category}</div>
            </div>
            <div>
              <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">SEAT</div>
              <div className="font-mono text-zinc-800">NO RETURN</div>
            </div>
          </div>

          {/* Restricted Items Input */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <label className="text-[10px] font-mono font-bold text-red-700 uppercase tracking-wider">
                Restricted Items (What are you leaving behind?)
              </label>
            </div>
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              disabled={isCompleted || isClearing}
              placeholder={`List the ${category.toLowerCase()} you are leaving in 2025...`}
              className="w-full bg-white border border-zinc-200 rounded-lg p-4 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all font-sans placeholder:text-zinc-300 shadow-inner"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-end justify-between border-t border-zinc-200 pt-6">
             <div className="barcode opacity-60">
                {/* CSS Barcode Simulation */}
                <div className="h-8 flex gap-[2px] items-end">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="bg-zinc-800" style={{
                      width: Math.random() > 0.5 ? 2 : 1,
                      height: Math.random() > 0.5 ? '100%' : '70%'
                    }}></div>
                  ))}
                </div>
                <div className="text-[8px] font-mono mt-1 tracking-[0.2em]">{flightNumber}</div>
             </div>

             <div className="flex-1 flex justify-end">
               {isCompleted ? (
                 <div className="flex items-center gap-2 text-green-700 font-mono text-xs font-bold border border-green-700/20 bg-green-50 px-3 py-1.5 rounded-full">
                   <Check className="w-3 h-3" /> DEPARTURE CONFIRMED
                 </div>
               ) : (
                 <button
                   onClick={onClear}
                   disabled={isClearing || !inputValue.trim()}
                   className={cn(
                     "group relative overflow-hidden bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                     "shadow-lg shadow-zinc-900/20"
                   )}
                 >
                   <span className="relative z-10 flex items-center gap-2">
                     {isClearing ? "Scanning..." : "Scan to Clear"}
                     <ScanLine className="w-4 h-4" />
                   </span>
                   {isClearing && (
                     <motion.div 
                       initial={{ x: "-100%" }}
                       animate={{ x: "100%" }}
                       transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                       className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                     />
                   )}
                 </button>
               )}
             </div>
          </div>
        </div>

        {/* Scan Beam Effect */}
        <AnimatePresence>
          {isClearing && (
            <motion.div
              initial={{ top: -10, opacity: 0 }}
              animate={{ top: "120%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-2 bg-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)] z-50 pointer-events-none blur-sm"
            />
          )}
        </AnimatePresence>

        {/* STAMP OVERLAY */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ scale: 2, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 0.8, rotate: -15 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            >
              <div className="border-4 border-red-700/60 text-red-700/60 font-black text-6xl uppercase tracking-widest px-8 py-4 rounded-xl mix-blend-multiply rotate-[-15deg] backdrop-blur-[1px]">
                RELEASED
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
