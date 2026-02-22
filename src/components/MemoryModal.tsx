import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plane, Calendar, Sparkles, ImageIcon, Car } from "lucide-react";
import type { Memory, PhotoMetadata } from "@/lib/memories";
import paperTexture from "@assets/navy-blue-oil-paint-textured-background_1767397772089.jpg";

// Map destination codes to full names
const destinationNames: Record<string, string> = {
  "ICN": "Seoul",
  "BKK": "Bangkok",
  "HAN": "Hanoi",
  "GVL": "Guerneville",
  "NAP": "Napa",
  "TAH": "Tahoe",
  "YOSE": "Yosemite",
  "LAX": "Los Angeles"
};

// Local trip IDs that should show car icon
const localTripIds = ["sf-gvl", "sf-nap", "sf-tah", "sf-yose", "sf-tah-winter"];

// Typewriter effect component
function TypewriterText({ text, speed = 25, className = "" }: { text: string; speed?: number; className?: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    
    if (!text) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
}

interface MemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
}

function PolaroidCard({ 
  index, 
  photo,
  rotation,
  isActive,
  isBlurred,
  isSelected,
  isHero,
  zIndex,
  onSelect,
  containerRef,
  isMobile = false
}: { 
  index: number; 
  photo: PhotoMetadata;
  rotation: number;
  isActive: boolean;
  isBlurred: boolean;
  isSelected: boolean;
  isHero: boolean;
  zIndex: number;
  onSelect: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isMobile?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const lastPositionRef = useRef({ left: 0, top: 0, width: 0 });

  // Capture position on click, not continuously (better performance)
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Capture position right before selecting
    if (cardRef.current && !isActive) {
      const rect = cardRef.current.getBoundingClientRect();
      lastPositionRef.current = { left: rect.left, top: rect.top, width: rect.width };
    }
    onSelect();
  }, [isActive, onSelect]);

  const baseScale = isHero ? 1.07 : 1;
  const selectedOutline = isSelected && !isActive ? "0 0 0 3px rgba(217, 161, 85, 0.6), 0 0 20px rgba(217, 161, 85, 0.3)" : "";
  
  const normalWidth = isMobile ? 90 : 200;
  const focusedWidth = isMobile ? 200 : 350;
  
  // Calculate focus position
  const getFocusPosition = useCallback(() => {
    if (isMobile) {
      const viewportHeight = window.innerHeight;
      const topBoundary = 60;
      const bottomBoundary = viewportHeight * 0.49;
      const centerY = topBoundary + (bottomBoundary - topBoundary) / 2;
      const centerX = window.innerWidth / 2;
      return { x: centerX - focusedWidth / 2, y: centerY - focusedWidth / 2 };
    } else {
      const viewportCenterX = window.innerWidth * 0.35;
      const viewportCenterY = window.innerHeight * 0.5;
      return { x: viewportCenterX - focusedWidth / 2, y: viewportCenterY - focusedWidth / 2 - 30 };
    }
  }, [isMobile, focusedWidth]);
  
  // When active, render the focused version
  if (isActive) {
    const startPos = lastPositionRef.current;
    const focusPos = getFocusPosition();
    
    return (
      <>
        {/* Placeholder to maintain layout */}
        <div 
          ref={cardRef}
          style={{ 
            width: normalWidth,
            height: isMobile ? normalWidth * 1.22 : normalWidth * 1.25,
            visibility: 'hidden'
          }} 
        />
        {/* Focused polaroid - simple animation, no complex effects */}
        <motion.div
          className="bg-[#f5f0e8] rounded-sm select-none cursor-pointer fixed"
          style={{
            boxShadow: isMobile 
              ? "0 20px 40px rgba(0,0,0,0.5)" 
              : "0 60px 120px rgba(0,0,0,0.7), 0 30px 60px rgba(0,0,0,0.6)",
            zIndex: 300,
            padding: isMobile ? '4px' : '12px',
            paddingBottom: isMobile ? '12px' : '40px',
            willChange: 'transform'
          }}
          initial={{ 
            left: startPos.left,
            top: startPos.top,
            width: startPos.width || normalWidth,
            rotate: rotation
          }}
          animate={{ 
            left: focusPos.x,
            top: focusPos.y,
            width: focusedWidth,
            rotate: 0
          }}
          onClick={handleClick}
          transition={{ 
            duration: isMobile ? 0.3 : 0.45, 
            ease: "easeOut"
          }}
        >
          <div className="aspect-square overflow-hidden relative pointer-events-none">
            <img 
              src={photo.src} 
              alt={photo.title}
              className="w-full h-full"
              style={{ objectFit: "cover" }}
              draggable={false}
            />
          </div>
        </motion.div>
      </>
    );
  }
  
  return (
    <motion.div
      ref={cardRef}
      className={`bg-[#f5f0e8] rounded-sm flex-shrink-0 relative select-none cursor-pointer ${isMobile ? 'p-0.5 pb-2' : 'p-3 pb-10'}`}
      style={{
        boxShadow: `0 4px 20px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)${selectedOutline ? ", " + selectedOutline : ""}`,
        zIndex: zIndex,
        opacity: isBlurred ? 0.4 : 1,
        width: normalWidth,
        willChange: isMobile ? 'auto' : 'transform'
      }}
      initial={{ opacity: 0, rotate: rotation }}
      animate={{ 
        opacity: isBlurred ? 0.4 : 1, 
        scale: baseScale,
        rotate: rotation
      }}
      onClick={handleClick}
      whileHover={!isMobile && !isBlurred ? { 
        scale: baseScale * 1.08,
        boxShadow: "0 20px 45px rgba(0,0,0,0.4), 0 12px 20px rgba(0,0,0,0.3)",
        transition: { duration: 0.25, ease: "easeOut" }
      } : undefined}
      transition={{ 
        duration: isMobile ? 0.2 : 0.35, 
        delay: isMobile ? 0 : 0.02 + index * 0.02,
        ease: "easeOut"
      }}
    >
      <div className="aspect-square overflow-hidden relative pointer-events-none">
        <img 
          src={photo.src} 
          alt={photo.title}
          className="w-full h-full"
          style={{ objectFit: "cover" }}
          draggable={false}
        />
      </div>
    </motion.div>
  );
}

