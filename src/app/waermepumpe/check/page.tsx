"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { ThemeToggle } from "../HeatPumpClient";
import "../styles.css";
import "./check-landing.css";
import {
  buildLocalRequirements,
  buildOffer,
  calculateAssessment,
  type BuildingPayload,
  type BuildingType,
  type HeatingSystem,
  type LeadPayload
} from "@/lib/heatpump/scoring";
import { trackBrowserEvent } from "@/app/MetaPixel";
import type { DashboardPayload } from "@/lib/heatpump/project";

/* The /waermepumpe/check page is the highest-traffic surface on the property
   (10× the Andromeda LP traffic). Designed as a 3-screen lead funnel:
     screen "form"      → 4 essential questions, single tap-target screen
     screen "reveal"    → the full result, €-numbers, score, Förderhinweis
     screen "email"     → soft capture, email-only (no password)
     screen "details"   → optional name + phone, triggers PDF email
     screen "success"   → done + optional Projektakte upsell
   The scoring engine accepts our 4-field input fine — every unset field is
   already wired to a defensive default in calculateAssessment.            */

type Stage = "form" | "reveal" | "email" | "details" | "success";

const EBOOK_KEY = "foerderungs-maximizer-2026";

/* Defaults for every BuildingPayload field we DON'T ask the user. The
   scoring engine handles "unknown" sentinels gracefully — these picks just
   produce a plausible Spanne so the reveal screen always has numbers. */
const leadDefaults: LeadPayload = {
  customerRole: "Eigenheim",
  name: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  ownerStatus: "Eigentümer",
  source: "/waermepumpe/check"
};

const buildingDefaults: BuildingPayload = {
  buildingType: "Einfamilienhaus",
  yearBuilt: 0,
  livingArea: 0,
  units: 1,
  renovation: "unklar",
  heatingSystem: "unbekannt",
  annualConsumption: 0,
  flowTemperature: 0,
  heatSurface: "unklar",
  outdoorSpace: "noch unklar",
  hasPv: false,
  electricalReadiness: "unklar",
  hotWaterMode: "unklar",
  incomeBand: "nicht-angeben",
  plannedHeatPumpType: "noch offen"
};

const buildingOptions: { value: BuildingType; label: string; sub: string }[] = [
  { value: "Einfamilienhaus", label: "Einfamilienhaus", sub: "1 Wohneinheit" },
  { value: "Zweifamilienhaus", label: "Zweifamilienhaus", sub: "2 Einheiten" },
  { value: "Mehrfamilienhaus", label: "Mehrfamilienhaus", sub: "3+ Einheiten · WEG" }
];

const heatingOptions: { value: HeatingSystem; label: string; sub: string }[] = [
  { value: "Gas", label: "Gas", sub: "Klimaboni möglich" },
  { value: "Öl", label: "Öl", sub: "Klimaboni möglich" },
  { value: "Fernwärme", label: "Fernwärme", sub: "Förderlogik weicht ab" },
  { value: "Strom / Nachtspeicher", label: "Strom / Nachtspeicher", sub: "Elektro-Prüfpfad eigen" },
  { value: "unbekannt", label: "Ich weiß es nicht", sub: "wir prüfen vor Ort" }
];

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);
const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const Lock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

const safe = (fn: () => void) => { try { fn(); } catch { /* posthog not ready */ } };

export default function HeatPumpCheckPage() {
  return (
    <Suspense fallback={null}>
      <CheckLanding />
    </Suspense>
  );
}

function CheckLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stage, setStage] = useState<Stage>("form");
  const [lead, setLead] = useState<LeadPayload>(leadDefaults);
  const [building, setBuilding] = useState<BuildingPayload>(buildingDefaults);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [showProjektakte, setShowProjektakte] = useState(false);
  const [projektaktePassword, setProjektaktePassword] = useState("");
  const [projektakteLoading, setProjektakteLoading] = useState(false);

  const utmRef = useRef<Record<string, string>>({});

  /* Hydrate from hero-calculator handoff (?plz=&building=&heat=) + capture
     UTM/source params for downstream attribution. */
  useEffect(() => {
    const plz = searchParams.get("plz");
    const heroBuilding = searchParams.get("building");
    const heroHeat = searchParams.get("heat");
    if (plz) setLead((l) => ({ ...l, postalCode: plz.slice(0, 5) }));
    setBuilding((b) => {
      const next = { ...b };
      if (heroBuilding === "efh-alt") { next.buildingType = "Einfamilienhaus"; next.renovation = "unsaniert"; }
      else if (heroBuilding === "efh-neu") { next.buildingType = "Einfamilienhaus"; next.renovation = "saniert"; }
      else if (heroBuilding === "mfh") { next.buildingType = "Mehrfamilienhaus"; }
      if (heroHeat === "oel-alt") next.heatingSystem = "Öl";
      else if (heroHeat === "gas-alt" || heroHeat === "oel-gas-neu") next.heatingSystem = "Gas";
      else if (heroHeat === "strom") next.heatingSystem = "Strom / Nachtspeicher";
      return next;
    });

    const utm: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
      const v = searchParams.get(k);
      if (v) utm[k] = v;
    });
    utmRef.current = utm;
    safe(() => posthog.capture("check_landing_view", { utm }));
  }, [searchParams]);

  const assessment = useMemo(() => calculateAssessment(building, lead), [building, lead]);
  const local = useMemo(() => buildLocalRequirements(lead.postalCode, building.outdoorSpace), [lead.postalCode, building.outdoorSpace]);
  const offer = useMemo(() => buildOffer(building, assessment.level, lead), [building, assessment.level, lead]);

  const canCalculate = Boolean(
    lead.postalCode.length === 5 &&
    building.buildingType &&
    building.yearBuilt >= 1900 && building.yearBuilt <= new Date().getFullYear() &&
    building.heatingSystem !== "unbekannt"
  );

  const calculate = () => {
    setError("");
    if (!canCalculate) {
      setError("Bitte alle vier Felder ausfüllen, damit wir rechnen können.");
      return;
    }
    setStage("reveal");
    safe(() => posthog.capture("check_calculated", {
      plz: lead.postalCode,
      building_type: building.buildingType,
      year_built: building.yearBuilt,
      heating: building.heatingSystem,
      level: assessment.level,
      score: assessment.score,
      funding_min: offer.fundingEstimateMin,
      funding_max: offer.fundingEstimateMax
    }));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(lead.email.trim())) {
      setError("Bitte eine gültige E-Mail eingeben.");
      return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/ebook/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "email",
          ebookKey: EBOOK_KEY,
          email: lead.email.trim(),
          source: "check-result",
          utm: utmRef.current,
          consent: { marketing: marketingConsent }
        })
      });
      const payload = await res.json() as { leadId?: string; eventId?: string; error?: string };
      if (!res.ok || !payload.leadId) throw new Error(payload.error || "Speichern fehlgeschlagen.");
      setLeadId(payload.leadId);
      safe(() => trackBrowserEvent("Lead", payload.eventId, {
        content_name: EBOOK_KEY, lead_event: "check_email_step"
      }));
      safe(() => {
        posthog.identify(payload.leadId!, { email: lead.email.trim() });
        posthog.capture("check_email_submitted", { lead_id: payload.leadId, ebook: EBOOK_KEY });
      });
      setStage("details");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
    } finally { setLoading(false); }
  };

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId) { setError("Bitte zuerst E-Mail eingeben."); setStage("email"); return; }
    if (!lead.name.trim() || !lead.phone.trim()) {
      setError("Name und Telefonnummer benötigen wir für den persönlichen Förder-Check.");
      return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/ebook/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "complete",
          leadId,
          ebookKey: EBOOK_KEY,
          name: lead.name.trim(),
          phone: lead.phone.trim(),
          consent: { marketing: marketingConsent }
        })
      });
      const payload = await res.json() as { ok?: boolean; eventId?: string; error?: string };
      if (!res.ok || !payload.ok) throw new Error(payload.error || "PDF-Versand fehlgeschlagen.");
      safe(() => trackBrowserEvent("Contact", payload.eventId, {
        content_name: EBOOK_KEY, lead_event: "check_complete_step"
      }));
      safe(() => posthog.capture("check_pdf_requested", { lead_id: leadId, ebook: EBOOK_KEY }));
      setStage("success");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF-Versand fehlgeschlagen.");
    } finally { setLoading(false); }
  };

  const createProjektakte = async (e: React.FormEvent) => {
    e.preventDefault();
    if (projektaktePassword.length < 8) {
      setError("Bitte ein Passwort mit mindestens 8 Zeichen wählen.");
      return;
    }
    setProjektakteLoading(true); setError("");
    try {
      const res = await fetch("/api/heatpump/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, building, password: projektaktePassword })
      });
      const payload = await res.json() as { dashboard?: DashboardPayload; error?: string };
      if (!res.ok || !payload.dashboard) throw new Error(payload.error || "Projektakte konnte nicht angelegt werden.");
      safe(() => posthog.capture("check_projektakte_created", { lead_id: leadId }));
      router.push("/waermepumpe/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Projektakte konnte nicht angelegt werden.");
    } finally { setProjektakteLoading(false); }
  };

  const fundingMin = offer.fundingEstimateMin?.toLocaleString("de-DE") ?? "0";
  const fundingMax = offer.fundingEstimateMax?.toLocaleString("de-DE") ?? "0";

  return (
    <main className="hp-redesign nxlg">
      <nav className="nxlg-nav" aria-label="Hauptnavigation">
        <Link href="/waermepumpe" className="nxlg-brand"><span className="dot" />NEXORA</Link>
        <div className="nxlg-nav-links">
          <Link href="/waermepumpe">Übersicht</Link>
          <Link href="/waermepumpe/foerderung">Förderung</Link>
          <Link href="/waermepumpe/kosten">Kosten</Link>
          <Link href="/waermepumpe/login">Einloggen</Link>
        </div>
        <div className="nxlg-nav-right"><ThemeToggle /></div>
      </nav>

      <section className="nxlg-shell">
        {stage === "form" && (
          <FormScreen
            lead={lead}
            building={building}
            setLead={setLead}
            setBuilding={setBuilding}
            onCalculate={calculate}
            canCalculate={canCalculate}
            error={error}
          />
        )}

        {(stage === "reveal" || stage === "email" || stage === "details" || stage === "success") && (
          <RevealScreen
            stage={stage}
            lead={lead}
            building={building}
            setLead={setLead}
            assessment={assessment}
            offer={offer}
            local={local}
            fundingMin={fundingMin}
            fundingMax={fundingMax}
            marketingConsent={marketingConsent}
            setMarketingConsent={setMarketingConsent}
            showProjektakte={showProjektakte}
            setShowProjektakte={setShowProjektakte}
            projektaktePassword={projektaktePassword}
            setProjektaktePassword={setProjektaktePassword}
            onStartCapture={() => setStage("email")}
            onEditAnswers={() => { setStage("form"); setError(""); }}
            onSubmitEmail={submitEmail}
            onSubmitDetails={submitDetails}
            onCreateProjektakte={createProjektakte}
            loading={loading}
            projektakteLoading={projektakteLoading}
            error={error}
          />
        )}
      </section>

      <footer className="nxlg-foot">
        <div className="nxlg-foot-row">
          <span><Lock /> KEINE VERBINDLICHE BERATUNG · ECHTE PLANUNG ERST NACH TERMIN</span>
          <span className="nxlg-foot-links">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </span>
        </div>
      </footer>
    </main>
  );
}

