import React from "react";

// Hand-cut UI icons: one 2px square-capped stroke, mitred corners, currentColor.
// Angular on purpose so they sit with the barbed wire, not with Material's soft set.
const Icon: React.FC<{ children: React.ReactNode; size?: number }> = ({
  children,
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden
    focusable="false"
  >
    {children}
  </svg>
);

// Forged lens with a barb at the rim and a wrapped grip
export const SearchIron: React.FC = () => (
  <Icon>
    <path d="M10 3 L15.5 5 L17 10 L15 15.5 L10 17 L4.5 15 L3 10 L5 4.5 Z" />
    <path d="M14.5 14.5 L21 21" strokeWidth={3} />
    <path d="M16.5 18.5 L18.5 16.5" />
    <path d="M10 3 L11 0.8 M17 10 L19.2 9" strokeWidth={1.5} />
  </Icon>
);

const CONE = "M3 9 H7 L13 4 V20 L7 15 H3 Z";

// Speaker with jagged, distorted waves
export const SoundOn: React.FC = () => (
  <Icon>
    <path d={CONE} />
    <path d="M16 8 L17.5 10.5 L16.5 12 L17.5 13.5 L16 16" />
    <path d="M19 5 L21 9 L19.8 12 L21 15 L19 19" />
  </Icon>
);

// Notched arrowhead; rotate it to show open/closed
export const Chevron: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="M5 8 L12 16 L19 8" />
    <path d="M9.5 8 L12 11 L14.5 8" strokeWidth={1.5} />
  </Icon>
);

// Two hacked strokes
export const Cross: React.FC = () => (
  <Icon size={20}>
    <path d="M5 5.5 L19 18.5 M19 5 L5.5 19" />
  </Icon>
);

// Speaker struck out with a rough cross
export const SoundOff: React.FC = () => (
  <Icon>
    <path d={CONE} />
    <path d="M16 9 L22 15.5 M22 8.5 L16.2 15" />
  </Icon>
);
