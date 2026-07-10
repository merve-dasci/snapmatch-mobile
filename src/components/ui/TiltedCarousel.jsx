import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * TiltedCarousel renders its children in a horizontal scroll container with 3D perspective.
 * It features manual navigation buttons, scroll snapping, and applies a tilted depth effect
 * so cards on the sides look angled and curve inward, creating a 3D circular room effect.
 */
export default function TiltedCarousel({ 
  children, 
  className = "", 
  title,
  action,
  ...props 
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    const targetScroll = container.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: targetScroll,
      behavior: "smooth"
    });
  };

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`} {...props}>
      {/* Header section with optional title and custom controls */}
      <div className="flex justify-between items-center w-full px-1">
        {title && <h3 className="section-title !mb-0">{title}</h3>}
        
        <div className="flex items-center gap-2">
          {action && <div className="mr-2">{action}</div>}
          
          {/* Navigation Controls */}
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border border-[var(--glass-border)] bg-white/20 hover:bg-white/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer text-[var(--text-main)] shadow-[var(--glass-shadow-soft)]"
            title="Geri"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-[var(--glass-border)] bg-white/20 hover:bg-white/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer text-[var(--text-main)] shadow-[var(--glass-shadow-soft)]"
            title="İleri"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 3D Scroll Track Container */}
      <div className="relative w-full overflow-visible" style={{ perspective: "1500px" }}>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-4 scrollbar-hide w-full"
          style={{
            scrollSnapType: "x mandatory",
            transformStyle: "preserve-3d",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE
          }}
        >
          {/* Injecting 3D layouts onto children */}
          {React.Children.map(children, (child, idx) => {
            if (!child) return null;
            
            // Calculate a slight alternating perspective rotation based on index to create a curved wall feeling
            const odd = idx % 2 === 0;
            const rotY = odd ? -6 : 6;
            const rotX = 3;

            return (
              <div
                className="shrink-0 scroll-snap-align-center"
                style={{
                  scrollSnapAlign: "center",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                  transition: "transform 0.4s ease",
                }}
              >
                <div
                  className="transition-all duration-300 hover:z-30"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(0px)`,
                    transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(40px) scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(0px)`;
                  }}
                >
                  {child}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
