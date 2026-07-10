import React, { useState, useRef } from "react";

/**
 * TiltedCard component creates a highly responsive, premium 3D tilt-on-hover effect.
 * It tracks mouse movement over the card and applies transform styles (rotateX, rotateY, translateZ)
 * to simulate depth and interactivity, accompanied by a dynamic radial shine overlay.
 */
export default function TiltedCard({ 
  children, 
  className = "", 
  onClick, 
  maxTilt = 10,
  scale = 1.03,
  lift = 15,
  style = {},
  ...props 
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate normalized mouse positions from -0.5 (left/top) to 0.5 (right/bottom)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  // Combine custom styles with the 3D transform calculations
  const tiltStyle = {
    ...style,
    transformStyle: "preserve-3d",
    willChange: "transform, box-shadow",
    ...(isHovered
      ? {
          transform: `perspective(1000px) rotateX(${ -coords.y * maxTilt }deg) rotateY(${ coords.x * maxTilt }deg) scale3d(${scale}, ${scale}, ${scale}) translateZ(${lift}px)`,
          transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.15s ease",
          zIndex: 10,
          boxShadow: "var(--premium-glow-shadow, 0 22px 50px rgba(92, 112, 149, 0.18))"
        }
      : {
          transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)`,
          transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease"
        })
  };

  // Dynamic radial gradient shine that follows the cursor
  const shineStyle = isHovered
    ? {
        background: `radial-gradient(circle 180px at ${ (coords.x + 0.5) * 100 }% ${ (coords.y + 0.5) * 100 }%, rgba(255, 255, 255, 0.18), transparent 80%)`,
        opacity: 1
      }
    : {
        background: "transparent",
        opacity: 0,
        transition: "opacity 0.5s ease"
      };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      style={tiltStyle}
      {...props}
    >
      {/* Shine overlay */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
        style={shineStyle}
      />
      
      {/* Container to enforce preserve-3d on contents if they have their own 3D layers */}
      <div className="w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
