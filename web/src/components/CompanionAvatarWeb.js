import React from 'react';
import { colors } from '../theme/tokens';
import './CompanionAvatarWeb.css';

// Mapping des assets SVG générés
const COMPANIONS_SVG = {
  arch: '/asset/compagnons/svg/arch_sans_fond.svg',
  para: '/asset/compagnons/svg/para_sans_fond.svg',
  secu: '/asset/compagnons/svg/secu_sans_fond.svg',
  data: '/asset/compagnons/svg/data_sans_fond.svg',
  bio:  '/asset/compagnons/svg/bio_sans_fond.svg',
  ubu:  '/asset/compagnons/svg/ubu_sans_fond.svg',
  art:  '/asset/compagnons/svg/art_sans_fond.svg',
};

const CompanionAvatarWeb = ({ companion = 'arch', size = 80 }) => {
  const accentColor = colors[companion] || colors.arch;

  return (
    <div className="avatar-wrapper" style={{ width: size, height: size }}>
      <div 
        className="glow-ring" 
        style={{ 
          width: size + 16, 
          height: size + 16, 
          borderColor: accentColor,
          boxShadow: `0 0 15px ${accentColor}`
        }} 
      />
      <img 
        src={COMPANIONS_SVG[companion]} 
        alt={companion} 
        className="avatar-img"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default CompanionAvatarWeb;