/* ─────────────────────────  FORM SCREEN  ───────────────────────── */

interface FormScreenProps {
  lead: LeadPayload;
  building: BuildingPayload;
  setLead: (l: LeadPayload) => void;
  setBuilding: (b: BuildingPayload) => void;
  onCalculate: () => void;
  canCalculate: boolean;
  error: string;
}

function FormScreen({ lead, building, setLead, setBuilding, onCalculate, canCalculate, error }: FormScreenProps) {
  return (
    <div className="nxlg-form">
      <header className="nxlg-form-head">
        <span className="nxlg-eyebrow">Wärmepumpen-Förderrechner</span>
        <h1>
          Ihre Förderzahl in <em>60&nbsp;Sekunden.</em>
        </h1>
        <p className="nxlg-lede">
          Vier Angaben. Kein Login. Kein Heizungsbauer-Termin. Sie sehen direkt, wie viel
          BEG-Förderung wahrscheinlich für Sie drin ist — und ob Ihr Gebäude WP-fähig ist.
        </p>
        <ul className="nxlg-trust">
          <li><Check /> €-Spanne statt Prozent-Nebel</li>
          <li><Check /> Förderung nach BEG 2026</li>
          <li><Check /> Termin <em>erst</em> wenn Sie das wollen</li>
        </ul>
      </header>

      <div className="nxlg-q">
        <label className="nxlg-q-label" htmlFor="plz">PLZ Ihrer Immobilie</label>
        <input
          id="plz"
          className="nxlg-q-input"
          inputMode="numeric"
          maxLength={5}
          placeholder="z. B. 04109"
          value={lead.postalCode}
          onChange={(e) => setLead({ ...lead, postalCode: e.target.value.replace(/\D/g, "").slice(0, 5) })}
        />
      </div>

      <div className="nxlg-q">
        <span className="nxlg-q-label">Gebäudeart</span>
        <div className="nxlg-tiles three">
          {buildingOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`nxlg-tile ${building.buildingType === opt.value ? "is-active" : ""}`}
              onClick={() => setBuilding({ ...building, buildingType: opt.value })}
            >
              <span className="nxlg-tile-label">{opt.label}</span>
              <span className="nxlg-tile-sub">{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="nxlg-q">
        <label className="nxlg-q-label" htmlFor="year">Baujahr</label>
        <input
          id="year"
          className="nxlg-q-input"
          inputMode="numeric"
          placeholder="z. B. 1998"
          value={building.yearBuilt > 0 ? String(building.yearBuilt) : ""}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/\D/g, "").slice(0, 4));
            setBuilding({ ...building, yearBuilt: Number.isFinite(n) ? n : 0 });
          }}
        />
      </div>

      <div className="nxlg-q">
        <span className="nxlg-q-label">Aktuelle Heizung</span>
        <div className="nxlg-tiles">
          {heatingOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`nxlg-tile ${building.heatingSystem === opt.value ? "is-active" : ""}`}
              onClick={() => setBuilding({ ...building, heatingSystem: opt.value })}
            >
              <span className="nxlg-tile-label">{opt.label}</span>
              <span className="nxlg-tile-sub">{opt.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <div className="nxlg-error">{error}</div>}

      <button
        type="button"
        className="nxlg-cta"
        onClick={onCalculate}
        disabled={!canCalculate}
      >
        Förderung berechnen <Arrow />
      </button>

      <p className="nxlg-microcopy">
        Keine Anmeldung. Wir speichern Ihre Eingaben erst, wenn Sie unten ausdrücklich auf
        <strong>&nbsp;„Ergebnis per E-Mail“</strong> tippen.
      </p>
    </div>
  );
}

