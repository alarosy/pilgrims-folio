/**
 * London from Bankside at dusk, c. 1606 — an original drawing in the manner
 * of the early panoramas, not a copy of any of them.
 *
 * Looking north across the Thames: the sun has set in the west (left), a
 * young crescent moon hangs above it, Old St Paul's stands without its spire
 * (lost to lightning in 1561), London Bridge carries its houses on the right,
 * and the first Globe (1599) stands on the south bank with its flag up.
 *
 * Drawn as layers (.sky, .far, .river, .bridge, .near) so Phase 5 can move
 * them at different speeds. Everything is generated from fixed seeds, so the
 * drawing is identical on the server and in the browser.
 */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n: number) => n.toFixed(1);

const FAR_BASE = 416;
const BANK = 478;

/* ---------- North bank: roofs, towers, spires ---------- */
function buildFar() {
  const r = seeded(11);
  let x = -10;
  let d = `M-10 ${FAR_BASE}`;
  const lights: [number, number][] = [];
  while (x < 1210) {
    const w = 12 + r() * 20;
    const h = 9 + r() * 20;
    const k = r();
    if (x > 682 && x < 884) {
      // leave room for St Paul's
      d += ` L${f(x)} ${f(FAR_BASE - 6)} L${f(x + w)} ${f(FAR_BASE - 6)}`;
    } else if (k < 0.58) {
      d += ` L${f(x)} ${f(FAR_BASE - h)} L${f(x + w / 2)} ${f(FAR_BASE - h - 6 - r() * 8)} L${f(x + w)} ${f(FAR_BASE - h)}`;
    } else {
      d += ` L${f(x)} ${f(FAR_BASE - h)} L${f(x + w)} ${f(FAR_BASE - h)}`;
    }
    if (r() < 0.3 && !(x > 682 && x < 884)) lights.push([x + w * (0.25 + r() * 0.5), FAR_BASE - 4 - r() * (h - 6)]);
    x += w;
  }
  d += ` L1210 ${FAR_BASE} L1210 ${FAR_BASE + 4} L-10 ${FAR_BASE + 4}Z`;

  // Parish churches: a tower, most with a slender spire.
  const churches = [40, 128, 214, 298, 372, 452, 536, 612, 905, 980, 1062, 1140].map((cx, i) => {
    const tw = 9 + r() * 5;
    const th = 30 + r() * 26;
    const top = FAR_BASE - th;
    const spire = i % 4 !== 3;
    const sh = 24 + r() * 34;
    let p = `M${f(cx - tw / 2)} ${FAR_BASE}V${f(top)}H${f(cx + tw / 2)}V${FAR_BASE}Z`;
    if (spire) p += `M${f(cx - tw / 2 - 1)} ${f(top)}L${f(cx)} ${f(top - sh)}L${f(cx + tw / 2 + 1)} ${f(top)}Z`;
    else
      p += `M${f(cx - tw / 2)} ${f(top)}v-4h3v2h${f(tw / 2 - 4)}v-2h3v2h${f(tw / 2 - 5)}v-2h3v4Z`;
    return p;
  });

  // Old St Paul's: long nave, transept, and the great square tower — no spire.
  const pauls =
    "M688 416V374L700 364H860L872 374V416Z" + // nave and roof
    "M800 416V356L808 350H836L844 356V416Z" + // transept end
    "M760 372V298H806V372Z" + // tower
    "M758 298V286H764V298ZM802 298V286H808V298ZM779 298V290H787V298Z"; // pinnacles

  return { d, churches, pauls, lights };
}

/* ---------- London Bridge, houses on top ---------- */
function buildBridge() {
  const r = seeded(23);
  let houses = "";
  const lights: [number, number][] = [];
  let x = 936;
  while (x < 1210) {
    const w = 13 + r() * 14;
    const h = 22 + r() * 26;
    const top = 404 - h;
    houses += `M${f(x)} 404V${f(top)}L${f(x + w / 2)} ${f(top - 7 - r() * 6)}L${f(x + w)} ${f(top)}V404Z`;
    if (r() < 0.6) lights.push([x + w * 0.3, top + 8 + r() * (h - 14)]);
    if (r() < 0.4) lights.push([x + w * 0.65, top + 8 + r() * (h - 14)]);
    x += w + (r() < 0.15 ? 6 : 0);
  }
  const arches: string[] = [];
  for (let ax = 944; ax < 1210; ax += 30) arches.push(`M${ax} 438V425A10 10 0 0 1 ${ax + 20} 425V438Z`);
  return { houses, arches, lights };
}

