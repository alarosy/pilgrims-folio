/** WCAG 2.x relative luminance and contrast ratio. */

function parse(color: string): [number, number, number] | null {
  const c = color.trim();
  const hex = c.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1]!, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgb = c.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

function luminance([r, g, b]: [number, number, number]) {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(a: string, b: string): number | null {
  const pa = parse(a);
  const pb = parse(b);
  if (!pa || !pb) return null;
  const [hi, lo] = [luminance(pa), luminance(pb)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** AA: 4.5 for body text, 3 for large text and UI parts. */
export function grade(ratio: number | null): "AA" | "AA large" | "Ornament only" | "—" {
  if (ratio == null) return "—";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large";
  return "Ornament only";
}
