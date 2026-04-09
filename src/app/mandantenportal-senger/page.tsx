'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Treemap,
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3,
  PieChart as PieIcon, Calendar, FileText, Building2,
  Layers, Activity, Grid3X3, ArrowUpRight, ArrowDownRight,
  Sparkles, Zap, Eye, ChevronRight,
} from 'lucide-react';
import bookingsRaw from './bookings.json';

type BookingRecord = {
  k: string;
  n: string;
  m: string;
  b: number;
  d: string;
  t: string;
};

const BOOKINGS: BookingRecord[] = bookingsRaw as BookingRecord[];

const MONTH_LABELS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as const;

const monthKeyFromIndex = (idx: number) => String(idx + 1).padStart(2, '0');

const extractPartner = (text: string) => {
  const normalized = text.replace(/^RE\s+/i, '').trim();
  const cut = normalized.split(/ - | v\. |,|\(|\//)[0]?.trim() || normalized;
  return cut || 'Unbekannt';
};

const extractCostCenter = (text: string) => {
  const match = text.match(/Kst\.?\s*\d+/i);
  return match ? match[0].replace(/\s+/g, ' ') : 'Keine Kostenstelle';
};

type DashboardView = 'overview' | 'details' | 'timeline';
type DrilldownState = { kind: 'month'; monthIdx: number } | { kind: 'account'; konto: string; name: string };

const LAYOUT_STORAGE_KEY = 'mandantenportal-senger-layout-v1';
const DEFAULT_LAYOUT: Record<DashboardView, string[]> = {
  overview: ['ov-distribution', 'ov-monthly', 'ov-top3'],
  details: ['dt-categories', 'dt-radar'],
  timeline: ['tl-filters', 'tl-stacked', 'tl-drilldown', 'tl-breakdown', 'tl-monthcards'],
};

const normalizeLayout = (view: DashboardView, input: unknown) => {
  const defaults = DEFAULT_LAYOUT[view];
  if (!Array.isArray(input)) return defaults;
  const valid = input.filter((item): item is string => typeof item === 'string' && defaults.includes(item));
  const missing = defaults.filter((id) => !valid.includes(id));
  return [...valid, ...missing];
};

/* ═══════════════════════════════════════════════════
   DATA — pre-aggregated from SonstigeKosten.csv
   557 Buchungen · 15 Konten · 01/2025 – 12/2025
   Gesamt: 91.686,63 EUR
   ═══════════════════════════════════════════════════ */

const TOTAL = 91686.63;
const BOOKING_COUNT = 557;

const categoryData = [
  { name: 'Lizenzen & Konzessionen', short: 'Lizenzen', konto: '4964', value: 26478.33, pct: 28.9 },
  { name: 'Buchführungskosten', short: 'Buchführung', konto: '4955', value: 17983.43, pct: 19.6 },
  { name: 'Fremdleistungen', short: 'Fremdleist.', konto: '4909', value: 10820.50, pct: 11.8 },
  { name: 'Sonstiger Betriebsbedarf', short: 'Betriebsbed.', konto: '4980', value: 8587.29, pct: 9.4 },
  { name: 'Mieten bewegl. WG', short: 'Mieten', konto: '4960', value: 5073.37, pct: 5.5 },
  { name: 'Telefon', short: 'Telefon', konto: '4920', value: 5057.68, pct: 5.5 },
  { name: 'Rechts- & Beratungskosten', short: 'Beratung', konto: '4950', value: 4228.30, pct: 4.6 },
  { name: 'Porto', short: 'Porto', konto: '4910', value: 4227.59, pct: 4.6 },
  { name: 'Bürobedarf', short: 'Bürobedarf', konto: '4930', value: 3048.96, pct: 3.3 },
  { name: 'Nebenkosten Geldverkehr', short: 'Bankkosten', konto: '4970', value: 2611.08, pct: 2.8 },
  { name: 'Fortbildungskosten', short: 'Fortbildung', konto: '4945', value: 2041.76, pct: 2.2 },
  { name: 'Fachliteratur', short: 'Fachliteratur', konto: '4940', value: 1114.34, pct: 1.2 },
  { name: 'Abfallbeseitigung', short: 'Abfall', konto: '4969', value: 364.00, pct: 0.4 },
  { name: 'Sonst. betriebl. Aufw.', short: 'Sonstiges', konto: '4900', value: 50.00, pct: 0.1 },
];

const monthlyData = [
  { month: 'Jan', total: 4116.77, idx: 0 },
  { month: 'Feb', total: 14603.18, idx: 1 },
  { month: 'Mär', total: 16459.10, idx: 2 },
  { month: 'Apr', total: 6763.77, idx: 3 },
  { month: 'Mai', total: 4955.82, idx: 4 },
  { month: 'Jun', total: 5308.29, idx: 5 },
  { month: 'Jul', total: 10264.31, idx: 6 },
  { month: 'Aug', total: 3776.23, idx: 7 },
  { month: 'Sep', total: 6447.70, idx: 8 },
  { month: 'Okt', total: 7895.26, idx: 9 },
  { month: 'Nov', total: 3223.90, idx: 10 },
  { month: 'Dez', total: 7872.30, idx: 11 },
];

const monthlyAvg = TOTAL / 12;
const maxMonth = monthlyData.reduce((a, b) => a.total > b.total ? a : b);
const minMonth = monthlyData.reduce((a, b) => a.total < b.total ? a : b);

const monthlyStacked = [
  { m: 'Jan', Lizenzen: 532, Buchführung: 0, Fremdleist: 0, Betriebsbed: 1476, Mieten: 1282, Telefon: 84, Beratung: 519, Porto: 115, Bürobedarf: 74, Übrige: 35 },
  { m: 'Feb', Lizenzen: 795, Buchführung: 985, Fremdleist: 9477, Betriebsbed: 1797, Mieten: 0, Telefon: 530, Beratung: 0, Porto: 383, Bürobedarf: 173, Übrige: 465 },
  { m: 'Mär', Lizenzen: 5944, Buchführung: 3061, Fremdleist: 0, Betriebsbed: 1609, Mieten: 850, Telefon: 812, Beratung: 2640, Porto: 551, Bürobedarf: 599, Übrige: 393 },
  { m: 'Apr', Lizenzen: 1219, Buchführung: 2642, Fremdleist: 0, Betriebsbed: 81, Mieten: 0, Telefon: 378, Beratung: 0, Porto: 297, Bürobedarf: 75, Übrige: 2072 },
  { m: 'Mai', Lizenzen: 1541, Buchführung: 1155, Fremdleist: 0, Betriebsbed: 1277, Mieten: 0, Telefon: 351, Beratung: 0, Porto: 351, Bürobedarf: 215, Übrige: 66 },
  { m: 'Jun', Lizenzen: 1003, Buchführung: 1155, Fremdleist: 0, Betriebsbed: 60, Mieten: 1027, Telefon: 773, Beratung: 420, Porto: 241, Bürobedarf: 193, Übrige: 435 },
  { m: 'Jul', Lizenzen: 6328, Buchführung: 1421, Fremdleist: 0, Betriebsbed: 132, Mieten: 65, Telefon: 347, Beratung: 520, Porto: 546, Bürobedarf: 372, Übrige: 534 },
  { m: 'Aug', Lizenzen: 1017, Buchführung: 1289, Fremdleist: 0, Betriebsbed: 125, Mieten: 0, Telefon: 352, Beratung: 0, Porto: 334, Bürobedarf: 295, Übrige: 364 },
  { m: 'Sep', Lizenzen: 1267, Buchführung: 2179, Fremdleist: 0, Betriebsbed: 480, Mieten: 939, Telefon: 366, Beratung: 130, Porto: 422, Bürobedarf: 232, Übrige: 433 },
  { m: 'Okt', Lizenzen: 4629, Buchführung: 1345, Fremdleist: 0, Betriebsbed: 519, Mieten: 61, Telefon: 349, Beratung: 0, Porto: 277, Bürobedarf: 155, Übrige: 560 },
  { m: 'Nov', Lizenzen: 1077, Buchführung: 174, Fremdleist: 0, Betriebsbed: 700, Mieten: 0, Telefon: 351, Beratung: 0, Porto: 435, Bürobedarf: 336, Übrige: 152 },
  { m: 'Dez', Lizenzen: 1127, Buchführung: 2576, Fremdleist: 1344, Betriebsbed: 331, Mieten: 850, Telefon: 365, Beratung: 0, Porto: 277, Bürobedarf: 331, Übrige: 672 },
];

const radarData = categoryData.slice(0, 8).map(c => ({
  category: c.short,
  value: Math.round((c.value / categoryData[0].value) * 100),
}));

const treemapData = [
  ...categoryData.slice(0, 5).map((c, i) => ({ name: c.short, size: c.value, pct: c.pct, idx: i })),
  { name: 'Übrige', size: categoryData.slice(5).reduce((s, c) => s + c.value, 0), pct: 24.8, idx: 5 },
];

/* ═══════════════ COLORS ═══════════════ */

const GOLD = '#c8a97e';
const COLORS = ['#c8a97e','#8b7355','#a0845c','#6b5b45','#d4b896','#9e8c73','#b8956a','#7a6950','#e0c9a6','#5c4f3d','#c2a07a','#8a7a62','#d9c4a0','#6e5f4a'];
const STACK_COLORS = ['#c8a97e','#8b7355','#a0845c','#6b5b45','#d4b896','#9e8c73','#b8956a','#7a6950','#e0c9a6','#5c4f3d'];

/* ═══════════════ UTILITIES ═══════════════ */

const fmt = (v: number, d = 2) => v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtK = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0);

/* ═══════════════ ANIMATED NUMBER ═══════════════ */

function AnimNum({ value, suffix = '', decimals = 2, duration = 2200, className = '' }: {
  value: number; suffix?: string; decimals?: number; duration?: number; className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay((1 - Math.pow(1 - p, 5)) * value);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value, duration]);
  return <span ref={ref} className={className}>{fmt(display, decimals)}{suffix}</span>;
}

