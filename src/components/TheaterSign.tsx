// The site's theatre sign: an arched top, a lit name panel and a letter board hanging below.
// Pure SVG, so it scales with its container. The bulbs alternate in two groups (see globals.css).

type Point = [number, number];

function arcBulbs(cx: number, cy: number, r: number, from: number, to: number, count: number): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = ((from + ((to - from) * i) / (count - 1)) * Math.PI) / 180;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
}

function frameBulbs(x: number, y: number, width: number, height: number, across: number, down: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < across; i++) points.push([x + (width * i) / across, y]);
  for (let i = 0; i < down; i++) points.push([x + width, y + (height * i) / down]);
  for (let i = 0; i < across; i++) points.push([x + width - (width * i) / across, y + height]);
  for (let i = 0; i < down; i++) points.push([x, y + height - (height * i) / down]);
  return points;
}

// coordinates are rounded so the server and the browser print identical markup
const BULBS = [...arcBulbs(300, 196, 116, 190, 350, 19), ...frameBulbs(96, 206, 408, 158, 20, 8)].map(
  ([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as Point
);

const letters = {
  fontFamily: "var(--font-sofia-condensed), 'Arial Narrow', sans-serif",
  fontWeight: 900,
} as const;

export default function TheaterSign({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="72 56 456 486"
      role="img"
      aria-label="Φωτεινή επιγραφή: Ο Συνήθης Θεατής. Τώρα παίζεται: κριτικές και αφιερώματα"
      className={`block w-full h-auto ${className}`}
    >
      {/* arch and name panel */}
      <path d="M168 196 A132 132 0 0 1 432 196 Z" fill="#000" />
      <rect x={80} y={190} width={440} height={190} rx={8} fill="#000" />
      {BULBS.map(([cx, cy], i) => (
        <g key={i} className={i % 2 === 0 ? "sign-bulb" : "sign-bulb sign-bulb-alt"}>
          <circle cx={cx} cy={cy} r={8.8} fill="#FFE08A" opacity={0.28} />
          <circle cx={cx} cy={cy} r={4.2} fill="#FFF6D6" />
        </g>
      ))}
      <text x={300} y={172} textAnchor="middle" fontSize={40} letterSpacing={3} fill="#fff" style={letters}>
        Ο ΣΥΝΗΘΗΣ
      </text>
      <rect x={116} y={226} width={368} height={118} fill="#F2AA48" />
      <rect x={116} y={234} width={368} height={5} fill="#000" />
      <rect x={116} y={331} width={368} height={5} fill="#000" />
      <text x={300} y={322} textAnchor="middle" fontSize={112} letterSpacing={6} fill="#000" style={letters}>
        ΘΕΑΤΗΣ
      </text>

      {/* hangers and letter board */}
      <rect x={128} y={380} width={9} height={22} fill="#000" />
      <rect x={463} y={380} width={9} height={22} fill="#000" />
      <rect x={80} y={400} width={440} height={134} rx={8} fill="#000" />
      <rect x={96} y={416} width={408} height={102} fill="#FFF8EC" />
      <line x1={96} y1={450} x2={504} y2={450} stroke="#d9d0bd" strokeWidth={2} />
      <line x1={96} y1={484} x2={504} y2={484} stroke="#d9d0bd" strokeWidth={2} />
      <text x={300} y={463} textAnchor="middle" fontSize={54} letterSpacing={5} fill="#009DF8" style={letters}>
        ΤΩΡΑ ΠΑΙΖΕΤΑΙ
      </text>
      <text x={300} y={506} textAnchor="middle" fontSize={38} letterSpacing={4} fill="#000" style={letters}>
        ΚΡΙΤΙΚΕΣ &amp; ΑΦΙΕΡΩΜΑΤΑ
      </text>
    </svg>
  );
}
