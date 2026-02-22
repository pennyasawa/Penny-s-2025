import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Grid3X3, Shuffle, Filter, Calendar, Car, ChevronDown } from "lucide-react";
import { BoardingPassCard } from "@/components/BoardingPassCard";
import { MemoryModal } from "@/components/MemoryModal";
import { memories as initialMemories, type Memory } from "@/lib/memories";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import skyVideo from "@assets/854002-hd_1920_1080_24fps_1766993617400.mp4";

interface ScatterPosition {
  x: number;
  y: number;
  rotation: number;
}

interface DragPosition {
  x: number;
  y: number;
}

// Generate mobile scatter positions - same size cards, positioned more left and up
const generateMobileScatterPositions = (count: number): ScatterPosition[] => {
  const positions: ScatterPosition[] = [];
  
  // Cluster positioned more to the left and up
  const clusterCenterX = 32; // Shifted left
  const clusterCenterY = 28; // Moved up 10% (was 38)
  const clusterRadius = 18; // Slightly tighter cluster
  
  for (let i = 0; i < count; i++) {
    // Distribute cards in a spiral-like pattern from center
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const distance = (i % 3) * 6 + Math.random() * 6;
    
    const x = clusterCenterX + Math.cos(angle) * distance;
    const y = clusterCenterY + Math.sin(angle) * distance * 0.7; // Compress vertically
    
    positions.push({
      x: Math.max(5, Math.min(x, 55)),
      y: Math.max(12, Math.min(y, 55)),
      rotation: (Math.random() - 0.5) * 14, // -7 to +7 degrees
    });
  }
  
  return positions;
};

// Generate mobile organized positions - clean 3-column grid, shifted left and up
const generateMobileOrganizedPositions = (count: number): ScatterPosition[] => {
  const positions: ScatterPosition[] = [];
  const cols = 3;
  const cardWidth = 26; // Percentage of container width per card
  const rowHeight = 18; // Percentage of container height per row
  const startY = 12; // Moved up 3% more (was 15)
  
  // Calculate total width and center offset, shift 20% left total
  const totalWidth = cols * cardWidth;
  const startX = (100 - totalWidth) / 2 + cardWidth / 2 - 20; // Shifted 20% left total
  
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    
    positions.push({
      x: Math.max(3, startX + (col * cardWidth)), // Clamp to stay visible
      y: startY + (row * rowHeight),
      rotation: 0, // No rotation in organized mode
    });
  }
  
  return positions;
};

// Generate CENTERED scatter positions - clustered tightly in the middle
// First card (index 0) is placed dead center to cover video play button
const generateCenteredScatterPositions = (count: number): ScatterPosition[] => {
  const positions: ScatterPosition[] = [];
  
  // Centered cluster with balanced spacing
  const clusterWidth = 45;
  const clusterHeight = 35;
  const startX = (100 - clusterWidth) / 2;
  const startY = 5;
  
  for (let i = 0; i < count; i++) {
    // First card goes dead center to hide video play button
    if (i === 0) {
      positions.push({
        x: 38, // Center horizontally (accounting for card width)
        y: 18, // Center vertically over video controls
        rotation: -2, // Very slight tilt for natural look
      });
      continue;
    }
    
    const randomX = startX + Math.random() * clusterWidth;
    const randomY = startY + Math.random() * clusterHeight;
    
    // Clamp to ensure cards stay at least 80% visible on all viewports
    const x = Math.max(8, Math.min(randomX, 60));
    const y = Math.max(2, Math.min(randomY, 40));
    
    positions.push({
      x,
      y,
      rotation: (Math.random() - 0.5) * 16, // -8 to +8 degrees
    });
  }
  
  return positions;
};