/* ═══════════════ MAGNETIC HOVER CARD ═══════════════ */

function MagneticCard({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════ PARTICLE FIELD ═══════════════ */

function ParticleField() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.15 + 0.03,
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0 }}
          animate={{
            x: [`${p.x}vw`, `${(p.x + 20) % 100}vw`, `${(p.x + 10) % 100}vw`],
            y: [`${p.y}vh`, `${(p.y + 30) % 100}vh`, `${(p.y + 15) % 100}vh`],
            opacity: [0, p.opacity, 0],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: GOLD,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════ GLOWING ORB ═══════════════ */

function GlowOrb({ color = GOLD, size = 400, x = '50%', y = '0%', opacity = 0.04 }: {
  color?: string; size?: number; x?: string; y?: string; opacity?: number;
}) {
  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [opacity, opacity * 1.5, opacity] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', left: x, top: y, width: size, height: size,
        borderRadius: '50%', background: `radial-gradient(circle, ${color}, transparent 70%)`,
        transform: 'translate(-50%, -50%)', pointerEvents: 'none', filter: 'blur(40px)',
      }}
    />
  );
}

/* ═══════════════ TOOLTIPS ═══════════════ */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      style={{
        background: 'rgba(15, 13, 11, 0.95)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(200,169,126,0.15)', borderRadius: '14px',
        padding: '14px 18px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}
    >
      <p style={{ color: GOLD, fontSize: '11px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: '#e0d5c4', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: '#7a6950', minWidth: 80 }}>{p.name}</span>
          <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(Number(p.value))} €</span>
        </p>
      ))}
    </motion.div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'rgba(15,13,11,0.95)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(200,169,126,0.15)', borderRadius: '14px',
        padding: '14px 18px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}
    >
      <p style={{ color: GOLD, fontSize: '13px', fontWeight: 600 }}>{d.name}</p>
      <p style={{ color: '#e0d5c4', fontSize: '16px', fontWeight: 700, marginTop: 4 }}>{fmt(d.value)} €</p>
      <p style={{ color: '#7a6950', fontSize: '12px' }}>{((d.value / TOTAL) * 100).toFixed(1)}% der Gesamtkosten</p>
    </motion.div>
  );
}

/* ═══════════════ TREEMAP CONTENT ═══════════════ */

function TreemapContent(props: any) {
  const { x, y, width, height, name, pct, idx } = props;
  if (width < 30 || height < 25) return null;
  const isDark = [1, 3, 5, 7, 9].includes(idx);
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={10} fill={COLORS[idx]}
        stroke="rgba(15,13,11,0.7)" strokeWidth={2} />
      {width > 55 && height > 45 && (
        <>
          <text x={x + 14} y={y + 24} fill={isDark ? '#e0d5c4' : '#1a1714'} fontSize={11} fontWeight={600} fontFamily="Inter, sans-serif">{name}</text>
          <text x={x + 14} y={y + 46} fill={isDark ? 'rgba(224,213,196,0.7)' : 'rgba(26,23,20,0.6)'} fontSize={22} fontWeight={800} fontFamily="Inter, sans-serif">{pct}%</text>
        </>
      )}
    </g>
  );
}

