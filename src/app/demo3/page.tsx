import DigitalScene from "./digital-scene";

export const metadata = {
  title: "Nexora · Digital Twin · Das Bauen von morgen",
  description:
    "Vom Rohbau zum Live-Dashboard. Jede Nexora-Halle ist vollständig digital — Ertrag, Lasten, Wartung in Echtzeit.",
};

const TOTAL_FRAMES = 238;
const FRAME_BASE = "/animations/digital/frames/frame-";

const stages = [
  {
    id: "inside",
    kicker: "Phase I · Status quo",
    heading: "Eine Halle ist mehr als Stahl und Beton.",
    body: "Unter dem Dach passiert die eigentliche Wertschöpfung — doch meistens ist niemand dabei, wenn sie schiefgeht.",
  },
  {
    id: "rise",
    kicker: "Phase II · Digital Twin",
    heading: "Wir ziehen Ihre Halle ins Netz.",
    body: "Ertrag, Lasten, Temperatur, Fehlerströme, Verbrauch — jede Komponente wird zur Datenquelle, jede Anlage transparent.",
  },
  {
    id: "dashboards",
    kicker: "Phase III · Live",
    heading: "Dashboards, die mitdenken.",
    body: "Individuelle Kundenportale mit Echtzeit-Werten, Schwellwert-Alerts, Wartungs-Tickets. PV-Ertrag, Wärmepumpe, Blitzschutz-Prüfzyklen — alles an einem Ort.",
  },
  {
    id: "maintenance",
    kicker: "Phase IV · Vorausschauend",
    heading: "Probleme, bevor sie welche werden.",
    body: "Anomalie-Erkennung erkennt abfallende Strings, fallenden COP der Wärmepumpe, ungewöhnliche Lastspitzen — Wartung wird geplant, nicht reagiert.",
  },
  {
    id: "tomorrow",
    kicker: "Phase V · Das Bauen von morgen",
    heading: "Gebaut für heute. Optimiert für übermorgen.",
    body: "Jede Nexora-Halle kommt mit einem Digitalen Zwilling. Heute zur Inbetriebnahme. Morgen zur Optimierung. Übermorgen zur Skalierung.",
  },
];

const signals = [
  { id: "pv", label: "PV · Erzeugung", unit: "kW", stage: 1 as const },
  { id: "wp", label: "Wärmepumpe · COP", unit: "", stage: 2 as const },
  { id: "bs", label: "Blitzschutz · Prüfstatus", unit: "", stage: 2 as const },
  { id: "load", label: "Lastverteilung", unit: "kW", stage: 3 as const },
  { id: "alerts", label: "Aktive Alerts", unit: "", stage: 4 as const },
  { id: "ml", label: "ML Anomalie-Score", unit: "σ", stage: 4 as const },
];

const stats = [
  { v: 24, suffix: " / 7", label: "Live-Telemetrie" },
  { v: 6, suffix: " Systeme", label: "Integriert pro Halle" },
  { v: 99.7, suffix: " %", label: "Ø Verfügbarkeit" },
  { v: 3, suffix: " Min", label: "Ø Time-to-Alert" },
];

export default function Demo3Page() {
  return (
    <main style={{ background: "#05070a", color: "#fff", minHeight: "100vh" }}>
      <DigitalScene
        totalFrames={TOTAL_FRAMES}
        frameBase={FRAME_BASE}
        stages={stages}
        signals={signals}
        stats={stats}
      />
    </main>
  );
}
