export const palettes = {
  neutral: { label: 'Neutral', color: '#52525b' },
  blue: { label: 'Blue', color: '#2563eb' },
  violet: { label: 'Violet', color: '#7c3aed' },
  rose: { label: 'Rose', color: '#e11d48' },
  orange: { label: 'Orange', color: '#c2410c' },
} as const
export type Palette = keyof typeof palettes
export function isPalette(value: unknown): value is Palette {
  return typeof value === 'string' && Object.hasOwn(palettes, value)
}
export function savedPalette(): Palette {
  try {
    const value = localStorage.getItem('onco-milver-palette')
    return isPalette(value) ? value : 'neutral'
  } catch { return 'neutral' }
}
