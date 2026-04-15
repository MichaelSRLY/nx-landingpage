import PVScene from "./pv-scene";

export const metadata = {
  title: "Nexora · PV-Anlage · Montage",
  description:
    "Premium PV-Anlage von der Zerlegung bis zur Inbetriebnahme — cinematisch, scroll­gesteuert, in 4K.",
};

const TOTAL_FRAMES = 238;
const FRAME_BASE = "/animations/pv/frames/frame-";

const stages = [
  {
    id: "components",
    kicker: "Phase I · Komponenten",
    heading: "Alles bereit.",
    body:
      "Module, Unterkonstruktion, Wechselrichter, Verkabelung — jedes Bauteil geprüft, geliefert, sortiert. Premium-Komponenten für 25+ Jahre Ertrag.",
  },
  {
    id: "assembly",
    kicker: "Phase II · Montage",
    heading: "Schiene. Modul. Klemme.",
    body:
      "Tragschienen auf die Unterkonstruktion. Module Reihe für Reihe. Klemmen, Kabelmanagement, String-Verschaltung — millimetergenau.",
  },
  {
    id: "commissioned",
    kicker: "Phase III · Inbetriebnahme",
    heading: "Strom vom eigenen Dach.",
    body:
      "Wechselrichter gesetzt, Netzanschluss, Messprotokoll, Abnahme. Ab diesem Moment produziert die Halle ihren eigenen Strom.",
  },
];

const components = [
  { id: "mod", label: "Monokristalline Module", spec: "12 × 450 Wp", stage: 1 as const },
  { id: "rail", label: "Tragschienen Aluminium", spec: "4 × 6.0 m", stage: 1 as const },
  { id: "clamp", label: "Mittel- und Endklemmen", spec: "32 Stk.", stage: 1 as const },
  { id: "inv", label: "String-Wechselrichter", spec: "1 × 5.4 kW", stage: 2 as const },
  { id: "dc", label: "DC-Leitung · MC4", spec: "2 Strings", stage: 2 as const },
  { id: "ac", label: "AC-Anbindung · Zähler", spec: "Netzanschluss", stage: 3 as const },
];

const stats = [
  { v: 5.4, suffix: " kWp", label: "Peak-Leistung" },
  { v: 5300, suffix: " kWh", label: "Ertrag · Jahr 1" },
  { v: 25, suffix: " J", label: "Produkt­garantie" },
  { v: 100, suffix: " %", label: "DIN-konform" },
];

export default function Demo2Page() {
  return (
    <main style={{ background: "#05070a", color: "#fff", minHeight: "100vh" }}>
      <PVScene
        totalFrames={TOTAL_FRAMES}
        frameBase={FRAME_BASE}
        stages={stages}
        components={components}
        stats={stats}
      />
    </main>
  );
}
