import CubeScene from "./cube-scene";

export const metadata = {
  title: "Nexora · Das System",
  description:
    "Ein Generalunternehmer. Vier Gewerke. Ein schlüsselfertiges System für industrielle Energieinfrastruktur.",
};

const stages = [
  {
    id: "system",
    kicker: "Phase I · Das System",
    heading: "Ein Gewerk allein ist nicht das System.",
    body:
      "Elektro, PV, Blitzschutz und Wärmepumpe hängen technisch, normativ und zeitlich zusammen. Nur konsolidiert wird daraus eine Halle, die funktioniert.",
  },
  {
    id: "parts",
    kicker: "Phase II · Die Gewerke",
    heading: "Vier Fachbereiche, einzeln betrachtet.",
    body:
      "Jeder Gewerk ist ein eigenes Kompetenzfeld mit eigenen Normen — VDE 0100, DIN EN 62305, MsbG, GEG. Wir planen sie als Einzelwerke und als System.",
  },
  {
    id: "reassembly",
    kicker: "Phase III · Die Montage",
    heading: "Zusammengefügt, nicht zusammengestückelt.",
    body:
      "Gleiche Planungssprache, gleicher Zeitstrahl, gleiche Dokumentation. Schnittstellen sind abgestimmt, bevor die erste Leitung liegt.",
  },
  {
    id: "commissioned",
    kicker: "Phase IV · Inbetriebnahme",
    heading: "Eine Abnahme. Ein Protokoll.",
    body:
      "Keine Finger-Zeigerei zwischen Subunternehmern. Eine Schnittstelle — Nexora — und ein vollständig dokumentiertes System.",
  },
];

const stats = [
  { v: 4, suffix: "", label: "Gewerke aus einer Hand" },
  { v: 1, suffix: "", label: "Ansprechpartner" },
  { v: 1, suffix: "", label: "Abnahme­protokoll" },
  { v: 100, suffix: " %", label: "Normkonform" },
];

export default function Demo4Page() {
  return (
    <main style={{ background: "#05070a", color: "#fff", minHeight: "100vh" }}>
      <CubeScene stages={stages} stats={stats} />
    </main>
  );
}
