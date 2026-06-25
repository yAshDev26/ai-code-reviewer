// ── Spacing scale ─────────────────────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  xxxl: 32,
} as const;

// ── Border radius scale ───────────────────────────────────────────────────────
export const radius = {
  sm:   6,
  md:   8,
  lg:   10,
  xl:   12,
  xxl:  14,
  card: 16,
  pill: 9999,
} as const;

// ── Font size scale ───────────────────────────────────────────────────────────
export const fontSize = {
  xxs:  10,
  xs:   11,
  sm:   12,
  md:   13,
  base: 14,
  lg:   15,
  xl:   18,
} as const;

// ── Font weight ───────────────────────────────────────────────────────────────
export const fontWeight = {
  regular: 400,
  medium:  500,
  bold:    600,
  heavy:   700,
} as const;

// ── Z-index scale ─────────────────────────────────────────────────────────────
export const zIndex = {
  base:    0,
  raised:  1,
  overlay: 10,
  modal:   999,
  toast:   9999,
} as const;

// ── Transition ────────────────────────────────────────────────────────────────
export const transition = {
  fast:   'all 0.15s ease',
  normal: 'all 0.2s ease',
  slow:   'all 0.3s ease',
} as const;

// ── Shadows ───────────────────────────────────────────────────────────────────
export const shadow = {
  modal: '0 24px 64px rgba(0,0,0,0.5)',
  card:  '0 1px 8px rgba(0,0,0,0.2)',
} as const;