import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { colors } from "../../theme/tokens";

export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleX = useTransform(scrollYProgress, [0, 0.3], [1.2, isMobile ? 1 : 1.5]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [0.6, isMobile ? 1 : 1.5]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const containerScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "200vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        background: "transparent",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: "10%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        <motion.div
          style={{
            opacity: textOpacity,
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          {title}
        </motion.div>

        {/* MacBook Container */}
        <motion.div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1000px",
            height: "auto",
            aspectRatio: "16/10",
            transform: "translateZ(0)",
            scale: containerScale,
          }}
        >
          {/* Lid (Ecran) */}
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              background: "#272729",
              borderRadius: "20px 20px 0 0",
              border: "4px solid #1d1d1f",
              position: "relative",
              zIndex: 2,
              transformOrigin: "bottom",
              rotateX: rotate,
              overflow: "hidden",
              boxShadow: "0 0 50px rgba(0,0,0,0.5)",
            }}
          >
             {/* Screen Content */}
             <div style={{ width: "100%", height: "100%", background: "#000" }}>
                <img
                  src={src || "/asset/demo_studio.png"}
                  alt="Studio Interface"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {showGradient && (
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />
                )}
             </div>

             {/* Camera hole */}
             <div style={{
               position: "absolute",
               top: 10,
               left: "50%",
               transform: "translateX(-50%)",
               width: 6,
               height: 6,
               background: "#111",
               borderRadius: "50%"
             }} />
          </motion.div>

          {/* Base (Clavier) */}
          <div
            style={{
              width: "105%",
              height: "20px",
              background: "#1d1d1f",
              position: "absolute",
              bottom: "-20px",
              left: "-2.5%",
              borderRadius: "0 0 12px 12px",
              zIndex: 1,
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            {/* Notch */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "20%",
              height: "8px",
              background: "#2d2d2f",
              borderRadius: "0 0 8px 8px"
            }} />
          </div>

          {badge && (
            <div style={{ position: "absolute", top: -40, right: -40, zIndex: 10 }}>
              {badge}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
