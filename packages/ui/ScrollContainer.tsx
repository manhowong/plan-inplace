import { useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';
import { ANIMATION_TRANSITIONS } from './constants';

interface ScrollContainerProps {
  children: ReactNode;
  className?: string; // Class for the scrolling viewport
  containerClassName?: string; // Class for the outer relative wrapper
}

/**
 * --------------------------------------------------------------------------
 * Component: ScrollContainer
 * --------------------------------------------------------------------------
 * A reusable wrapper that adds animated left/right scroll buttons to its
 * children when content overflows horizontally.
 */

export function ScrollContainer({ 
  children, 
  className,
  containerClassName
}: ScrollContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    
    // Check if there is more content to the left
    setShowLeftArrow(el.scrollLeft > 20);
    
    // Check if there is more content to the right
    const isAtRight = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 20;
    setShowRightArrow(!isAtRight && el.scrollWidth > el.clientWidth);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();
    
    // Update button states on ref changes or container resize
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    
    window.addEventListener('resize', checkScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const target = direction === 'left' ? 0 : scrollContainerRef.current.scrollWidth;
    scrollContainerRef.current.scrollTo({ left: target, behavior: 'smooth' });
  };

  return (
    <div className={cn("relative overflow-hidden h-full", containerClassName)}>
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className={cn("overflow-x-auto scroll-smooth h-full", className)}
      >
        {children}
      </div>

      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={ANIMATION_TRANSITIONS.modal}
            onClick={() => scrollTo('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-accent border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-[#2ebc98] transition-all group"
            title="Scroll to start"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-120 transition-transform" />
          </motion.button>
        )}
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={ANIMATION_TRANSITIONS.modal}
            onClick={() => scrollTo('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-50 w-12 h-12 bg-accent border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-[#2ebc98] transition-all group"
            title="Scroll to end"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-120 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