/* ---------- South bank: houses and trees ---------- */
function buildNear() {
  const r = seeded(37);
  let houses = "";
  const lights: [number, number][] = [];
  const row = (from: number, to: number) => {
    let x = from;
    while (x < to) {
      const w = 16 + r() * 18;
      const h = 18 + r() * 26;
      const top = BANK + 4 - h;
      houses += `M${f(x)} ${BANK + 6}V${f(top)}L${f(x + w / 2)} ${f(top - 9 - r() * 7)}L${f(x + w)} ${f(top)}V${BANK + 6}Z`;
      if (r() < 0.55) lights.push([x + w * 0.35, top + 7 + r() * (h - 14)]);
      x += w + r() * 10;
    }
  };
  row(-10, 250);
  row(372, 470);
  row(668, 940);
  const trees: [number, number, number][] = [];
  for (const tx of [262, 350, 655, 760, 860, 950, 1050, 1140]) trees.push([tx, BANK - 2 - r() * 8, 11 + r() * 9]);
  return { houses, trees, lights };
}

/* ---------- The sky ---------- */
function buildStars() {
  const r = seeded(5);
  return Array.from({ length: 52 }, () => [r() * 1200, 8 + r() * r() * 250, 0.5 + r() * 1, 0.25 + r() * 0.65] as const);
}
function buildRipples() {
  const r = seeded(19);
  return Array.from({ length: 70 }, () => {
    const nearSun = r() < 0.35;
    const x = nearSun ? 210 + r() * 110 : r() * 1200;
    return [x, 420 + r() * 52, 8 + r() * 30, nearSun ? 0.45 : 0.12 + r() * 0.18] as const;
  });
}

const FAR = buildFar();
const BRIDGE = buildBridge();
const NEAR = buildNear();
const STARS = buildStars();
const RIPPLES = buildRipples();

/* The Globe: a polygonal drum with a thatched gallery roof, the "heavens" hut and its flag. */
const GX = 560;
const GR = 82;
const facets = Array.from({ length: 9 }, (_, i) => GX + GR * Math.sin(((-90 + i * 22.5) * Math.PI) / 180));

/**
 * Each layer is its own <svg>, stacked, so the parallax can move whole layers
 * with transforms on the compositor instead of repainting one big drawing.
 * Gradients live in a zero-size <svg> and are shared by id.
 */
