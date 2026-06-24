import React, { useEffect, useRef, useState } from "react";
import { colors } from "../../theme/tokens";

export const MacbookScroll = ({
  children,
  title,
  badge
}) => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (rect.height)));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rotateX = -90 + (scrollProgress * 90); // Part d'un Mac fermé (-90deg)
  const clampedRotateX = Math.min(0, rotateX);
  const lidOpacity = scrollProgress > 0.1 ? 1 : 0.5;

  return (
    <div
      ref={containerRef}
      style={{
        height: "300vh", // Grande zone de scroll pour l'effet d'ouverture
        position: "relative",
        background: colors.deepSpace,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1500px",
          overflow: "hidden"
        }}
      >
        {/* Title above Mac */}
        <div style={{
          position: "absolute",
          top: "10%",
          opacity: 1 - scrollProgress * 2,
          textAlign: "center",
          zIndex: 50,
          pointerEvents: scrollProgress > 0.5 ? "none" : "all"
        }}>
          {title}
        </div>

        {/* The MacBook Chassis */}
        <div style={{
          position: "relative",
          width: "90vw",
          maxWidth: "1200px",
          height: "60vh",
          maxHeight: "800px",
          transform: `scale(${0.6 + scrollProgress * 0.4})`,
          transition: "transform 0.1s ease-out",
          marginTop: scrollProgress > 0.5 ? "-10vh" : "0"
        }}>

          {/* Lid (L'écran qui s'ouvre) */}
          <div style={{
            width: "100%",
            height: "100%",
            background: "#1d1d1f",
            borderRadius: "12px 12px 0 0",
            border: "6px solid #1d1d1f",
            position: "relative",
            zIndex: 10,
            transformOrigin: "bottom",
            transform: `rotateX(${clampedRotateX}deg)`,
            transition: "transform 0.1s ease-out",
            overflow: "hidden",
            boxShadow: "0 -20px 50px rgba(0,0,0,0.5)",
          }}>
            {/* Screen Content - Here goes the actual site content */}
            <div style={{
              width: "100%",
              height: "100%",
              background: colors.deepSpace,
              overflowY: scrollProgress > 0.9 ? "auto" : "hidden",
              position: "relative"
            }}>
              {children}

              {/* Reflection effect when closed */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
                pointerEvents: "none",
                opacity: 1 - scrollProgress
              }} />
            </div>

            {/* Webcam */}
            <div style={{
               position: "absolute",
               top: 8,
               left: "50%",
               transform: "translateX(-50%)",
               width: 4,
               height: 4,
               background: "#333",
               borderRadius: "50%"
             }} />
          </div>

          {/* Base (Le clavier) */}
          <div style={{
            width: "104%",
            height: "20px",
            background: "#1d1d1f",
            position: "absolute",
            bottom: "-18px",
            left: "-2%",
            borderRadius: "0 0 12px 12px",
            zIndex: 5,
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          }}>
            {/* Trackpad area */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "25%",
              height: "6px",
              background: "#2d2d2f",
              borderRadius: "0 0 6px 6px"
            }} />
          </div>

          {badge && (
            <div style={{
              position: "absolute",
              bottom: 40,
              right: -20,
              zIndex: 20,
              opacity: scrollProgress,
              transform: `scale(${scrollProgress})`
            }}>
              {badge}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