// Generate organized positions - TWO horizontal rows, CENTERED on page
const generateOrganizedStackPositions = (count: number): ScatterPosition[] => {
  const positions: ScatterPosition[] = [];
  
  // Split cards between two rows
  const halfCount = Math.ceil(count / 2);
  const secondRowCount = count - halfCount;
  const cardWidth = 22; // Approximate card width in percentage
  const overlapAmount = 10; // Cards overlap by this much
  const effectiveCardWidth = cardWidth - overlapAmount;
  
  // Calculate total row widths
  const rowAWidth = (halfCount - 1) * effectiveCardWidth + cardWidth;
  const rowBWidth = (secondRowCount - 1) * effectiveCardWidth + cardWidth;
  
  // Center each row horizontally
  const rowAStartX = (100 - rowAWidth) / 2;
  const rowBStartX = (100 - rowBWidth) / 2;
  
  const rowAY = 11; // Moved up 3% (was 14)
  const rowBY = 35; // Moved up 3% (was 38)
  
  for (let i = 0; i < count; i++) {
    const isRowA = i < halfCount;
    const indexInRow = isRowA ? i : i - halfCount;
    
    if (isRowA) {
      positions.push({
        x: rowAStartX + (indexInRow * effectiveCardWidth),
        y: rowAY,
        rotation: 0,
      });
    } else {
      positions.push({
        x: rowBStartX + (indexInRow * effectiveCardWidth),
        y: rowBY,
        rotation: 0,
      });
    }
  }
  
  return positions;
};

