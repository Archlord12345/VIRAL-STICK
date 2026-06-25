/**
 * CompanionAvatarWeb — Style Duolingo
 * Fond coloré arrondi, illustration centrée, aucun ring technique
 */
import React from "react";
import { colors } from "../theme/tokens";

const COMPANIONS_PNG = {
  arch: "/asset/compagnons/arch_sans_fond.png",
  para: "/asset/compagnons/para_sans_fond.png",
  secu: "/asset/compagnons/secu_sans_fond.png",
  data: "/asset/compagnons/data_sans_fond.png",
  bio:  "/asset/compagnons/bio_sans_fond.png",
  ubu:  "/asset/compagnons/ubu_sans_fond.png",
  art:  "/asset/compagnons/art_sans_fond.png",
};

// Fond pastel dérivé de la couleur du compagnon
const bg = (hex) => `${hex}22`;

const CompanionAvatarWeb = ({ companion = "arch", size = 80, ring = false, floating = false }) => {
  const accent = colors[companion] || colors.duoGreen;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg(accent),
        border: `3px solid ${accent}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        animation: floating ? "floatSoft 3s ease-in-out infinite" : "none",
        overflow: "hidden",
      }}
    >
      <img
        src={COMPANIONS_PNG[companion]}
        alt={companion}
        style={{
          width: "85%",
          height: "85%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
};

export default CompanionAvatarWeb;
