import ScrollSequence from "./scroll-sequence";

export const metadata = {
  title: "Nexora · Energie­infrastruktur, schlüssel­fertig.",
  description:
    "Elektroinstallation, PV-Anlagen, Blitzschutz und Wärmepumpen für Industriehallen — eine Halle, ein Generalunternehmer.",
};

const TOTAL_FRAMES = 381; // 48 fps × ~7.94 s (motion-interpolated from 24 fps Veo 4K)
const FRAME_BASE = "/animations/elektro/frames/frame-";

const stages = [
  {
    id: "rohbau",
    kicker: "01 · Tiefbau",
    heading: "Die Halle steht. Jetzt beginnen wir.",
    body:
      "Erdungsgraben vorbereiten, Hausanschluss planen, Kabeltrassen festlegen — Tag 1 auf der Baustelle.",
  },
  {
    id: "elektro",
    kicker: "02 · Elektroinstallation",
    heading: "Elektroinstallation",
    body:
      "Kabeltrassen, Steigeleitern, Verteiler und Schaltanlagen — normgerecht nach VDE 0100, dokumentiert und messbar.",
  },
  {
    id: "pv",
    kicker: "03 · PV-Anlage",
    heading: "Photovoltaik auf der gesamten Dachfläche",
    body:
      "Monokristalline Module, Wechselrichter, Zählerplatz und Netzanschluss. Ertrag ab Inbetriebnahme.",
  },
  {
    id: "blitzschutz",
    kicker: "04 · Blitzschutz",
    heading: "Getrennte Fangeinrichtung",
    body:
      "Nach DIN EN 62305-3 Beiblatt 5. Fangstangen mit Trennungsabstand, Ableitungen, Fundamenterder. Kein Leiter über Modulen.",
  },
  {
    id: "waermepumpe",
    kicker: "05 · Wärmepumpe",
    heading: "Luft-Wasser-Wärmepumpe",
    body:
      "Außeneinheit auf Fundamentplatte, hydraulisch angebunden, monitoring-ready. Heizung und Warmwasser aus Strom vom eigenen Dach.",
  },
  {
    id: "inbetriebnahme",
    kicker: "06 · Inbetriebnahme",
    heading: "Messprotokoll. Abnahme. Übergabe.",
    body:
      "Isolationswiderstand, Schleifenimpedanz, FI-Test, Ertragsmessung. Die Halle ist produktionsbereit.",
  },
];

export default function DemoPage() {
  return (
    <main style={{ background: "#05070a", color: "#fff", minHeight: "100vh" }}>
      <ScrollSequence
        totalFrames={TOTAL_FRAMES}
        frameBase={FRAME_BASE}
        stages={stages}
      />
    </main>
  );
}
