// Every surface texture in one place. All of them are static images (the wall
// photo, or small SVG tiles the browser rasterises once), never live filters, so
// a page of plates costs nothing to scroll on a phone.

const svgUrl = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " "))}")`;

export const WALL_URL = `${process.env.PUBLIC_URL}/images/gymbackground.jpg`;

// Plates are cut from the same scratched iron as the wall, pushed into shadow so
// type stays legible on them. The light falls off toward the bottom like the room's.
export const PLATE_BG = [
  "linear-gradient(180deg, rgba(14,11,11,0.78), rgba(8,6,6,0.9))",
  `url("${WALL_URL}") center / 900px auto`,
  "#100d0d",
].join(", ");

// Black pits and specks: the plate's edges are eaten away (masked to the rim)
export const PITS = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">
  <filter id="p" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="12"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.02  0 0 0 0 0.01  0 0 0 0 0.01  -11 0 0 0 6.1"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#p)"/>
</svg>`);

// Rust blooms, used on the rim of the plate and down the active column
export const RUST = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="r" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="21"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.2  0 0 0 0 0.11  -5 0 0 0 2.75"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#r)"/>
</svg>`);

// Dried blood dragged across a corner: a smear, a few flicks, a thumb print
export const BLOOD_SMEAR = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="220" height="150" viewBox="0 0 220 150">
  <filter id="o" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="8"/>
    <feDisplacementMap in="SourceGraphic" scale="14" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <g filter="url(#o)" fill="#5e080b">
    <path d="M220 6 C180 14 150 10 112 26 C92 34 70 34 52 46 C70 48 96 44 120 40 C150 34 186 34 220 40 Z" opacity="0.8"/>
    <path d="M220 44 C196 50 176 56 150 70 C176 66 200 62 220 64 Z" opacity="0.6"/>
    <ellipse cx="186" cy="96" rx="15" ry="19" opacity="0.5"/>
    <circle cx="96" cy="58" r="4"/>
    <circle cx="78" cy="66" r="2.5"/>
    <circle cx="140" cy="84" r="3"/>
  </g>
  <g fill="none" stroke="#2a0204" stroke-width="1" opacity="0.5">
    <path d="M178 90 q8 -6 16 0 M176 97 q10 -7 20 0 M178 104 q8 -5 16 0"/>
  </g>
</svg>`);

// Row divider: a black weld seam with bright scratches nicked out of it
export const SEAM = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="4">
  <rect width="240" height="2" fill="#000"/>
  <rect y="2" width="240" height="1" fill="rgba(232,224,208,0.05)"/>
  <g stroke="rgba(232,224,208,0.22)" stroke-width="1">
    <path d="M14 1 h9 M61 2 h4 M98 1 h14 M150 2 h6 M181 1 h3 M207 1 h11"/>
  </g>
</svg>`);

// A bar of blood with drips hanging off it; tiles along x so it never stretches
export const BLOOD_RULE = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="20">
  <defs>
    <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b3121d"/>
      <stop offset="1" stop-color="#4a0608"/>
    </linearGradient>
  </defs>
  <g fill="url(#b)">
    <path d="M0 0 H420 V3 C380 4.5 330 2.5 290 4 C240 5.5 190 3 140 4.5 C90 5.5 40 3 0 4 Z"/>
    <path d="M96 3 C97 7 96 10 97.5 13 C99 15 101 13.5 100.5 11 C100 8 100 6 101 3 Z"/>
    <path d="M291 3 C292 9 290.5 13 292 16.5 C293.5 19 296.5 17.5 296 14.5 C295.5 10 295.5 6 297 3 Z"/>
    <path d="M318 3.5 C318.5 5.5 318 7 319 8 C320 8.5 320.6 7 320.4 5.5 C320.2 4.5 320.3 4 320.6 3.5 Z"/>
  </g>
</svg>`);

// Speckle mask for punched numerals: uneven ink and grit in the strike
export const STRIKE_MASK = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
  <filter id="s">
    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="5"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 0 0 0 4.4"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#s)"/>
</svg>`);

// Numerals struck into iron: shadowed upper edge, lit lower lip
export const PUNCHED = "0 -1px 0 rgba(0,0,0,0.95), 0 1px 0 rgba(232,224,208,0.16)";
export const PUNCHED_DEEP =
  "0 -2px 0 rgba(0,0,0,0.95), 0 2px 0 rgba(232,224,208,0.14), 0 6px 14px rgba(0,0,0,0.8)";

// A plate bolted to the wall: heavy soft drop, no cartoon offset
export const heavyShadow = (depth = 1) =>
  `0 ${10 * depth}px ${22 * depth}px -${4 * depth}px rgba(0,0,0,0.9), 0 ${3 * depth}px ${6 * depth}px rgba(0,0,0,0.7)`;

// The recessed well inside a plate (stat strips, meet history)
export const RECESS = {
  background: "rgba(0,0,0,0.5)",
  border: "1px solid #000",
  boxShadow:
    "inset 0 2px 8px rgba(0,0,0,0.9), 0 1px 0 rgba(232,224,208,0.06)",
};