/* ═══════════════ SPARKLINE ═══════════════ */

function Sparkline({ data, color = GOLD, width: w = 80, height: h = 28 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" points={points} />
      <polyline fill={`url(#spark-${color.replace('#', '')})`} stroke="none"
        points={`0,${h} ${points} ${w},${h}`} />
    </svg>
  );
}

/* ═══════════════ PROGRESS RING ═══════════════ */

function ProgressRing({ value, max, size = 56, strokeWidth = 3, color = GOLD }: {
  value: number; max: number; size?: number; strokeWidth?: number; color?: string;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const isInView = useInView(ref as any, { once: true });
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = value / max;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(200,169,126,0.08)" strokeWidth={strokeWidth} />
      <motion.circle
        ref={ref}
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        initial={{ strokeDasharray: circ, strokeDashoffset: circ }}
        animate={isInView ? { strokeDashoffset: circ * (1 - pct) } : {}}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
    </svg>
  );
}

/* ═══════════════ SECTION ═══════════════ */

const cardStyle: React.CSSProperties = {
  background: 'rgba(200,169,126,0.025)',
  border: '1px solid rgba(200,169,126,0.07)',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
};

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >{children}</motion.div>
  );
}

function DragHandle({ onDragStart, onDragEnd }: { onDragStart: () => void; onDragEnd: () => void }) {
  void onDragStart;
  void onDragEnd;
  return null;
}

/* ═══════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════ */