function Layer({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <svg
      className={`sky-layer ${name}`}
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMax slice"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function Skyline({ className = "" }: { className?: string }) {
  return (
    <div className={`skyline ${className}`} aria-hidden="true">
    <svg width="0" height="0" className="absolute" focusable="false">
      <defs>
        <linearGradient id="sky-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141012" />
          <stop offset=".34" stopColor="#24161c" />
          <stop offset=".56" stopColor="#4e1c20" />
          <stop offset=".68" stopColor="#7d2f24" />
          <stop offset=".78" stopColor="#b5602f" />
          <stop offset=".86" stopColor="#e9b45a" />
        </linearGradient>
        <radialGradient id="sun-glow" cx="250" cy="430" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f6d58a" stopOpacity=".85" />
          <stop offset=".25" stopColor="#e9b45a" stopOpacity=".45" />
          <stop offset="1" stopColor="#e9b45a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8592e" />
          <stop offset=".4" stopColor="#5e2a22" />
          <stop offset="1" stopColor="#21161a" />
        </linearGradient>
        <linearGradient id="globe-wall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5a3428" />
          <stop offset=".45" stopColor="#3a2420" />
          <stop offset="1" stopColor="#1a1214" />
        </linearGradient>
        <linearGradient id="thatch" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6036" />
          <stop offset=".5" stopColor="#5e4026" />
          <stop offset="1" stopColor="#2e2018" />
        </linearGradient>
        <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <path d="M0 0V5" stroke="#000" strokeWidth=".9" strokeOpacity=".35" />
        </pattern>
      </defs>
    </svg>

      {/* SKY */}
      <Layer name="sky">
        <rect width="1200" height="560" fill="url(#sky-dusk)" />
        <rect width="1200" height="480" fill="url(#sun-glow)" />
        {STARS.map(([x, y, rr, o], i) => (
          <circle key={i} cx={f(x)} cy={f(y)} r={f(rr)} fill="#f2e8d5" opacity={o.toFixed(2)} />
        ))}
        {/* young crescent moon, lit side toward the set sun */}
        <path d="M150 98a16 16 0 1 1-22 22a13 13 0 1 0 22-22Z" fill="#f2e8d5" opacity=".92" />
        {/* long evening clouds, lit from below */}
        <g fill="#8e3a2a" opacity=".55">
          <ellipse cx="330" cy="292" rx="190" ry="5" />
          <ellipse cx="520" cy="310" rx="120" ry="4" />
          <ellipse cx="900" cy="276" rx="210" ry="6" />
          <ellipse cx="1080" cy="300" rx="110" ry="3.5" />
        </g>
        <g fill="#e9b45a" opacity=".35">
          <ellipse cx="320" cy="296" rx="150" ry="2" />
          <ellipse cx="890" cy="281" rx="160" ry="2" />
        </g>
      </Layer>

      {/* NORTH BANK */}
      <Layer name="far">
      <g fill="#2a1c22">
        <path d={FAR.d} />
        {FAR.churches.map((p, i) => (
          <path key={i} d={p} />
        ))}
        <path d={FAR.pauls} />
        {/* belfry openings, with the last of the sky behind them */}
        <path d="M770 330h4v14h-4ZM792 330h4v14h-4Z" fill="#7d2f24" />
        <g fill="#e9b45a">
          {FAR.lights.map(([x, y], i) => (
            <rect key={i} x={f(x)} y={f(y)} width="1.8" height="2.6" opacity=".85" />
          ))}
        </g>
      </g>
      </Layer>

      {/* THE THAMES */}
      <Layer name="river">
        <rect x="0" y={FAR_BASE} width="1200" height={BANK - FAR_BASE + 10} fill="url(#river)" />
        {RIPPLES.map(([x, y, w, o], i) => (
          <path key={i} d={`M${f(x)} ${f(y)}h${f(w)}`} stroke="#f2e8d5" strokeWidth="1" opacity={o.toFixed(2)} />
        ))}
        {/* wherries */}
        <g fill="#1a1214">
          <path d="M392 446c10 3 26 3 38 0l-4 5h-30Z" />
          <path d="M408 445v-9" stroke="#1a1214" strokeWidth="1.4" />
          <path d="M700 458c12 3 30 3 44 0l-5 6h-34Z" />
          <path d="M716 456l-8-9M728 456l8-9" stroke="#1a1214" strokeWidth="1.2" />
          <path d="M840 432c8 2 20 2 30 0l-3 4h-24Z" />
          <path d="M852 431V408l10 14h-10" />
        </g>
      </Layer>

      {/* LONDON BRIDGE */}
      <Layer name="bridge">
      <g fill="#211619">
        <path d={BRIDGE.houses} />
        <rect x="930" y="402" width="280" height="36" />
        <g fill="url(#river)">
          {BRIDGE.arches.map((p, i) => (
            <path key={i} d={p} />
          ))}
        </g>
        <g fill="#e9b45a">
          {BRIDGE.lights.map(([x, y], i) => (
            <rect key={i} x={f(x)} y={f(y)} width="2.2" height="3" opacity=".9" />
          ))}
        </g>
      </g>
      </Layer>

      {/* SOUTH BANK (Bankside) */}
      <Layer name="near">
        <path d={`M-10 ${BANK}C200 ${BANK - 6} 380 ${BANK + 4} 600 ${BANK}S1000 ${BANK - 5} 1210 ${BANK + 2}V560H-10Z`} fill="#141012" />
        <path d={NEAR.houses} fill="#1b1316" />
        {NEAR.trees.map(([x, y, rr], i) => (
          <g key={i} fill="#161013">
            <circle cx={f(x)} cy={f(y - rr)} r={f(rr)} />
            <circle cx={f(x - rr * 0.7)} cy={f(y - rr * 0.6)} r={f(rr * 0.7)} />
            <circle cx={f(x + rr * 0.7)} cy={f(y - rr * 0.5)} r={f(rr * 0.65)} />
          </g>
        ))}
        <g fill="#e9b45a">
          {NEAR.lights.map(([x, y], i) => (
            <rect key={i} x={f(x)} y={f(y)} width="2.6" height="3.4" opacity=".9" />
          ))}
        </g>

        {/* a smaller playhouse along the bank */}
        <g>
          <path d="M268 506V466C278 461 342 461 352 466V506C342 511 278 511 268 506Z" fill="url(#globe-wall)" />
          <path d="M264 467C276 455 344 455 356 467C344 462 276 462 264 467Z" fill="url(#thatch)" />
          <path d="M264 467L270 458C284 452 336 452 350 458L356 467C344 461 276 461 264 467Z" fill="url(#thatch)" />
        </g>

        {/* THE GLOBE */}
        <g>
          {/* walls */}
          <path
            d={`M${GX - GR} 512V444C${GX - GR + 20} 437 ${GX + GR - 20} 437 ${GX + GR} 444V512C${GX + GR - 20} 520 ${GX - GR + 20} 520 ${GX - GR} 512Z`}
            fill="url(#globe-wall)"
          />
          <path
            d={`M${GX - GR} 512V444C${GX - GR + 20} 437 ${GX + GR - 20} 437 ${GX + GR} 444V512C${GX + GR - 20} 520 ${GX - GR + 20} 520 ${GX - GR} 512Z`}
            fill="url(#hatch)"
          />
          {/* polygon facets and gallery floors */}
          <g stroke="#0e0a0b" strokeOpacity=".55" strokeWidth="1.1" fill="none">
            {facets.map((x, i) => (
              <path key={i} d={`M${f(x)} ${f(441 + Math.abs(x - GX) / 18)}V${f(516 - Math.abs(x - GX) / 18)}`} />
            ))}
            <path d={`M${GX - GR} 468C${GX - 40} 474 ${GX + 40} 474 ${GX + GR} 468`} />
            <path d={`M${GX - GR} 490C${GX - 40} 496 ${GX + 40} 496 ${GX + GR} 490`} />
          </g>
          {/* lit windows in the galleries */}
          <g fill="#e9b45a">
            <rect x="505" y="476" width="3" height="6" opacity=".8" />
            <rect x="536" y="478" width="3" height="6" opacity=".9" />
            <rect x="572" y="499" width="3" height="6" opacity=".7" />
            <rect x="604" y="476" width="3" height="6" opacity=".6" />
          </g>
          {/* the open yard, glimpsed over the far side of the ring */}
          <ellipse cx={GX} cy="428" rx="60" ry="5" fill="#120d0f" />
          {/* thatched gallery roof */}
          <path
            d={`M${GX - GR - 6} 446C${GX - GR + 4} 430 ${GX + GR - 4} 430 ${GX + GR + 6} 446C${GX + GR - 20} 438 ${GX - GR + 20} 438 ${GX - GR - 6} 446ZM${GX - GR - 6} 446L${GX - GR + 6} 428C${GX - 40} 420 ${GX + 40} 420 ${GX + GR - 6} 428L${GX + GR + 6} 446C${GX + GR - 4} 432 ${GX - GR + 4} 432 ${GX - GR - 6} 446Z`}
            fill="url(#thatch)"
          />
          <g stroke="#2a1c14" strokeOpacity=".5" strokeWidth=".8">
            {Array.from({ length: 34 }, (_, i) => {
              const x = GX - GR + 2 + i * 4.8;
              return <path key={i} d={`M${f(x)} ${f(430 - 0)}l${f((x - GX) / 40)} 12`} />;
            })}
          </g>
          {/* the heavens hut */}
          <path d="M590 430V404L606 392L622 404V430Z" fill="#3a2420" />
          <path d="M590 404L606 392L622 404Z" fill="url(#thatch)" />
          <rect x="603" y="412" width="5" height="8" fill="#e9b45a" opacity=".85" />
          {/* flagpole and flag: a play today */}
          <path d="M606 392V350" stroke="#1a1214" strokeWidth="1.6" />
          <path d="M606 352C596 349 588 356 576 352L577 367C589 371 596 364 606 367Z" fill="#8e1b1b" />
          <path className="globe-flag" d="M606 352C596 349 588 356 576 352L576.4 357C588 361 596 354 606 357Z" fill="#b8352c" opacity=".7" />
        </g>
      </Layer>
    </div>
  );
}