/* ─────────────────────────  REVEAL + CAPTURE  ───────────────────────── */

interface RevealScreenProps {
  stage: Stage;
  lead: LeadPayload;
  building: BuildingPayload;
  setLead: (l: LeadPayload) => void;
  assessment: ReturnType<typeof calculateAssessment>;
  offer: ReturnType<typeof buildOffer>;
  local: ReturnType<typeof buildLocalRequirements>;
  fundingMin: string;
  fundingMax: string;
  marketingConsent: boolean;
  setMarketingConsent: (v: boolean) => void;
  showProjektakte: boolean;
  setShowProjektakte: (v: boolean) => void;
  projektaktePassword: string;
  setProjektaktePassword: (v: string) => void;
  onStartCapture: () => void;
  onEditAnswers: () => void;
  onSubmitEmail: (e: React.FormEvent) => void;
  onSubmitDetails: (e: React.FormEvent) => void;
  onCreateProjektakte: (e: React.FormEvent) => void;
  loading: boolean;
  projektakteLoading: boolean;
  error: string;
}

function RevealScreen(p: RevealScreenProps) {
  const levelLabel = p.assessment.level === "geeignet" ? "GEEIGNET"
    : p.assessment.level === "pruefung" ? "PRÜFEN" : "RISKANT";

  return (
    <div className="nxlg-reveal">
      <button type="button" className="nxlg-edit" onClick={p.onEditAnswers}>
        ← Antworten anpassen
      </button>

      <header className="nxlg-reveal-head">
        <span className="nxlg-eyebrow">Ihre Schätzung · BEG 2026</span>
        <h1>
          Förderung: <em>{p.fundingMin} – {p.fundingMax}&nbsp;€</em>
        </h1>
        <p className="nxlg-lede">{p.assessment.headline}</p>
      </header>

      <div className="nxlg-num-grid">
        <div className="nxlg-num gold">
          <small>möglicher Zuschuss</small>
          <strong>{p.fundingMin} – {p.fundingMax}&nbsp;€</strong>
          <span>{p.offer.fundingRateLabel}</span>
        </div>
        <div className="nxlg-num">
          <small>Investitionsspanne</small>
          <strong>{p.offer.priceRange.replace(" EUR", " €")}</strong>
          <span>brutto · gesamtes Projekt</span>
        </div>
        <div className="nxlg-num">
          <small>Eigenanteil nach Förderung</small>
          <strong>{p.offer.netCostRange.replace(" EUR", " €")}</strong>
          <span>realistische Nettospanne</span>
        </div>
      </div>

      <div className="nxlg-score">
        <div className="nxlg-score-row">
          <span className="nxlg-score-label">WP-Eignung Ihres Gebäudes</span>
          <span className={`nxlg-score-pill ${p.assessment.level}`}>{levelLabel} · {p.assessment.score}%</span>
        </div>
        <div className="nxlg-score-bar"><span style={{ width: `${p.assessment.score}%` }} /></div>
        <p className="nxlg-score-note">{p.assessment.confidence}% Datenkonfidenz. Jede weitere Angabe schärft die Zahl.</p>
      </div>

      <div className="nxlg-cards">
        {p.assessment.scoreCards.slice(0, 4).map((c) => {
          const tone = c.tone === "positive" ? "geeignet" : c.tone === "warning" ? "riskant" : "pruefung";
          return (
            <div key={c.label} className={`nxlg-card ${tone}`}>
              <small>{c.label}</small>
              <strong>{c.value}</strong>
              <span>{c.detail}</span>
            </div>
          );
        })}
      </div>

      <div className="nxlg-context">
        <div className="nxlg-context-row"><span>NETZBETREIBER</span><strong>{p.local.gridOperator}</strong></div>
        <div className="nxlg-context-row"><span>SCHALLRISIKO</span><strong>{p.local.soundRisk}</strong></div>
        <div className="nxlg-context-row"><span>KOMMUNALE WÄRMEPLANUNG</span><strong>{p.local.heatPlanning}</strong></div>
      </div>

      {/* ─── CAPTURE STAGES ─── */}

      {p.stage === "reveal" && (
        <div className="nxlg-capture">
          <div className="nxlg-capture-head">
            <h2>Möchten Sie diese Zahl als PDF + Ihren persönlichen Förder-Check?</h2>
            <p>Wir mailen Ihnen den 10-Seiten Förderungs-Maximizer 2026 — und prüfen Ihre konkrete Förderfähigkeit kostenlos.</p>
          </div>
          <button type="button" className="nxlg-cta" onClick={p.onStartCapture}>
            Ergebnis per E-Mail sichern <Arrow />
          </button>
          <p className="nxlg-microcopy"><Lock /> Nur E-Mail. Keine Anmeldung, kein Anruf — versprochen.</p>
        </div>
      )}

      {p.stage === "email" && (
        <form className="nxlg-capture" onSubmit={p.onSubmitEmail}>
          <div className="nxlg-capture-head">
            <h2>Wohin dürfen wir Ihr Ergebnis senden?</h2>
            <p>Sie bekommen eine sofortige Bestätigung. Den persönlichen Förder-Check senden wir Ihnen anschließend zu.</p>
          </div>
          <div className="nxlg-q">
            <label className="nxlg-q-label" htmlFor="email">E-Mail-Adresse</label>
            <input
              id="email"
              className="nxlg-q-input"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="name@beispiel.de"
              value={p.lead.email}
              onChange={(e) => p.setLead({ ...p.lead, email: e.target.value })}
            />
          </div>
          <label className="nxlg-consent">
            <input type="checkbox" checked={p.marketingConsent} onChange={(e) => p.setMarketingConsent(e.target.checked)} />
            <span>
              Ich willige ein, dass Nexora mir per E-Mail Förderhinweise und das PDF zusenden darf.
              Widerruf jederzeit per Klick. <Link href="/datenschutz">Datenschutz</Link>.
            </span>
          </label>
          {p.error && <div className="nxlg-error">{p.error}</div>}
          <button type="submit" className="nxlg-cta" disabled={p.loading}>
            {p.loading ? "Speichern…" : <>Ergebnis sichern <Arrow /></>}
          </button>
        </form>
      )}

      {p.stage === "details" && (
        <form className="nxlg-capture" onSubmit={p.onSubmitDetails}>
          <div className="nxlg-capture-head">
            <span className="nxlg-tag-success"><Check /> E-Mail gespeichert</span>
            <h2>Für den persönlichen Förder-Check:</h2>
            <p>Name + Telefon — wir rufen <em>nur</em> wenn Sie es ausdrücklich wollen. Andernfalls bekommen Sie nur das PDF.</p>
          </div>
          <div className="nxlg-q-row">
            <div className="nxlg-q">
              <label className="nxlg-q-label" htmlFor="name">Name</label>
              <input
                id="name"
                className="nxlg-q-input"
                autoComplete="name"
                placeholder="Vor- und Nachname"
                value={p.lead.name}
                onChange={(e) => p.setLead({ ...p.lead, name: e.target.value })}
              />
            </div>
            <div className="nxlg-q">
              <label className="nxlg-q-label" htmlFor="phone">Telefon</label>
              <input
                id="phone"
                className="nxlg-q-input"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0341 …"
                value={p.lead.phone}
                onChange={(e) => p.setLead({ ...p.lead, phone: e.target.value })}
              />
            </div>
          </div>
          {p.error && <div className="nxlg-error">{p.error}</div>}
          <button type="submit" className="nxlg-cta" disabled={p.loading}>
            {p.loading ? "PDF versenden…" : <>PDF senden + Förder-Check anfragen <Arrow /></>}
          </button>
          <p className="nxlg-microcopy">Sie können diesen Schritt überspringen — das PDF kommt dann <em>nicht</em>. Wir behalten nur Ihre E-Mail.</p>
        </form>
      )}

      {p.stage === "success" && (
        <div className="nxlg-capture nxlg-success">
          <div className="nxlg-success-icon"><Check /></div>
          <h2>Geschickt. Schauen Sie kurz in Ihr Postfach.</h2>
          <p>Wir haben Ihr Ergebnis und das PDF an <strong>{p.lead.email}</strong> gesendet. In den nächsten 24h melden wir uns telefonisch zum kostenlosen Förder-Check.</p>

          {!p.showProjektakte ? (
            <div className="nxlg-upsell">
              <h3>Optional — Ihre Projektakte anlegen?</h3>
              <p>Mit Passwort behalten Sie Ihr Ergebnis im Dashboard, laden Heizkostenabrechnungen hoch, und sehen Schritt für Schritt, was als Nächstes ansteht.</p>
              <button type="button" className="nxlg-cta secondary" onClick={() => p.setShowProjektakte(true)}>
                Projektakte anlegen <Arrow />
              </button>
              <p className="nxlg-microcopy">Nicht nötig für den Förder-Check — komplett optional.</p>
            </div>
          ) : (
            <form className="nxlg-upsell" onSubmit={p.onCreateProjektakte}>
              <h3>Passwort wählen</h3>
              <div className="nxlg-q">
                <label className="nxlg-q-label" htmlFor="pw">Passwort (min. 8 Zeichen)</label>
                <input
                  id="pw"
                  className="nxlg-q-input"
                  type="password"
                  autoComplete="new-password"
                  autoFocus
                  value={p.projektaktePassword}
                  onChange={(e) => p.setProjektaktePassword(e.target.value)}
                />
              </div>
              {p.error && <div className="nxlg-error">{p.error}</div>}
              <button type="submit" className="nxlg-cta" disabled={p.projektakteLoading}>
                {p.projektakteLoading ? "Akte wird angelegt…" : <>Projektakte öffnen <Arrow /></>}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
