"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeToggle } from "../HeatPumpClient";
import { CheckpointEbookTrigger } from "./CheckpointEbookTrigger";
import {
  buildLocalRequirements,
  buildOffer,
  calculateAssessment,
  type BuildingPayload,
  type BuildingType,
  type CustomerRole,
  type ElectricalReadiness,
  type FundingIncomeBand,
  type HeatSurface,
  type HeatingSystem,
  type HotWaterMode,
  type LeadPayload,
  type OutdoorSpace,
  type OwnerStatus,
  type PlannedHeatPumpType,
  type RenovationState
} from "@/lib/heatpump/scoring";
import type { DashboardPayload } from "@/lib/heatpump/project";

const leadDefaults: LeadPayload = {
  customerRole: "Eigenheim",
  name: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  ownerStatus: "Eigentümer",
  source: "Nexora Wärmepumpen-Förderrechner (Mobile)"
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

const stepTitles = [
  { eyebrow: "Profil", title: "Wer sind Sie?", sub: "Rolle und PLZ — damit wir Netz, Kommune und Förderpfad einordnen." },
  { eyebrow: "Gebäude", title: "Was wird beheizt?", sub: "Baujahr, Fläche und Sanierungsstand verändern Heizlast, Förderung und Prüfbedarf." },
  { eyebrow: "Heizung", title: "Was läuft heute im Keller?", sub: "Aktuelle Heizung, Verbrauch und Heizflächen — daraus rechnen wir live." },
  { eyebrow: "Technik", title: "Was kann später blockieren?", sub: "Aufstellort, Strom, Warmwasser und Pumpentyp — drei Werte und eine Empfehlung." },
  { eyebrow: "Speichern", title: "Ergebnis sichern", sub: "Nur E-Mail und Passwort. Name und Telefon können nach dem Login folgen." }
];

const arrowSvg = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export function MobileFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lead, setLead] = useState<LeadPayload>(leadDefaults);
  const [building, setBuilding] = useState<BuildingPayload>(buildingDefaults);
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"start" | "login">("start");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultExpanded, setResultExpanded] = useState(false);

  /* Hydrate from URL hand-off (?plz=…&building=…&heat=…) — runs once. */
  useEffect(() => {
    const plz = searchParams.get("plz");
    const heroBuilding = searchParams.get("building");
    const heroHeat = searchParams.get("heat");
    if (!plz && !heroBuilding && !heroHeat) return;
    setLead((l) => ({ ...l, postalCode: plz?.slice(0, 5) ?? l.postalCode }));
    setBuilding((b) => {
      const next = { ...b };
      if (heroBuilding === "efh-alt") { next.buildingType = "Einfamilienhaus"; next.renovation = "unsaniert"; }
      else if (heroBuilding === "efh-neu") { next.buildingType = "Einfamilienhaus"; next.renovation = "saniert"; }
      else if (heroBuilding === "mfh") { next.buildingType = "Mehrfamilienhaus"; }
      if (heroHeat === "oel-alt") next.heatingSystem = "Öl";
      else if (heroHeat === "gas-alt") next.heatingSystem = "Gas";
      else if (heroHeat === "oel-gas-neu") next.heatingSystem = "Gas";
      else if (heroHeat === "strom") next.heatingSystem = "Strom / Nachtspeicher";
      return next;
    });
    if (heroBuilding === "gewerbe") setLead((l) => ({ ...l, customerRole: "Gewerbe" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const assessment = useMemo(() => calculateAssessment(building, lead), [building, lead]);
  const local = useMemo(() => buildLocalRequirements(lead.postalCode, building.outdoorSpace), [lead.postalCode, building.outdoorSpace]);
  const offer = useMemo(() => buildOffer(building, assessment.level, lead), [building, assessment.level, lead]);

  const hasUsableEmail = /\S+@\S+\.\S+/.test(lead.email.trim());
  const meta = stepTitles[step];
  const completion = Math.round(((step + 1) / stepTitles.length) * 100);
  const nv = (v: number) => v > 0 ? String(v) : "";
  const pn = (v: string) => v.trim() === "" ? 0 : Number(v);

  const goToStep = (next: number) => {
    setStep(Math.max(0, Math.min(stepTitles.length - 1, next)));
    setMessage("");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!hasUsableEmail) { setStep(4); setMessage("Bitte gib eine gültige E-Mail für deine Projektakte ein."); return; }
    if (authMode === "start" && password.length < 8) { setStep(4); setMessage("Bitte wähle ein Passwort mit mindestens 8 Zeichen."); return; }

    setIsLoading(true); setMessage("");
    const endpoint = authMode === "start" ? "/api/heatpump/signup" : "/api/heatpump/login";
    const body = authMode === "start"
      ? { lead: { ...lead, email: lead.email.trim() }, building, password }
      : { email: lead.email.trim(), password };

    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const payload = (await response.json()) as { dashboard?: DashboardPayload; error?: string };
    setIsLoading(false);
    if (!response.ok || !payload.dashboard) { setMessage(payload.error || "Projektakte konnte nicht geöffnet werden."); return; }
    router.push("/waermepumpe/dashboard");
  };

  const fundingMin = offer.fundingEstimateMin?.toLocaleString("de-DE") ?? "0";
  const fundingMax = offer.fundingEstimateMax?.toLocaleString("de-DE") ?? "0";
  const levelLabel = assessment.level === "geeignet" ? "GEEIGNET" : assessment.level === "pruefung" ? "PRÜFEN" : "RISKANT";

  return (
    <main className="hp-mobile">
      {/* Sticky header — progress, back, theme */}
      <header className="hp-mobile-head">
        <button
          type="button"
          className="hp-mobile-back"
          onClick={() => goToStep(step - 1)}
          disabled={step === 0}
          aria-label="Zurück"
        >←</button>

        <div className="hp-mobile-progress">
          <div className="hp-mobile-progress-row">
            <span className="hp-mobile-step-num">{String(step + 1).padStart(2, "0")} / 05</span>
            <span className="hp-mobile-step-eyebrow">{meta.eyebrow.toUpperCase()}</span>
          </div>
          <div className="hp-mobile-progress-bar">
            <span style={{ width: `${completion}%` }} />
          </div>
        </div>

        <div className="hp-mobile-head-aux">
          <ThemeToggle />
        </div>
      </header>

      {/* Live result chip — collapsed, tap to expand */}
      <button
        type="button"
        className={`hp-mobile-result ${resultExpanded ? "is-open" : ""}`}
        onClick={() => setResultExpanded((v) => !v)}
        aria-expanded={resultExpanded}
      >
        <span className="hp-mobile-result-row">
          <span className="hp-mobile-result-label">Förder-Korridor</span>
          <strong className="hp-mobile-result-value">{fundingMin}–{fundingMax}&nbsp;€</strong>
          <span className={`hp-mobile-result-pill ${assessment.level}`}>{levelLabel}</span>
          <span className="hp-mobile-result-chev">{resultExpanded ? "▴" : "▾"}</span>
        </span>
        {resultExpanded && (
          <div className="hp-mobile-result-detail">
            <div className="hp-mobile-result-detail-row">
              <span>Investitionsspanne</span>
              <strong>{offer.priceRange.replace(" EUR", " €")}</strong>
            </div>
            <div className="hp-mobile-result-detail-row">
              <span>Eignung</span>
              <strong>{assessment.score}% · {assessment.confidence}% Konfidenz</strong>
            </div>
            <div className="hp-mobile-result-detail-row">
              <span>Netz · {local.gridOperator}</span>
              <strong>{local.soundRisk}</strong>
            </div>
            <div className="hp-mobile-result-headline">{assessment.headline}</div>
          </div>
        )}
      </button>

      {/* Main question card */}
      <section className="hp-mobile-card">
        <div className="hp-mobile-card-head">
          <h1>{meta.title}</h1>
          <p>{meta.sub}</p>
        </div>

        <div className="hp-mobile-card-body">
          {step === 0 && (
            <>
              <Group label="Ich plane als">
                {(["Eigenheim", "Vermieter / MFH", "WEG / Hausverwaltung", "Gewerbe"] as CustomerRole[]).map((opt) => (
                  <Tile key={opt} active={lead.customerRole === opt} onClick={() => setLead({ ...lead, customerRole: opt })}
                    label={opt}
                    sub={opt === "Eigenheim" ? "EFH · privat" : opt === "Vermieter / MFH" ? "Wohneinheiten vermietet" : opt === "WEG / Hausverwaltung" ? "Beschluss · Vollmacht" : "Betrieb · Standort"} />
                ))}
              </Group>

              <Group label="Entscheidungsstatus">
                {(["Eigentümer", "WEG / Mehrfamilienhaus", "Mieter / unklar"] as OwnerStatus[]).map((opt) => (
                  <Tile key={opt} active={lead.ownerStatus === opt} onClick={() => setLead({ ...lead, ownerStatus: opt })}
                    label={opt}
                    sub={opt === "Eigentümer" ? "alleine entscheidungsfähig" : opt === "WEG / Mehrfamilienhaus" ? "Beschluss benötigt" : "Vollmacht offen"} />
                ))}
              </Group>

              <Group label="Wo wohnen Sie?" cols={2}>
                <Field label="PLZ">
                  <input inputMode="numeric" placeholder="04109" maxLength={5} value={lead.postalCode}
                    onChange={(e) => setLead({ ...lead, postalCode: e.target.value.replace(/\D/g, "").slice(0, 5) })} />
                </Field>
                <Field label="Stadt (optional)">
                  <input placeholder="optional" value={lead.city} onChange={(e) => setLead({ ...lead, city: e.target.value })} />
                </Field>
              </Group>

              <Group label="Haushaltseinkommen für Bonus">
                {([
                  { v: "nicht-angeben", l: "Möchte ich noch nicht sagen", s: "kein Bonus angerechnet" },
                  { v: "unter-40000", l: "unter 40.000 €", s: "Einkommens-Bonus möglich" },
                  { v: "40000-80000", l: "40.000 – 80.000 €", s: "Standardförderung" },
                  { v: "ueber-80000", l: "über 80.000 €", s: "Standardförderung" }
                ] as { v: FundingIncomeBand; l: string; s: string }[]).map((opt) => (
                  <Tile key={opt.v} active={building.incomeBand === opt.v} onClick={() => setBuilding({ ...building, incomeBand: opt.v })}
                    label={opt.l} sub={opt.s} />
                ))}
              </Group>
            </>
          )}

          {step === 1 && (
            <>
              <Group label="Gebäudeart">
                {(["Einfamilienhaus", "Zweifamilienhaus", "Mehrfamilienhaus"] as BuildingType[]).map((opt) => (
                  <Tile key={opt} active={building.buildingType === opt} onClick={() => setBuilding({ ...building, buildingType: opt })}
                    label={opt}
                    sub={opt === "Einfamilienhaus" ? "1 Wohneinheit" : opt === "Zweifamilienhaus" ? "2 Einheiten" : "3+ Einheiten · WEG"} />
                ))}
              </Group>

              <Group label="Eckdaten" cols={2}>
                <Field label="Baujahr">
                  <input type="number" inputMode="numeric" placeholder="1998" value={nv(building.yearBuilt)}
                    onChange={(e) => setBuilding({ ...building, yearBuilt: pn(e.target.value) })} />
                </Field>
                <Field label="Wohneinheiten">
                  <input type="number" inputMode="numeric" placeholder="1" value={nv(building.units)}
                    onChange={(e) => setBuilding({ ...building, units: pn(e.target.value) || 1 })} />
                </Field>
              </Group>

              <Group label="Wohn-/Nutzfläche">
                <Field label="m²" inline>
                  <input type="number" inputMode="numeric" placeholder="155" value={nv(building.livingArea)}
                    onChange={(e) => setBuilding({ ...building, livingArea: pn(e.target.value) })} />
                </Field>
              </Group>

              <Group label="Sanierungsstand">
                {([
                  { v: "unklar", l: "Unklar", s: "wird im Termin geklärt" },
                  { v: "unsaniert", l: "Unsaniert", s: "Vorlauf vermutlich hoch" },
                  { v: "teilsaniert", l: "Teilsaniert", s: "Fenster oder Dach erneuert" },
                  { v: "saniert", l: "Saniert", s: "WP-tauglich wahrscheinlich" }
                ] as { v: RenovationState; l: string; s: string }[]).map((opt) => (
                  <Tile key={opt.v} active={building.renovation === opt.v} onClick={() => setBuilding({ ...building, renovation: opt.v })}
                    label={opt.l} sub={opt.s} />
                ))}
              </Group>
            </>
          )}

          {step === 2 && (
            <>
              <Group label="Aktuelle Heizung">
                {([
                  { v: "unbekannt", l: "Unbekannt", s: "wir prüfen vor Ort" },
                  { v: "Gas", l: "Gas", s: "Klimageschwindigkeits-Bonus möglich" },
                  { v: "Öl", l: "Öl", s: "Klimageschwindigkeits-Bonus möglich" },
                  { v: "Fernwärme", l: "Fernwärme", s: "Förderlogik weicht ab" },
                  { v: "Strom / Nachtspeicher", l: "Strom / Nachtspeicher", s: "Elektro-Prüfpfad eigen" }
                ] as { v: HeatingSystem; l: string; s: string }[]).map((opt) => (
                  <Tile key={opt.v} active={building.heatingSystem === opt.v} onClick={() => setBuilding({ ...building, heatingSystem: opt.v })}
                    label={opt.l} sub={opt.s} />
                ))}
              </Group>

              <Group label="Verbrauch + Vorlauf" cols={2}>
                <Field label="kWh / Jahr">
                  <input type="number" inputMode="numeric" placeholder="22.000" value={nv(building.annualConsumption)}
                    onChange={(e) => setBuilding({ ...building, annualConsumption: pn(e.target.value) })} />
                </Field>
                <Field label="Vorlauf °C">
                  <input type="number" inputMode="numeric" placeholder="48" value={nv(building.flowTemperature)}
                    onChange={(e) => setBuilding({ ...building, flowTemperature: pn(e.target.value) })} />
                </Field>
              </Group>

              <Group label="Heizflächen">
                {([
                  { v: "unklar", l: "Unklar", s: "wird vor Ort geklärt" },
                  { v: "Fußbodenheizung", l: "Fußbodenheizung", s: "ideal für niedrige Vorlauftemp." },
                  { v: "große Heizkörper", l: "Große Heizkörper", s: "WP-tauglich nach Prüfung" },
                  { v: "kleine Heizkörper", l: "Kleine Heizkörper", s: "Tausch oft nötig" }
                ] as { v: HeatSurface; l: string; s: string }[]).map((opt) => (
                  <Tile key={opt.v} active={building.heatSurface === opt.v} onClick={() => setBuilding({ ...building, heatSurface: opt.v })}
                    label={opt.l} sub={opt.s} />
                ))}
              </Group>
            </>
          )}

          {step === 3 && (
            <>
              <Group label="Aufstellort Außengerät">
                {([
                  { v: "freier Aufstellort", l: "Frei aufstellbar", s: "≥ 3 m Abstand möglich" },
                  { v: "enger Reihenhausbereich", l: "Enger Reihenhaus-Bereich", s: "Schall-Prüfung nötig" },
                  { v: "noch unklar", l: "Noch unklar", s: "wird vor Ort geprüft" }
                ] as { v: OutdoorSpace; l: string; s: string }[]).map((opt) => (
                  <Tile key={opt.v} active={building.outdoorSpace === opt.v} onClick={() => setBuilding({ ...building, outdoorSpace: opt.v })}
                    label={opt.l} sub={opt.s} />
                ))}
              </Group>

              <Group label="Zählerschrank / Elektro">
                {([
                  { v: "modern", l: "Modern", s: "kürzlich erneuert" },
                  { v: "prüfen", l: "Alt / prüfen", s: "TAB / §14a relevant" },
                  { v: "unklar", l: "Unklar", s: "wird vor Ort geprüft" }
                ] as { v: ElectricalReadiness; l: string; s: string }[]).map((opt) => (
                  <Tile key={opt.v} active={building.electricalReadiness === opt.v} onClick={() => setBuilding({ ...building, electricalReadiness: opt.v })}
                    label={opt.l} sub={opt.s} />
                ))}
              </Group>

              <Group label="Warmwasser">
                {([
                  { v: "unklar", l: "Unklar", s: "wird vor Ort geklärt" },
                  { v: "zentral über Heizung", l: "Zentral über Heizung", s: "Speicher meist nötig" },
                  { v: "separat / Durchlauferhitzer", l: "Separat", s: "Durchlauferhitzer / Boiler" }
                ] as { v: HotWaterMode; l: string; s: string }[]).map((opt) => (
                  <Tile key={opt.v} active={building.hotWaterMode === opt.v} onClick={() => setBuilding({ ...building, hotWaterMode: opt.v })}
                    label={opt.l} sub={opt.s} />
                ))}
              </Group>

              <Group label="Geplante Wärmepumpe">
                {([
                  { v: "noch offen", l: "Noch offen", s: "Empfehlung im Termin" },
                  { v: "Luft-Wasser", l: "Luft-Wasser", s: "Standard im Bestand" },
                  { v: "Sole-Wasser", l: "Sole-Wasser", s: "Erdsonde · höhere JAZ" },
                  { v: "Wasser-Wasser", l: "Wasser-Wasser", s: "Brunnen · sehr selten" },
                  { v: "Brauchwasser", l: "Brauchwasser-WP", s: "nur Warmwasser" }
                ] as { v: PlannedHeatPumpType; l: string; s: string }[]).map((opt) => (
                  <Tile key={opt.v} active={building.plannedHeatPumpType === opt.v} onClick={() => setBuilding({ ...building, plannedHeatPumpType: opt.v })}
                    label={opt.l} sub={opt.s} />
                ))}
              </Group>

              <button type="button" onClick={() => setBuilding({ ...building, hasPv: !building.hasPv })}
                className={`hp-mobile-toggle ${building.hasPv ? "is-active" : ""}`}>
                ⚡ PV / Speicher / Wallbox vorhanden
              </button>
            </>
          )}

          {step === 4 && (
            <>
              <div className="hp-mobile-tabs">
                <button type="button" onClick={() => setAuthMode("start")} className={authMode === "start" ? "is-active" : ""}>Ergebnis speichern</button>
                <button type="button" onClick={() => setAuthMode("login")} className={authMode === "login" ? "is-active" : ""}>Einloggen</button>
              </div>

              <Group label="E-Mail">
                <Field label="" inline>
                  <input type="email" inputMode="email" autoComplete="email" placeholder="name@beispiel.de"
                    value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
                </Field>
              </Group>

              <Group label="Passwort">
                <Field label="" inline>
                  <input type="password" autoComplete={authMode === "start" ? "new-password" : "current-password"}
                    placeholder={authMode === "start" ? "Mindestens 8 Zeichen" : "Ihr Passwort"}
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                </Field>
              </Group>

              {authMode === "start" && (
                <>
                  <Group label="Optional · für schnelleren Kontakt" cols={2}>
                    <Field label="Name">
                      <input value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
                    </Field>
                    <Field label="Telefon">
                      <input inputMode="tel" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
                    </Field>
                  </Group>

                  <div className="hp-mobile-help">
                    <strong>Erst speichern, dann führen.</strong>
                    Nach dem Klick öffnen wir Ihre Projektakte. Unterlagen reichen Sie nur dann nach, wenn sie wirklich gebraucht werden.
                  </div>
                </>
              )}
            </>
          )}

          {message && <div className="hp-mobile-error">{message}</div>}
        </div>
      </section>

      <p className="hp-mobile-legal">🔒 KEINE VERBINDLICHE BERATUNG · ECHTE PLANUNG ERST NACH TERMIN</p>

      {/* Sticky footer — primary CTA */}
      <footer className="hp-mobile-foot">
        {step < 4 ? (
          <button type="button" className="hp-mobile-cta" onClick={() => goToStep(step + 1)}>
            Weiter {arrowSvg}
          </button>
        ) : (
          <button type="button" className="hp-mobile-cta" onClick={submit} disabled={isLoading}>
            {isLoading ? "Öffne Projektakte…" : authMode === "start" ? "Projektakte öffnen" : "Einloggen"} {arrowSvg}
          </button>
        )}
        <Link href="/waermepumpe" className="hp-mobile-foot-link">← zurück zur Übersicht</Link>
      </footer>

      <CheckpointEbookTrigger step={step} building={building} lead={lead} />
    </main>
  );
}

/* ─── Subcomponents ─── */

function Group({ label, cols = 1, children }: { label: string; cols?: 1 | 2; children: React.ReactNode }) {
  return (
    <div className="hp-mobile-group">
      <div className="hp-mobile-group-label">{label}</div>
      <div className={`hp-mobile-group-body cols-${cols}`}>{children}</div>
    </div>
  );
}

function Tile({ active, onClick, label, sub }: { active: boolean; onClick: () => void; label: string; sub: string }) {
  return (
    <button type="button" className={`hp-mobile-tile ${active ? "is-active" : ""}`} onClick={onClick}>
      <span className="hp-mobile-tile-label">{label}</span>
      <span className="hp-mobile-tile-sub">{sub}</span>
    </button>
  );
}

function Field({ label, children, inline }: { label: string; children: React.ReactNode; inline?: boolean }) {
  return (
    <label className={`hp-mobile-field ${inline ? "is-inline" : ""}`}>
      {label && <span className="hp-mobile-field-label">{label}</span>}
      {children}
    </label>
  );
}
