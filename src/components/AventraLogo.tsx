
import React from 'react';

const AventraLogo: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg
    width={size}
    height={size * 0.35}
    viewBox="0 0 280 98"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    {/* Background circle for icon */}
    <circle cx="49" cy="49" r="35" fill="hsl(185 78% 35%)" opacity="0.1" />
    
    {/* Modern travel icon - compass/location pin hybrid */}
    <g transform="translate(27, 27)">
      <circle cx="22" cy="22" r="16" stroke="hsl(185 78% 35%)" strokeWidth="3" fill="none" />
      <circle cx="22" cy="22" r="6" fill="hsl(25 100% 50%)" />
      <path d="M22 6 L28 18 L22 15 L16 18 Z" fill="hsl(185 78% 35%)" />
      <path d="M38 22 L26 28 L29 22 L26 16 Z" fill="hsl(15 70% 75%)" />
    </g>
    
    {/* Company name: AVENTRA */}
    <text
      x="105"
      y="60"
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize="32"
      fontWeight="700"
      fill="hsl(185 78% 35%)"
      letterSpacing="1.2"
    >
      AVENTRA
    </text>
    
    {/* Tagline */}
    <text
      x="105"
      y="78"
      fontFamily="Montserrat, Arial, sans-serif"
      fontSize="11"
      fontWeight="400"
      fill="hsl(25 100% 50%)"
      letterSpacing="1.8"
    >
      TRAVEL & EXPLORE
    </text>
  </svg>
);

export default AventraLogo;
