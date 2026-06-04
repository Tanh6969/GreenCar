import React from "react";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = "medium", showText = true }) => {
  const sizeMap = {
    small: { svg: 32, text: 14 },
    medium: { svg: 40, text: 16 },
    large: { svg: 56, text: 20 },
  };

  const dimensions = sizeMap[size];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg
        width={dimensions.svg}
        height={dimensions.svg}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Gradient background */}
        <defs>
          <linearGradient id="greencarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#4FBD91", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#006C4C", stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Circular background */}
        <circle cx="20" cy="20" r="19" fill="url(#greencarGradient)" opacity="0.1" />
        <circle cx="20" cy="20" r="18.5" stroke="url(#greencarGradient)" strokeWidth="1.5" fill="none" />

        {/* Electric car symbol - stylized EV */}
        <g transform="translate(6, 10)">
          {/* Car body */}
          <path
            d="M 2 14 L 3 8 Q 3 6 5 6 L 23 6 Q 25 6 25 8 L 26 14 Z"
            fill="none"
            stroke="#006C4C"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Car windows */}
          <rect x="5" y="7" width="4" height="3" rx="0.5" fill="none" stroke="#006C4C" strokeWidth="0.8" />
          <rect x="15" y="7" width="5" height="3" rx="0.5" fill="none" stroke="#006C4C" strokeWidth="0.8" />

          {/* Wheels */}
          <circle cx="6" cy="15" r="1.5" fill="#006C4C" />
          <circle cx="22" cy="15" r="1.5" fill="#006C4C" />

          {/* Lightning bolt (EV symbol) */}
          <path
            d="M 14 10 L 12 12 L 14.5 12 L 13 15.5 L 16 12 L 13.5 12 Z"
            fill="#4FBD91"
          />
        </g>
      </svg>

      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span
            style={{
              fontSize: dimensions.text,
              fontWeight: 700,
              color: "#006C4C",
              letterSpacing: "-0.5px",
            }}
          >
            GreenCar
          </span>
          <span
            style={{
              fontSize: dimensions.text * 0.5,
              color: "#4FBD91",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            ELECTRIC
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