export function MemoryModal({ memory, isOpen, onClose }: MemoryModalProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zIndices, setZIndices] = useState<Record<number, number>>({});
  const [maxZ, setMaxZ] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(36); // percentage of viewport height
  const polaroidContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const sheetDragStartY = useRef<number | null>(null);
  const sheetStartHeight = useRef<number>(36);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(null);
      setZIndices({});
      setMaxZ(10);
      setCurrentPage(0);
    }
  }, [isOpen]);

  // Pagination for mobile - 6 photos per page (2 rows x 3 columns)
  const photosPerPage = 6;
  const totalPages = memory ? Math.ceil(memory.photos.length / photosPerPage) : 1;
  const paginatedPhotos = useMemo(() => {
    if (!memory) return [];
    const start = currentPage * photosPerPage;
    return memory.photos.slice(start, start + photosPerPage);
  }, [memory, currentPage]);

  // Touch handlers for swipe navigation (carousel)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const threshold = 50;

    if (diff > threshold && currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      setActiveIndex(null);
    } else if (diff < -threshold && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setActiveIndex(null);
    }
    touchStartX.current = null;
  }, [currentPage, totalPages]);

  // Touch handlers for bottom sheet drag
  const handleSheetDragStart = useCallback((e: React.TouchEvent) => {
    sheetDragStartY.current = e.touches[0].clientY;
    sheetStartHeight.current = sheetHeight;
  }, [sheetHeight]);

  const handleSheetDrag = useCallback((e: React.TouchEvent) => {
    if (sheetDragStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = sheetDragStartY.current - currentY;
    const deltaPercent = (deltaY / window.innerHeight) * 100;
    const newHeight = Math.max(25, Math.min(70, sheetStartHeight.current + deltaPercent));
    setSheetHeight(newHeight);
  }, []);

  const handleSheetDragEnd = useCallback(() => {
    sheetDragStartY.current = null;
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !memory) return;
      
      if (e.key === "Escape") {
        if (activeIndex !== null) {
          setActiveIndex(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, memory, onClose, activeIndex]);

  const polaroidStyles = useMemo(() => {
    if (!memory) return [];
    return memory.photos.map((_, idx) => ({
      rotation: [-5, 4, -3, 6, -4, 3, -5, 5, -2, 4][idx % 10]
    }));
  }, [memory]);

  const handlePolaroidSelect = useCallback((idx: number) => {
    if (activeIndex === idx) {
      setActiveIndex(null);
    } else {
      setActiveIndex(idx);
      const newZ = maxZ + 1;
      setMaxZ(newZ);
      setZIndices(prev => ({ ...prev, [idx]: newZ }));
    }
  }, [activeIndex, maxZ]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (activeIndex !== null) {
        setActiveIndex(null);
      } else {
        onClose();
      }
    }
  }, [activeIndex, onClose]);

  if (!memory) return null;

  const hasPhotos = memory.photos && memory.photos.length > 0;
  const selectedPhoto = activeIndex !== null ? memory.photos[activeIndex] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)"
          }}
          onPointerDown={handleBackdropClick}
          data-testid="collection-overlay"
        >
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.35) 100%)"
            }}
          />

          <AnimatePresence>
            {activeIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-[200] cursor-pointer md:backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(null);
                }}
                data-testid="focus-overlay"
              />
            )}
          </AnimatePresence>

          {/* Desktop: "Click anywhere to return" at bottom */}
          <AnimatePresence>
            {activeIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[400] pointer-events-none hidden md:block"
              >
                <span 
                  className="text-white/50 text-xs tracking-widest"
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '12px',
                    letterSpacing: '0.1em'
                  }}
                >
                  Click anywhere to return
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Layout */}
          <div className="relative w-full h-full hidden md:flex items-center justify-center p-6 md:p-10 pointer-events-none">
            <div 
              ref={polaroidContainerRef}
              className="flex-1 flex flex-col items-center justify-center h-full max-w-3xl mr-4 md:mr-8 relative pointer-events-auto"
            >
              <motion.div
                className="text-center mb-12 flex-shrink-0"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-3 border border-amber-400/20">
                  {localTripIds.includes(memory.id) ? (
                    <Car className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Plane className="w-4 h-4 text-amber-400 -rotate-45" />
                  )}
                  <span className="text-sm font-medium text-stone-300 tracking-wide">
                    {memory.month} {memory.year}
                  </span>
                </div>
                <h2 
                  className="text-3xl md:text-4xl font-semibold text-white"
                  data-testid="text-trip-title"
                >
                  {memory.from} → {memory.to}
                </h2>
              </motion.div>

              {hasPhotos ? (
                <div className="relative">
                  <div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 w-[120%] h-[80%] pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse 60% 40% at 50% 70%, rgba(0,0,0,0.25) 0%, transparent 70%)",
                      filter: "blur(30px)"
                    }}
                  />
                  
                  <motion.div
                    className="flex flex-wrap justify-center items-center content-center gap-5 md:gap-6 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    {memory.photos.map((photo, idx) => (
                      <PolaroidCard 
                        key={idx}
                        index={idx} 
                        photo={photo}
                        rotation={polaroidStyles[idx]?.rotation || 0} 
                        isActive={activeIndex === idx}
                        isBlurred={activeIndex !== null && activeIndex !== idx}
                        isSelected={activeIndex === idx}
                        isHero={idx === 1}
                        zIndex={zIndices[idx] || idx + 1}
                        onSelect={() => handlePolaroidSelect(idx)}
                        containerRef={polaroidContainerRef}
                      />
                    ))}
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <p className="text-white/50 text-lg">No photos yet for this trip</p>
                </motion.div>
              )}
            </div>

            <motion.div
              className="w-[360px] min-h-[580px] rounded-lg p-6 flex-shrink-0 pointer-events-auto relative z-[250] overflow-hidden"
              style={{
                boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.35), 4px 4px 0 rgba(0,0,0,0.1)",
                transform: "rotate(0.5deg)"
              }}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${paperTexture})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              <div className="relative z-10 flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  {localTripIds.includes(memory.id) ? (
                    <Car className="w-4 h-4" />
                  ) : (
                    <Plane className="w-4 h-4 -rotate-45" />
                  )}
                  <span className="text-sm font-semibold tracking-wider uppercase">{destinationNames[memory.to] || memory.to}</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 text-stone-300 flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors"
                  data-testid="button-close-modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative z-10 h-px bg-gradient-to-r from-amber-400/50 via-amber-400/25 to-transparent mb-4" />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2 text-stone-400 text-sm">
                  <Calendar className="w-3.5 h-3.5 text-amber-400/70" />
                  <span>{memory.month} {memory.year}</span>
                </div>

                <p className="text-stone-300 text-sm leading-relaxed">
                  {memory.caption}
                </p>

                {memory.highlights.length > 0 && (
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-amber-400 mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold tracking-wider uppercase">Highlights</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {memory.highlights.map((highlight, idx) => (
                        <span key={idx} className="text-stone-300 text-sm bg-white/5 px-3 py-1 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-amber-400/20">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <span className="block text-xs text-amber-400/70 uppercase tracking-wider mb-1">Flight</span>
                      <span className="text-amber-300 font-mono font-medium text-sm">{memory.flight}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Gate</span>
                      <span className="text-stone-300 font-mono text-sm">{memory.gate}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-stone-400 uppercase tracking-wider mb-1">Seat</span>
                      <span className="text-stone-300 font-mono text-sm">{memory.seat}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-amber-400/20">
                  <AnimatePresence mode="wait">
                    {selectedPhoto ? (
                      <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2 text-amber-400 mb-2">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-sm font-semibold tracking-wider uppercase">{selectedPhoto.title}</span>
                        </div>
                        <p className="text-stone-300 text-sm leading-relaxed">
                          <TypewriterText 
                            text={`${selectedPhoto.caption}${selectedPhoto.note ? ` ${selectedPhoto.note}` : ''}`}
                            speed={20}
                          />
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex items-center gap-2 text-amber-400 mb-2">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-sm font-semibold tracking-wider uppercase">The Vibe</span>
                        </div>
                        <p className="text-stone-500 text-sm italic">
                          Click a photo to see what it was about.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Layout - With bottom sheet */}
          <div className="relative w-full h-full flex md:hidden flex-col pointer-events-auto">
            {/* Close button - fixed position on mobile, hidden when polaroid focused */}
            <AnimatePresence>
              {activeIndex === null && (
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-stone-300 flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors z-[400]"
                  data-testid="button-close-modal-mobile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Main content area - polaroids */}
            <div className="flex-1 flex flex-col items-center pt-12 px-4 pb-4 overflow-hidden">
              {/* Trip Header */}
              <motion.div
                className="text-center mb-10 flex-shrink-0"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm mb-2 border border-amber-400/20">
                  {localTripIds.includes(memory.id) ? (
                    <Car className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Plane className="w-3.5 h-3.5 text-amber-400 -rotate-45" />
                  )}
                  <span className="text-xs font-medium text-stone-300 tracking-wide">
                    {memory.month} {memory.year}
                  </span>
                </div>
                <h2 
                  className="text-2xl font-semibold text-white"
                  data-testid="text-trip-title-mobile"
                >
                  {memory.from} → {memory.to}
                </h2>
              </motion.div>

              {/* Polaroid Grid - 2 rows max with carousel pagination */}
              {hasPhotos && (
                <div 
                  ref={polaroidContainerRef}
                  className="relative w-full px-2"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      className="flex flex-wrap justify-center gap-1.5"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ 
                        duration: 0.2, 
                        ease: "easeOut"
                      }}
                    >
                      {paginatedPhotos.map((photo, idx) => {
                        const globalIdx = currentPage * photosPerPage + idx;
                        return (
                          <div 
                            key={globalIdx} 
                            className="flex-shrink-0"
                            style={{ width: 'calc(33.333% - 6px)' }}
                          >
                            <PolaroidCard 
                              index={globalIdx} 
                              photo={photo}
                              rotation={polaroidStyles[globalIdx]?.rotation || 0} 
                              isActive={activeIndex === globalIdx}
                              isBlurred={activeIndex !== null && activeIndex !== globalIdx}
                              isSelected={activeIndex === globalIdx}
                              isHero={idx === 1}
                              zIndex={zIndices[globalIdx] || globalIdx + 1}
                              onSelect={() => handlePolaroidSelect(globalIdx)}
                              containerRef={polaroidContainerRef}
                              isMobile={true}
                            />
                          </div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>

                  {/* Pagination dots */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-3">
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentPage(idx);
                            setActiveIndex(null);
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            idx === currentPage 
                              ? 'bg-amber-400 scale-110' 
                              : 'bg-white/30 hover:bg-white/50'
                          }`}
                          data-testid={`button-carousel-dot-${idx}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>


            {/* Bottom Sheet - taller when polaroid is focused, draggable via handle */}
            <motion.div
              className="w-full rounded-t-2xl relative overflow-hidden"
              style={{
                height: `${activeIndex !== null ? Math.max(sheetHeight, 46) : sheetHeight}vh`,
                boxShadow: "0 -10px 40px rgba(0,0,0,0.4)",
                zIndex: 250
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
            >
              {/* Paper texture background */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${paperTexture})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              
              {/* Drag handle - larger touch target for better usability */}
              <div 
                className="relative z-20 flex justify-center items-center py-4 cursor-grab active:cursor-grabbing touch-none select-none"
                onTouchStart={handleSheetDragStart}
                onTouchMove={handleSheetDrag}
                onTouchEnd={handleSheetDragEnd}
                style={{ touchAction: 'none' }}
              >
                <div className="w-12 h-1.5 rounded-full bg-white/40" />
              </div>
              
              {/* Content - no inner scrolling */}
              <div className="relative z-10 px-5 pb-6 overflow-hidden h-full">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  {localTripIds.includes(memory.id) ? (
                    <Car className="w-3.5 h-3.5" />
                  ) : (
                    <Plane className="w-3.5 h-3.5 -rotate-45" />
                  )}
                  <span className="text-xs font-semibold tracking-wider uppercase">{destinationNames[memory.to] || memory.to}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-amber-400/50 via-amber-400/25 to-transparent mb-3" />

                <p className="text-stone-300 text-xs leading-relaxed mb-3">
                  {memory.caption}
                </p>

                {memory.highlights.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 text-amber-400 mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-[10px] font-semibold tracking-wider uppercase">Highlights</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {memory.highlights.map((highlight, idx) => (
                        <span key={idx} className="text-stone-300 text-xs bg-white/5 px-2 py-0.5 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Photo Info */}
                <div className="pt-3 border-t border-amber-400/20">
                  <AnimatePresence mode="wait">
                    {selectedPhoto ? (
                      <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-1.5 text-amber-400 mb-2">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold tracking-wider uppercase">{selectedPhoto.title}</span>
                        </div>
                        <p className="text-stone-300 text-xs leading-relaxed">
                          <TypewriterText 
                            text={`${selectedPhoto.caption}${selectedPhoto.note ? ` ${selectedPhoto.note}` : ''}`}
                            speed={20}
                          />
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex items-center gap-1.5 text-amber-400 mb-2">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold tracking-wider uppercase">The Vibe</span>
                        </div>
                        <p className="text-stone-500 text-xs italic">
                          Tap a photo to see what it was about.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