export default function MandantenportalSenger() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [view, setView] = useState<'overview' | 'details' | 'timeline'>('overview');
  const [mounted, setMounted] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState('Alle Partner');
  const [drilldown, setDrilldown] = useState<DrilldownState | null>(null);
  const [layout, setLayout] = useState<Record<DashboardView, string[]>>(DEFAULT_LAYOUT);
  const [draggingSection, setDraggingSection] = useState<{ view: DashboardView; id: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute('data-theme', 'dark');
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<Record<DashboardView, string[]>>;
      setLayout({
        overview: normalizeLayout('overview', parsed.overview),
        details: normalizeLayout('details', parsed.details),
        timeline: normalizeLayout('timeline', parsed.timeline),
      });
    } catch {
      setLayout(DEFAULT_LAYOUT);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  }, [layout, mounted]);

  const monthSparkData = monthlyData.map(m => m.total);
  const selectedMonthKey = monthKeyFromIndex(selectedMonthIdx);

  const monthBookings = useMemo(
    () => BOOKINGS.filter((entry) => entry.m === selectedMonthKey),
    [selectedMonthKey]
  );

  const monthAccountTotals = useMemo(() => {
    const byAccount = new Map<string, { konto: string; name: string; total: number; count: number }>();
    monthBookings.forEach((entry) => {
      const prev = byAccount.get(entry.k);
      byAccount.set(entry.k, {
        konto: entry.k,
        name: entry.n,
        total: (prev?.total || 0) + entry.b,
        count: (prev?.count || 0) + 1,
      });
    });
    return Array.from(byAccount.values()).sort((a, b) => b.total - a.total);
  }, [monthBookings]);

  useEffect(() => {
    if (!monthAccountTotals.length) {
      setSelectedAccount(null);
      return;
    }
    if (!selectedAccount || !monthAccountTotals.some((account) => account.konto === selectedAccount)) {
      setSelectedAccount(monthAccountTotals[0].konto);
    }
  }, [monthAccountTotals, selectedAccount]);

  const selectedAccountBookings = useMemo(() => {
    if (!selectedAccount) return [];
    return monthBookings
      .filter((entry) => entry.k === selectedAccount)
      .map((entry) => ({
        ...entry,
        partner: extractPartner(entry.t),
        costCenter: extractCostCenter(entry.t),
      }))
      .sort((a, b) => Math.abs(b.b) - Math.abs(a.b));
  }, [monthBookings, selectedAccount]);

  const partnerOptions = useMemo(() => {
    const totals = new Map<string, number>();
    selectedAccountBookings.forEach((entry) => {
      totals.set(entry.partner, (totals.get(entry.partner) || 0) + entry.b);
    });
    return ['Alle Partner', ...Array.from(totals.entries()).sort((a, b) => b[1] - a[1]).map(([partner]) => partner)];
  }, [selectedAccountBookings]);

  useEffect(() => {
    if (!partnerOptions.includes(selectedPartner)) setSelectedPartner('Alle Partner');
  }, [partnerOptions, selectedPartner]);

  const partnerFilteredBookings = useMemo(
    () => selectedPartner === 'Alle Partner'
      ? selectedAccountBookings
      : selectedAccountBookings.filter((entry) => entry.partner === selectedPartner),
    [selectedAccountBookings, selectedPartner]
  );

  const partnerTotals = useMemo(() => {
    const totals = new Map<string, number>();
    selectedAccountBookings.forEach((entry) => {
      totals.set(entry.partner, (totals.get(entry.partner) || 0) + entry.b);
    });
    return Array.from(totals.entries())
      .map(([partner, total]) => ({ partner, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [selectedAccountBookings]);

  const costCenterTotals = useMemo(() => {
    const totals = new Map<string, number>();
    partnerFilteredBookings.forEach((entry) => {
      totals.set(entry.costCenter, (totals.get(entry.costCenter) || 0) + entry.b);
    });
    return Array.from(totals.entries())
      .map(([costCenter, total]) => ({ costCenter, total }))
      .sort((a, b) => b.total - a.total);
  }, [partnerFilteredBookings]);

  const selectedMonthTotal = useMemo(
    () => monthBookings.reduce((sum, entry) => sum + entry.b, 0),
    [monthBookings]
  );

  const monthRange = useMemo(() => {
    const start = Math.max(0, selectedMonthIdx - 1);
    const end = Math.min(MONTH_LABELS.length - 1, selectedMonthIdx + 1);
    return { start, end };
  }, [selectedMonthIdx]);

  const focusedStackedData = useMemo(
    () => monthlyStacked.filter((_, idx) => idx >= monthRange.start && idx <= monthRange.end),
    [monthRange]
  );

  const selectedAccountSeries = useMemo(() => {
    if (!selectedAccount) return [];
    return MONTH_LABELS.map((month, idx) => ({
      m: month,
      idx,
      total: BOOKINGS
        .filter((entry) => entry.k === selectedAccount && entry.m === monthKeyFromIndex(idx))
        .reduce((sum, entry) => sum + entry.b, 0),
    })).filter((row) => row.idx >= monthRange.start && row.idx <= monthRange.end);
  }, [selectedAccount, monthRange]);

  const drilldownBookings = useMemo(() => {
    if (!drilldown) return [];
    if (drilldown.kind === 'month') {
      const monthKey = monthKeyFromIndex(drilldown.monthIdx);
      return BOOKINGS.filter((entry) => entry.m === monthKey);
    }
    return BOOKINGS.filter((entry) => entry.k === drilldown.konto);
  }, [drilldown]);

  const drilldownTotal = useMemo(
    () => drilldownBookings.reduce((sum, entry) => sum + entry.b, 0),
    [drilldownBookings]
  );

  const drilldownSummary = useMemo(() => {
    if (!drilldown) return [];
    const totals = new Map<string, number>();
    if (drilldown.kind === 'month') {
      drilldownBookings.forEach((entry) => {
        totals.set(entry.k, (totals.get(entry.k) || 0) + entry.b);
      });
      return Array.from(totals.entries())
        .map(([label, total]) => ({ label, total }))
        .sort((a, b) => b.total - a.total);
    }
    drilldownBookings.forEach((entry) => {
      const monthLabel = MONTH_LABELS[Number(entry.m) - 1] || entry.m;
      totals.set(monthLabel, (totals.get(monthLabel) || 0) + entry.b);
    });
    return Array.from(totals.entries())
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total);
  }, [drilldown, drilldownBookings]);

  const openMonthDrilldown = useCallback((monthIdx: number) => {
    setDrilldown({ kind: 'month', monthIdx });
    setView('overview');
  }, []);

  const openAccountDrilldown = useCallback((konto: string, name: string) => {
    setDrilldown({ kind: 'account', konto, name });
    setView('overview');
  }, []);

  const moveSection = useCallback((sectionView: DashboardView, targetId: string) => {
    setLayout((prev) => {
      if (!draggingSection || draggingSection.view !== sectionView) return prev;
      const current = prev[sectionView];
      const from = current.indexOf(draggingSection.id);
      const to = current.indexOf(targetId);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...prev, [sectionView]: next };
    });
  }, [draggingSection]);

  const sectionShellStyle: React.CSSProperties = {
    position: 'relative',
  };

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh', background: '#0c0a09', color: '#e0d5c4',
      fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden', position: 'relative',
    }}>
      <ParticleField />
      <GlowOrb x="20%" y="10%" size={600} opacity={0.03} />
      <GlowOrb x="80%" y="60%" size={500} opacity={0.02} color="#8b7355" />
      <GlowOrb x="50%" y="90%" size={400} opacity={0.02} color="#a0845c" />

      {/* ══ FLOATING NAVBAR ══ */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: 'fixed', top: '12px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px',
          padding: '8px 8px 8px 20px',
          background: 'rgba(15, 13, 11, 0.6)',
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
          borderRadius: '100px',
          border: '1px solid rgba(200,169,126,0.1)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(200,169,126,0.05) inset',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '8px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '8px',
            background: 'linear-gradient(135deg, #c8a97e 0%, #8b7355 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '10px', color: '#0c0a09', letterSpacing: '0.02em',
          }}>S&S</div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#e0d5c4', whiteSpace: 'nowrap' }}>Mandantenportal</span>
        </div>
        <div style={{ width: '1px', height: '20px', background: 'rgba(200,169,126,0.12)' }} />
        <div style={{ display: 'flex', gap: '2px', padding: '2px', borderRadius: '100px' }}>
          {(['overview', 'details', 'timeline'] as const).map((v) => (
            <motion.button
              key={v}
              onClick={() => {
                setView(v);
                if (v !== 'overview') setDrilldown(null);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '8px 18px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: 500, fontFamily: 'inherit',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                background: view === v ? 'rgba(200,169,126,0.15)' : 'transparent',
                color: view === v ? '#e0d5c4' : '#7a6950',
                boxShadow: view === v ? '0 2px 8px rgba(200,169,126,0.08)' : 'none',
              }}
            >
              {v === 'overview' ? 'Übersicht' : v === 'details' ? 'Kategorien' : 'Zeitverlauf'}
            </motion.button>
          ))}
        </div>
      </motion.nav>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px 120px', position: 'relative', zIndex: 1 }}>

        {/* ══ HERO ══ */}
        <Reveal>
          <div style={{ marginBottom: '48px', position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '100px',
                background: 'rgba(200,169,126,0.06)', border: '1px solid rgba(200,169,126,0.1)',
                fontSize: '11px', color: GOLD, fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px',
              }}
            >
              <Sparkles size={11} />
              Kostenanalyse · Geschäftsjahr 2025
            </motion.div>
            <h1 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 200, lineHeight: 1.1, color: '#e0d5c4', letterSpacing: '-0.04em', margin: 0 }}>
              Sonstige Kosten
              <br />
              <motion.span
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ fontWeight: 700, background: `linear-gradient(135deg, ${GOLD}, #e0c9a6, ${GOLD})`, backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Jahresübersicht
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{ fontSize: '14px', color: '#7a6950', marginTop: '14px', maxWidth: '500px', lineHeight: 1.7 }}
            >
              Aufschlüsselung aller nicht-kanzleibezogenen Betriebskosten —
              {' '}<span style={{ color: '#9e8c73' }}>{BOOKING_COUNT} Buchungen</span> über{' '}
              <span style={{ color: '#9e8c73' }}>14 Konten</span> im Zeitraum Januar bis Dezember 2025.
            </motion.p>
          </div>
        </Reveal>

        {/* ══ KPI CARDS ══ */}
        <Reveal delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '14px' }}>
            {[
              { label: 'Gesamtkosten', value: TOTAL, icon: DollarSign, color: GOLD, decimals: 2 },
              { label: 'Monatsdurchschnitt', value: monthlyAvg, icon: Activity, color: '#a0845c', decimals: 2 },
              { label: 'Höchster Monat', value: maxMonth.total, icon: TrendingUp, sub: maxMonth.month, color: '#d4b896', decimals: 2 },
              { label: 'Niedrigster Monat', value: minMonth.total, icon: TrendingDown, sub: minMonth.month, color: '#8b7355', decimals: 2 },
            ].map((kpi, i) => (
              <MagneticCard key={kpi.label} style={{ ...cardStyle, padding: '22px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.06 }}
                >
                  <GlowOrb color={kpi.color} size={120} x="85%" y="20%" opacity={0.06} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '10px',
                      background: `${kpi.color}10`, border: `1px solid ${kpi.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <kpi.icon size={14} color={kpi.color} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: '10px', color: '#6b5b45', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{kpi.label}</span>
                  </div>
                  <div style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 700, color: '#e0d5c4', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                    <AnimNum value={kpi.value} suffix=" €" decimals={kpi.decimals} duration={2000 + i * 200} />
                  </div>
                  {'sub' in kpi && kpi.sub && <div style={{ fontSize: '12px', color: '#7a6950', marginTop: '4px' }}>{kpi.sub}</div>}
                  <div style={{ marginTop: '12px' }}>
                    <Sparkline data={monthSparkData} color={kpi.color} width={100} height={24} />
                  </div>
                </motion.div>
              </MagneticCard>
            ))}
          </div>
        </Reveal>
        <AnimatePresence mode="wait">

          {/* ══════════ OVERVIEW ══════════ */}
          {view === 'overview' && (
            <motion.div key="ov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} style={{ display: 'flex', flexDirection: 'column' }}>
              {drilldown && (
                <Reveal>
                  <div style={{ ...cardStyle, padding: '28px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: GOLD, fontWeight: 600, marginBottom: '6px' }}>
                          {drilldown.kind === 'month'
                            ? `Detailansicht Monat ${MONTH_LABELS[drilldown.monthIdx]} 2025`
                            : `Detailansicht Konto ${drilldown.konto} · ${drilldown.name}`}
                        </div>
                        <div style={{ fontSize: '24px', color: '#e0d5c4', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                          {fmt(drilldownTotal, 2)} €
                        </div>
                      </div>
                      <button
                        onClick={() => setDrilldown(null)}
                        style={{
                          border: '1px solid rgba(200,169,126,0.12)',
                          background: 'rgba(200,169,126,0.05)',
                          color: '#e0d5c4',
                          borderRadius: '100px',
                          padding: '8px 14px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        Zur Übersicht
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div style={{ ...cardStyle, padding: '16px', borderRadius: '16px' }}>
                        <div style={{ fontSize: '11px', color: GOLD, marginBottom: '10px', fontWeight: 600 }}>
                          {drilldown.kind === 'month' ? 'Konten im Monat' : 'Monatsverteilung'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                          {drilldownSummary.slice(0, 12).map((row) => (
                            <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                              <span style={{ color: '#7a6950' }}>{row.label}</span>
                              <span style={{ color: '#e0d5c4', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt(row.total, 2)} €</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ ...cardStyle, padding: '16px', borderRadius: '16px' }}>
                        <div style={{ fontSize: '11px', color: GOLD, marginBottom: '10px', fontWeight: 600 }}>
                          Zugrunde liegende Buchungen
                        </div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {drilldownBookings.slice(0, 80).map((entry, idx) => (
                            <div key={`${entry.k}-${entry.d}-${idx}`} style={{ ...cardStyle, borderRadius: '10px', padding: '8px 10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '11px' }}>
                                <span style={{ color: '#7a6950' }}>{entry.d}</span>
                                <span style={{ color: '#e0d5c4', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt(entry.b, 2)} €</span>
                              </div>
                              <div style={{ fontSize: '10px', color: '#9e8c73', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {entry.k} · {entry.n}
                              </div>
                              <div style={{ fontSize: '10px', color: '#5c4f3d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {entry.t}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}
              {!drilldown && (
              <>

              {/* Donut + Treemap */}
              <div
                style={{ ...sectionShellStyle, order: layout.overview.indexOf('ov-distribution') }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveSection('overview', 'ov-distribution')}
              >
                <DragHandle onDragStart={() => setDraggingSection({ view: 'overview', id: 'ov-distribution' })} onDragEnd={() => setDraggingSection(null)} />
                <Reveal delay={0.1}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ ...cardStyle, padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <PieIcon size={14} color={GOLD} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Quotale Verteilung</span>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={130}
                          paddingAngle={2} dataKey="value" stroke="none"
                          onMouseEnter={(_, i) => setActiveCategory(i)}
                          onMouseLeave={() => setActiveCategory(null)}
                          onClick={(entry: unknown) => {
                            const row = entry as { konto: string; name: string };
                            openAccountDrilldown(row.konto, row.name);
                          }}>
                          {categoryData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i]}
                              opacity={activeCategory === null || activeCategory === i ? 1 : 0.25}
                              style={{ transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', cursor: 'pointer',
                                filter: activeCategory === i ? `drop-shadow(0 0 8px ${COLORS[i]}60)` : 'none' }} />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                        <text x="50%" y="44%" textAnchor="middle" fill="#e0d5c4" fontSize="24" fontWeight="700" fontFamily="Inter">{fmt(TOTAL, 0)}</text>
                        <text x="50%" y="55%" textAnchor="middle" fill="#5c4f3d" fontSize="10" fontFamily="Inter" letterSpacing="0.1em">EUR GESAMT</text>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                      {categoryData.slice(0, 6).map((c, i) => (
                        <motion.div key={c.konto}
                          whileHover={{ scale: 1.05 }}
                          onMouseEnter={() => setActiveCategory(i)}
                          onMouseLeave={() => setActiveCategory(null)}
                          onClick={() => openAccountDrilldown(c.konto, c.name)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px',
                            borderRadius: '6px', cursor: 'pointer', fontSize: '10px', color: '#7a6950',
                            background: activeCategory === i ? 'rgba(200,169,126,0.08)' : 'transparent',
                            transition: 'background 0.2s',
                          }}>
                          <span style={{ width: 6, height: 6, borderRadius: '2px', background: COLORS[i] }} />
                          {c.short}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div style={{ ...cardStyle, padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <Grid3X3 size={14} color={GOLD} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Kostenblöcke</span>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                      <Treemap data={treemapData} dataKey="size" aspectRatio={4 / 3} content={<TreemapContent />} isAnimationActive={false} />
                    </ResponsiveContainer>
                  </div>
                  </div>
                </Reveal>
              </div>

              {/* Bar Chart */}
              <div
                style={{ ...sectionShellStyle, order: layout.overview.indexOf('ov-monthly') }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveSection('overview', 'ov-monthly')}
              >
                <DragHandle onDragStart={() => setDraggingSection({ view: 'overview', id: 'ov-monthly' })} onDragEnd={() => setDraggingSection(null)} />
                <Reveal delay={0.15}>
                  <div style={{ ...cardStyle, padding: '28px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BarChart3 size={14} color={GOLD} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Monatliche Gesamtkosten</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#5c4f3d', padding: '5px 12px', background: 'rgba(200,169,126,0.05)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Activity size={10} /> Ø {fmt(monthlyAvg, 0)} € / Monat
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={monthlyData} barCategoryGap="18%" margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,169,126,0.04)" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#5c4f3d', fontSize: 11, fontFamily: 'Inter' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3d352b', fontSize: 10, fontFamily: 'Inter' }} tickFormatter={(v) => `${fmtK(v)}`} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(200,169,126,0.03)', radius: 8 }} />
                      <Bar dataKey="total" name="Gesamt" radius={[8, 8, 0, 0]} isAnimationActive={false} onClick={(_, idx: number) => openMonthDrilldown(idx)}>
                        {monthlyData.map((entry, i) => (
                          <Cell key={i} fill={entry.total > monthlyAvg ? GOLD : '#4a3f32'} style={{ cursor: 'pointer' }} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                </Reveal>
              </div>

              {/* Top 3 Highlight */}
              <div
                style={{ ...sectionShellStyle, order: layout.overview.indexOf('ov-top3') }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveSection('overview', 'ov-top3')}
              >
                <DragHandle onDragStart={() => setDraggingSection({ view: 'overview', id: 'ov-top3' })} onDragEnd={() => setDraggingSection(null)} />
                <Reveal delay={0.2}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  {categoryData.slice(0, 3).map((cat, i) => (
                    <MagneticCard key={cat.konto} style={{ ...cardStyle, padding: '24px' }}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.08 }}
                        onClick={() => openAccountDrilldown(cat.konto, cat.name)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Top {i + 1}
                          </span>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ProgressRing value={cat.pct} max={100} color={COLORS[i]} />
                            <span style={{ position: 'absolute', fontSize: '10px', fontWeight: 700, color: '#e0d5c4' }}>{cat.pct}%</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#e0d5c4', marginBottom: '4px' }}>{cat.name}</div>
                        <div style={{ fontSize: '11px', color: '#5c4f3d', marginBottom: '14px' }}>Konto {cat.konto}</div>
                        <div style={{ fontSize: '22px', fontWeight: 700, color: '#e0d5c4', fontVariantNumeric: 'tabular-nums' }}>
                          <AnimNum value={cat.value} suffix=" €" />
                        </div>
                      </motion.div>
                    </MagneticCard>
                  ))}
                  </div>
                </Reveal>
              </div>
              </>
              )}
            </motion.div>
          )}

          {/* ══════════ DETAILS ══════════ */}
          {view === 'details' && (
            <motion.div key="dt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{ ...sectionShellStyle, order: layout.details.indexOf('dt-categories') }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveSection('details', 'dt-categories')}
              >
                <DragHandle onDragStart={() => setDraggingSection({ view: 'details', id: 'dt-categories' })} onDragEnd={() => setDraggingSection(null)} />
                <Reveal>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <Layers size={14} color={GOLD} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Alle Kostenkategorien</span>
                    <span style={{ fontSize: '10px', color: '#4a3f32', background: 'rgba(200,169,126,0.06)', padding: '3px 10px', borderRadius: '100px' }}>{categoryData.length} Konten</span>
                  </div>
                </Reveal>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {categoryData.map((cat, i) => (
                    <motion.div
                      key={cat.konto}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ x: 6, background: 'rgba(200,169,126,0.04)', transition: { duration: 0.2 } }}
                      style={{
                        ...cardStyle, borderRadius: '16px', padding: '16px 22px',
                        display: 'grid', gridTemplateColumns: '28px 1fr auto 70px 150px',
                        alignItems: 'center', gap: '16px', cursor: 'default',
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 800, color: i < 3 ? GOLD : '#3d352b', fontFamily: "'Inter', monospace' " }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#e0d5c4' }}>{cat.name}</div>
                        <div style={{ fontSize: '10px', color: '#4a3f32', marginTop: '1px' }}>Konto {cat.konto}</div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#e0d5c4', textAlign: 'right', fontVariantNumeric: 'tabular-nums', minWidth: 110 }}>
                        <AnimNum value={cat.value} suffix=" €" duration={1000 + i * 80} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 600, color: GOLD,
                          padding: '3px 10px', background: 'rgba(200,169,126,0.06)',
                          borderRadius: '100px', display: 'inline-block',
                        }}>{cat.pct}%</span>
                      </div>
                      <div style={{ position: 'relative', height: '4px', borderRadius: '2px', background: 'rgba(200,169,126,0.04)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(cat.pct / categoryData[0].pct) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                          style={{ height: '100%', borderRadius: '2px', background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}88)` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Radar */}
              <div
                style={{ ...sectionShellStyle, order: layout.details.indexOf('dt-radar') }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveSection('details', 'dt-radar')}
              >
                <DragHandle onDragStart={() => setDraggingSection({ view: 'details', id: 'dt-radar' })} onDragEnd={() => setDraggingSection(null)} />
                <Reveal delay={0.15}>
                  <div style={{ ...cardStyle, padding: '28px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Eye size={14} color={GOLD} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Kostenprofil — Top 8 Kategorien</span>
                  </div>
                  <ResponsiveContainer width="100%" height={340}>
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="68%">
                      <PolarGrid stroke="rgba(200,169,126,0.08)" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#6b5b45', fontSize: 10, fontFamily: 'Inter' }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Radar name="Anteil" dataKey="value" stroke={GOLD} fill={GOLD} fillOpacity={0.1} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                  </div>
                </Reveal>
              </div>
            </motion.div>
          )}

          {/* ══════════ TIMELINE ══════════ */}
          {view === 'timeline' && (
            <motion.div key="tl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column' }}>

              {/* Interactive Filters */}
              <div
                style={{ ...sectionShellStyle, order: layout.timeline.indexOf('tl-filters') }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveSection('timeline', 'tl-filters')}
              >
                <DragHandle onDragStart={() => setDraggingSection({ view: 'timeline', id: 'tl-filters' })} onDragEnd={() => setDraggingSection(null)} />
                <Reveal>
                  <div style={{ ...cardStyle, padding: '24px', marginBottom: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
                    <div style={{ ...cardStyle, borderRadius: '16px', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                          Monat auswählen
                        </span>
                        <span style={{ fontSize: '11px', color: '#7a6950', fontWeight: 600 }}>
                          {MONTH_LABELS[selectedMonthIdx]} 2025
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          onClick={() => setSelectedMonthIdx((i) => Math.max(0, i - 1))}
                          disabled={selectedMonthIdx === 0}
                          style={{
                            width: 34, height: 34, borderRadius: '10px', border: '1px solid rgba(200,169,126,0.12)',
                            background: 'rgba(200,169,126,0.04)', color: '#e0d5c4', cursor: selectedMonthIdx === 0 ? 'default' : 'pointer',
                            opacity: selectedMonthIdx === 0 ? 0.45 : 1,
                          }}
                        >
                          <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <div style={{ flex: 1, fontSize: '20px', fontWeight: 700, color: '#e0d5c4', fontVariantNumeric: 'tabular-nums' }}>
                          {fmt(selectedMonthTotal, 2)} €
                        </div>
                        <button
                          onClick={() => setSelectedMonthIdx((i) => Math.min(monthlyData.length - 1, i + 1))}
                          disabled={selectedMonthIdx === monthlyData.length - 1}
                          style={{
                            width: 34, height: 34, borderRadius: '10px', border: '1px solid rgba(200,169,126,0.12)',
                            background: 'rgba(200,169,126,0.04)', color: '#e0d5c4', cursor: selectedMonthIdx === monthlyData.length - 1 ? 'default' : 'pointer',
                            opacity: selectedMonthIdx === monthlyData.length - 1 ? 0.45 : 1,
                          }}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    <div style={{ ...cardStyle, borderRadius: '16px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '10px' }}>
                        Konto Drilldown
                      </div>
                      <select
                        value={selectedAccount || ''}
                        onChange={(e) => setSelectedAccount(e.target.value || null)}
                        style={{
                          width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(200,169,126,0.12)',
                          background: 'rgba(15, 13, 11, 0.7)', color: '#e0d5c4', fontSize: '12px', fontFamily: 'inherit',
                        }}
                      >
                        {monthAccountTotals.map((account) => (
                          <option key={account.konto} value={account.konto}>
                            {account.konto} · {account.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ ...cardStyle, borderRadius: '16px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '10px' }}>
                        Partner Filter
                      </div>
                      <select
                        value={selectedPartner}
                        onChange={(e) => setSelectedPartner(e.target.value)}
                        style={{
                          width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(200,169,126,0.12)',
                          background: 'rgba(15, 13, 11, 0.7)', color: '#e0d5c4', fontSize: '12px', fontFamily: 'inherit',
                        }}
                      >
                        {partnerOptions.map((partner) => (
                          <option key={partner} value={partner}>{partner}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  </div>
                </Reveal>
              </div>

              {/* Stacked Area */}
              <div
                style={{ ...sectionShellStyle, order: layout.timeline.indexOf('tl-stacked') }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveSection('timeline', 'tl-stacked')}
              >
                <DragHandle onDragStart={() => setDraggingSection({ view: 'timeline', id: 'tl-stacked' })} onDragEnd={() => setDraggingSection(null)} />
                <Reveal>
                  <div style={{ ...cardStyle, padding: '28px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Calendar size={14} color={GOLD} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Monatlicher Verlauf nach Kategorie</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#4a3f32', marginBottom: '24px' }}>
                    {selectedAccount
                      ? `Fokus auf Konto ${selectedAccount} (${MONTH_LABELS[monthRange.start]} bis ${MONTH_LABELS[monthRange.end]})`
                      : `Fokus auf ${MONTH_LABELS[selectedMonthIdx]} (${MONTH_LABELS[monthRange.start]} bis ${MONTH_LABELS[monthRange.end]})`}
                  </p>
                  <ResponsiveContainer width="100%" height={380}>
                    <AreaChart data={selectedAccount ? selectedAccountSeries : focusedStackedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,169,126,0.04)" vertical={false} />
                      <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: '#5c4f3d', fontSize: 11, fontFamily: 'Inter' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3d352b', fontSize: 10, fontFamily: 'Inter' }} tickFormatter={(v) => `${fmtK(v)}`} />
                      <Tooltip content={<ChartTooltip />} />
                      {selectedAccount ? (
                        <Area type="monotone" dataKey="total" stroke={GOLD} fill={GOLD} fillOpacity={0.35} name={`Konto ${selectedAccount}`} isAnimationActive={false} />
                      ) : (
                        ['Lizenzen', 'Buchführung', 'Fremdleist', 'Betriebsbed', 'Mieten', 'Telefon', 'Beratung', 'Porto', 'Bürobedarf', 'Übrige'].map((key, i) => (
                          <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={STACK_COLORS[i]} fill={STACK_COLORS[i]} fillOpacity={0.55} name={key} isAnimationActive={false} />
                        ))
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                  {!selectedAccount && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
                      {['Lizenzen', 'Buchführung', 'Fremdleist.', 'Betriebsbed.', 'Mieten', 'Telefon', 'Beratung', 'Porto', 'Bürobedarf', 'Übrige'].map((n, i) => (
                        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '2px', background: STACK_COLORS[i] }} />
                          <span style={{ fontSize: '10px', color: '#5c4f3d' }}>{n}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                </Reveal>
              </div>

              {/* Drilldown Panels */}
              <div
                style={{ ...sectionShellStyle, order: layout.timeline.indexOf('tl-drilldown') }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveSection('timeline', 'tl-drilldown')}
              >
                <DragHandle onDragStart={() => setDraggingSection({ view: 'timeline', id: 'tl-drilldown' })} onDragEnd={() => setDraggingSection(null)} />
                <Reveal delay={0.08}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ ...cardStyle, padding: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Konten im Monat {MONTH_LABELS[selectedMonthIdx]}</span>
                      <span style={{ fontSize: '10px', color: '#5c4f3d' }}>{monthAccountTotals.length} Konten</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {monthAccountTotals.slice(0, 8).map((account) => (
                        <button
                          key={account.konto}
                          onClick={() => setSelectedAccount(account.konto)}
                          style={{
                            ...cardStyle,
                            borderRadius: '12px',
                            padding: '10px 12px',
                            display: 'grid',
                            gridTemplateColumns: '64px 1fr auto',
                            gap: '10px',
                            alignItems: 'center',
                            cursor: 'pointer',
                            background: selectedAccount === account.konto ? 'rgba(200,169,126,0.08)' : 'rgba(200,169,126,0.025)',
                            textAlign: 'left',
                          }}
                        >
                          <span style={{ fontSize: '11px', color: '#7a6950', fontWeight: 600 }}>{account.konto}</span>
                          <span style={{ fontSize: '12px', color: '#e0d5c4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.name}</span>
                          <span style={{ fontSize: '12px', color: '#e0d5c4', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt(account.total, 2)} €</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ ...cardStyle, padding: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Kostenstellenrechnung nach Partner</span>
                      <span style={{ fontSize: '10px', color: '#5c4f3d' }}>{selectedPartner}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                      {costCenterTotals.length ? costCenterTotals.slice(0, 8).map((row) => (
                        <div
                          key={row.costCenter}
                          style={{
                            ...cardStyle,
                            borderRadius: '12px',
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span style={{ fontSize: '11px', color: '#7a6950', fontWeight: 600 }}>{row.costCenter}</span>
                          <span style={{ fontSize: '12px', color: '#e0d5c4', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt(row.total, 2)} €</span>
                        </div>
                      )) : (
                        <div style={{ fontSize: '12px', color: '#5c4f3d', padding: '10px 4px' }}>
                          Keine Einträge für den gewählten Filter.
                        </div>
                      )}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(200,169,126,0.08)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Top Partner im Konto</span>
                      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {partnerTotals.slice(0, 6).map((partner) => (
                          <button
                            key={partner.partner}
                            onClick={() => setSelectedPartner(partner.partner)}
                            style={{
                              border: '1px solid rgba(200,169,126,0.12)',
                              background: selectedPartner === partner.partner ? 'rgba(200,169,126,0.14)' : 'rgba(200,169,126,0.04)',
                              color: selectedPartner === partner.partner ? '#e0d5c4' : '#7a6950',
                              borderRadius: '100px',
                              padding: '5px 10px',
                              fontSize: '10px',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }}
                          >
                            {partner.partner}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  </div>
                </Reveal>
              </div>

              <div
                style={{ ...sectionShellStyle, order: layout.timeline.indexOf('tl-breakdown') }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveSection('timeline', 'tl-breakdown')}
              >
                <DragHandle onDragStart={() => setDraggingSection({ view: 'timeline', id: 'tl-breakdown' })} onDragEnd={() => setDraggingSection(null)} />
                <Reveal delay={0.1}>
                  <div style={{ ...cardStyle, padding: '22px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>
                      Summenaufschlüsselung Konto {selectedAccount || '—'}
                    </span>
                    <span style={{ fontSize: '10px', color: '#5c4f3d' }}>
                      {partnerFilteredBookings.length} Buchungen
                    </span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ minWidth: '760px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 130px 120px 85px', gap: '10px', padding: '0 8px 8px', borderBottom: '1px solid rgba(200,169,126,0.08)' }}>
                        <span style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Datum</span>
                        <span style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Belegtext</span>
                        <span style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Partner</span>
                        <span style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Kostenstelle</span>
                        <span style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Betrag</span>
                      </div>
                      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                        {partnerFilteredBookings.slice(0, 80).map((entry, idx) => (
                          <div
                            key={`${entry.k}-${entry.d}-${idx}-${entry.b}`}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '110px 1fr 130px 120px 85px',
                              gap: '10px',
                              padding: '9px 8px',
                              borderBottom: '1px solid rgba(200,169,126,0.04)',
                            }}
                          >
                            <span style={{ fontSize: '11px', color: '#7a6950' }}>{entry.d}</span>
                            <span style={{ fontSize: '11px', color: '#e0d5c4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.t}</span>
                            <span style={{ fontSize: '11px', color: '#9e8c73', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.partner}</span>
                            <span style={{ fontSize: '11px', color: '#7a6950' }}>{entry.costCenter}</span>
                            <span style={{ fontSize: '11px', color: entry.b >= 0 ? '#e0d5c4' : '#b8956a', textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                              {fmt(entry.b, 2)} €
                            </span>
                          </div>
                        ))}
                        {!partnerFilteredBookings.length && (
                          <div style={{ fontSize: '12px', color: '#5c4f3d', padding: '16px 8px' }}>
                            Keine Buchungen für die aktuelle Auswahl.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                </Reveal>
              </div>

              {/* Month Cards */}
              <div
                style={{ ...sectionShellStyle, order: layout.timeline.indexOf('tl-monthcards') }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveSection('timeline', 'tl-monthcards')}
              >
                <DragHandle onDragStart={() => setDraggingSection({ view: 'timeline', id: 'tl-monthcards' })} onDragEnd={() => setDraggingSection(null)} />
                <Reveal delay={0.1}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Zap size={14} color={GOLD} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Monatsvergleich</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {monthlyData.map((m, i) => {
                    const dev = ((m.total - monthlyAvg) / monthlyAvg) * 100;
                    const up = dev > 0;
                    return (
                      <MagneticCard
                        key={m.month}
                        style={{
                          ...cardStyle,
                          padding: '18px',
                          background: selectedMonthIdx === i ? 'rgba(200,169,126,0.07)' : cardStyle.background,
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.03 }}
                          onMouseEnter={() => setHoveredMonth(i)}
                          onMouseLeave={() => setHoveredMonth(null)}
                          onClick={() => setSelectedMonthIdx(i)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                            background: `linear-gradient(90deg, ${up ? GOLD : '#4a3f32'}, transparent)`,
                            opacity: hoveredMonth === i || selectedMonthIdx === i ? 1 : 0.5, transition: 'opacity 0.3s',
                          }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '11px', color: '#5c4f3d', fontWeight: 600 }}>{m.month}</span>
                            <div style={{
                              fontSize: '10px', fontWeight: 600,
                              color: up ? GOLD : '#6b8b5c',
                              display: 'flex', alignItems: 'center', gap: '2px',
                              padding: '2px 7px', borderRadius: '100px',
                              background: up ? 'rgba(200,169,126,0.06)' : 'rgba(107,139,92,0.06)',
                            }}>
                              {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                              {up ? '+' : ''}{dev.toFixed(0)}%
                            </div>
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: '#e0d5c4', fontVariantNumeric: 'tabular-nums', marginBottom: '8px' }}>
                            {fmt(m.total, 0)} €
                          </div>
                          <Sparkline
                            data={monthlyData.map((_, j) => j === i ? m.total : monthlyData[j].total * 0.3)}
                            color={up ? GOLD : '#6b8b5c'}
                            width={120} height={20}
                          />
                        </motion.div>
                      </MagneticCard>
                    );
                  })}
                  </div>
                </Reveal>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ FOOTER ══ */}
        <Reveal delay={0.2}>
          <div style={{
            marginTop: '56px', paddingTop: '24px',
            borderTop: '1px solid rgba(200,169,126,0.04)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: '10px', color: '#3d352b' }}>
              Erstellt für Senger & Senger Steuerberater · Datenquelle: DATEV Kostenrechnung · Zeitraum: 01–12/2025
            </div>
            <div style={{ fontSize: '10px', color: '#3d352b', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                width: 16, height: 16, borderRadius: '4px',
                background: `linear-gradient(135deg, ${GOLD}, #8b7355)`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '7px', fontWeight: 900, color: '#0c0a09',
              }}>S</span>
              SENGER & SENGER
            </div>
          </div>
        </Reveal>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0a09; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,169,126,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(200,169,126,0.2); }
        @media (max-width: 768px) {
          main > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