export default function BoardingExperience() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrganized, setIsOrganized] = useState(false);
  const [scatterKey, setScatterKey] = useState(0);
  const [zIndices, setZIndices] = useState<Record<string, number>>({});
  const [shuffleDragOffsets, setShuffleDragOffsets] = useState<Record<string, DragPosition>>({});
  const [organizeDragOffsets, setOrganizeDragOffsets] = useState<Record<string, DragPosition>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "date" | "flights" | "local">("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxZRef = useRef(100);

  // Trigger entrance animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Force video autoplay on page load
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true; // Required for autoplay in most browsers
      video.play().catch(() => {
        // Autoplay was prevented, try again on user interaction
        const playOnInteraction = () => {
          video.play();
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
      });
    }
  }, []);

  // Local trip IDs
  const localTripIds = ["sf-gvl", "sf-nap", "sf-tah", "sf-yose", "sf-tah-winter"];

  // Filter memories based on current filter mode
  const filteredMemories = useMemo(() => {
    if (filterMode === "all") return initialMemories;
    if (filterMode === "flights") return initialMemories.filter(m => !localTripIds.includes(m.id));
    if (filterMode === "local") return initialMemories.filter(m => localTripIds.includes(m.id));
    if (filterMode === "date") {
      return [...initialMemories].sort((a, b) => {
        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });
    }
    return initialMemories;
  }, [filterMode]);

  // Generate scatter positions
  const scatterPositions = useMemo(() => {
    return generateCenteredScatterPositions(initialMemories.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scatterKey]);

  // Generate mobile scatter positions
  const mobileScatterPositions = useMemo(() => {
    return generateMobileScatterPositions(initialMemories.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scatterKey]);

  // Generate mobile organized positions
  const mobileOrganizedPositions = useMemo(() => {
    return generateMobileOrganizedPositions(filteredMemories.length);
  }, [filteredMemories.length]);

  const organizedPositions = useMemo(() => {
    return generateOrganizedStackPositions(filteredMemories.length);
  }, [filteredMemories.length]);

  const currentPositions = isOrganized ? organizedPositions : scatterPositions;
  const currentDragOffsets = isOrganized ? organizeDragOffsets : shuffleDragOffsets;
  const setCurrentDragOffsets = isOrganized ? setOrganizeDragOffsets : setShuffleDragOffsets;

  const handlePassClick = useCallback((memory: Memory) => {
    if (draggingId) return;
    setSelectedMemory(memory);
    setIsModalOpen(true);
  }, [draggingId]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMemory(null), 300);
  }, []);

  const handleShuffle = () => {
    setIsOrganized(false);
    setScatterKey(prev => prev + 1);
    setShuffleDragOffsets({}); // Reset shuffle drag offsets only
  };

  const handleOrganize = () => {
    setIsOrganized(true);
    // Always reset organize drag offsets to snap back to organized positions
    setOrganizeDragOffsets({});
  };

  // Bring card to front when interacting
  const bringToFront = useCallback((id: string) => {
    maxZRef.current += 1;
    setZIndices(prev => ({ ...prev, [id]: maxZRef.current }));
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((id: string) => {
    setDraggingId(id);
    bringToFront(id);
  }, [bringToFront]);

  // Handle drag end - persist position offset for current mode
  const handleDragEnd = useCallback((id: string, info: { offset: { x: number; y: number } }) => {
    setDraggingId(null);
    setCurrentDragOffsets(prev => ({
      ...prev,
      [id]: {
        x: (prev[id]?.x || 0) + info.offset.x,
        y: (prev[id]?.y || 0) + info.offset.y,
      }
    }));
  }, [setCurrentDragOffsets]);

  // Get z-index for a card
  // First card (index 0) gets higher z-index in shuffle mode to cover video controls
  const getZIndex = (id: string, baseIndex: number) => {
    if (zIndices[id]) return zIndices[id];
    // In shuffle mode, first card (baseIndex 0) gets z-index 50 to sit on top
    if (!isOrganized && baseIndex === 0) return 50;
    return 10 + baseIndex;
  };

  return (
    <div className="h-screen bg-background overflow-hidden relative">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src={skyVideo} type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="fixed inset-0 z-[1] bg-black/40 backdrop-blur-[1px]" />

      {/* Memories View - Direct Landing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 h-screen overflow-hidden flex flex-col"
      >
        {/* Header section - reduced padding */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="pt-8 md:pt-10 pb-4 px-6 md:px-12 text-center relative z-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-amber-400/20"
          >
            <Plane className="w-4 h-4 -rotate-45 text-amber-400" />
            <span className="text-sm font-medium tracking-wide text-stone-300">2025 Memories</span>
          </motion.div>

          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-2"
            data-testid="text-main-title"
          >
            where 2025 took me
          </h1>
          
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Tap to open my memory.
          </p>

          {/* Mobile Controls - placed below helper text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
            className="flex md:hidden items-center justify-center gap-2 mt-4"
          >
            <Button
              variant={!isOrganized ? "default" : "ghost"}
              size="sm"
              onClick={handleShuffle}
              className={`gap-2 ${!isOrganized ? 'bg-white text-zinc-900 hover:bg-white/90' : 'text-white hover:bg-white/10'}`}
              data-testid="button-shuffle-mobile"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle
            </Button>
            <Button
              variant={isOrganized ? "default" : "ghost"}
              size="sm"
              onClick={handleOrganize}
              className={`gap-2 ${isOrganized ? 'bg-white text-zinc-900 hover:bg-white/90' : 'text-white hover:bg-white/10'}`}
              data-testid="button-organize-mobile"
            >
              <Grid3X3 className="w-4 h-4" />
              Organize
            </Button>
          </motion.div>
        </motion.header>

        {/* Boarding Passes Area */}
        <main className="relative w-full px-4 md:px-8 flex-1 overflow-hidden">
          {/* Mobile: Scattered or organized layout */}
          <div className="block md:hidden relative" style={{ height: "65vh" }}>
            {(isOrganized ? filteredMemories : initialMemories).map((memory, index) => {
              // Use organized positions when in organize mode, scatter positions in shuffle mode
              const mobilePos = isOrganized 
                ? (mobileOrganizedPositions[index] || { x: 50, y: 20, rotation: 0 })
                : (mobileScatterPositions[index] || { x: 50, y: 30, rotation: 0 });
              
              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: isLoaded ? 1 : 0,
                    scale: 1,
                    rotate: mobilePos.rotation,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.04,
                    ease: "easeOut",
                  }}
                  className="absolute"
                  style={{
                    left: `${mobilePos.x}%`,
                    top: `${mobilePos.y}%`,
                    width: "155px",
                    zIndex: 10 + index,
                    transform: `translate(-50%, 0)`,
                  }}
                  onClick={() => handlePassClick(memory)}
                >
                  <BoardingPassCard
                    memory={memory}
                    index={index}
                    onClick={() => handlePassClick(memory)}
                    isScattered={!isOrganized}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Desktop: Draggable passes in both modes */}
          <div 
            ref={containerRef}
            className="hidden md:block relative min-h-[65vh]"
          >
            <AnimatePresence mode="sync">
              {(isOrganized ? filteredMemories : initialMemories).map((memory, index) => {
                const basePos = currentPositions[index] || { x: 30, y: 20, rotation: 0 };
                const dragOffset = currentDragOffsets[memory.id] || { x: 0, y: 0 };
                const isDragging = draggingId === memory.id;
                // First card (index 0) in shuffle mode is fixed to cover video controls
                const isFixedCard = !isOrganized && index === 0;
                
                return (
                  <motion.div
                    key={memory.id}
                    drag={!isFixedCard}
                    dragMomentum={false}
                    dragElastic={0}
                    dragConstraints={isOrganized ? { left: -150, right: 150, top: -80, bottom: 80 } : undefined}
                    onDragStart={() => !isFixedCard && handleDragStart(memory.id)}
                    onDragEnd={(_, info) => !isFixedCard && handleDragEnd(memory.id, info)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: isLoaded ? 1 : 0,
                      scale: isDragging ? 1.02 : 1,
                      x: isFixedCard ? 0 : dragOffset.x,
                      y: isFixedCard ? 0 : dragOffset.y,
                      rotate: basePos.rotation,
                    }}
                    whileHover={!isDragging && !isFixedCard ? { scale: 1.01 } : undefined}
                    transition={isDragging ? {
                      type: "tween",
                      duration: 0,
                    } : {
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 0.6,
                    }}
                    className="absolute w-[300px] lg:w-[320px]"
                    style={{
                      left: `${basePos.x}%`,
                      top: `${basePos.y}%`,
                      zIndex: getZIndex(memory.id, index),
                      cursor: isFixedCard ? 'pointer' : (isDragging ? 'grabbing' : 'grab'),
                      willChange: 'transform',
                    }}
                    onPointerDown={() => !isFixedCard && bringToFront(memory.id)}
                  >
                    <div 
                      className={`transition-shadow duration-150 ${isDragging ? 'shadow-2xl shadow-black/40' : 'shadow-lg shadow-black/20'}`}
                    >
                      <BoardingPassCard
                        memory={memory}
                        index={index}
                        onClick={() => handlePassClick(memory)}
                        isScattered={!isOrganized}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </main>

        {/* Organize / Shuffle Controls - Bottom (desktop only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          className="hidden md:flex items-center justify-center gap-2 pb-8"
        >
          <Button
            variant={!isOrganized ? "default" : "ghost"}
            size="sm"
            onClick={handleShuffle}
            className={`gap-2 ${!isOrganized ? 'bg-white text-zinc-900 hover:bg-white/90' : 'text-white hover:bg-white/10'}`}
            data-testid="button-shuffle"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </Button>
          <Button
            variant={isOrganized ? "default" : "ghost"}
            size="sm"
            onClick={handleOrganize}
            className={`gap-2 ${isOrganized ? 'bg-white text-zinc-900 hover:bg-white/90' : 'text-white hover:bg-white/10'}`}
            data-testid="button-organize"
          >
            <Grid3X3 className="w-4 h-4" />
            Organize
          </Button>
          
          {/* Filter dropdown - only in Organize mode */}
          {isOrganized && (
            <div className="ml-4 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterMode("all")}
                className={`gap-1.5 ${filterMode === "all" ? 'bg-amber-400/20 text-amber-300' : 'text-white/70 hover:bg-white/10'}`}
                data-testid="button-filter-all"
              >
                <Filter className="w-3.5 h-3.5" />
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterMode("date")}
                className={`gap-1.5 ${filterMode === "date" ? 'bg-amber-400/20 text-amber-300' : 'text-white/70 hover:bg-white/10'}`}
                data-testid="button-filter-date"
              >
                <Calendar className="w-3.5 h-3.5" />
                Date
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterMode("flights")}
                className={`gap-1.5 ${filterMode === "flights" ? 'bg-amber-400/20 text-amber-300' : 'text-white/70 hover:bg-white/10'}`}
                data-testid="button-filter-flights"
              >
                <Plane className="w-3.5 h-3.5 -rotate-45" />
                Flights
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterMode("local")}
                className={`gap-1.5 ${filterMode === "local" ? 'bg-amber-400/20 text-amber-300' : 'text-white/70 hover:bg-white/10'}`}
                data-testid="button-filter-local"
              >
                <Car className="w-3.5 h-3.5" />
                Local
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Memory Modal */}
      <MemoryModal
        memory={selectedMemory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
