"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { EbookModal } from "../EbookModal";
import { ebookCases, type EbookKey } from "@/lib/ebooks/cases";
import type { BuildingPayload, LeadPayload } from "@/lib/heatpump/scoring";

const TRIGGER_AFTER_STEPS = 3;
const SESSION_FLAG = "nx-ebook-checkpoint-fired";
const TRIGGER_ID = "checkpoint";

interface CheckpointEbookTriggerProps {
  /** Current 0-indexed step in the calculator. Trigger fires when step
   *  transitions from ≥TRIGGER_AFTER_STEPS for the first time. */
  step: number;
  building: BuildingPayload;
  lead: LeadPayload;
}

const safe = (fn: () => void) => { try { fn(); } catch { /* posthog not ready */ } };

/**
 * Picks the matching e-book based on the answers the visitor has given so far.
 * Routing rules ranked by signal strength (first match wins):
 *   1. enger Reihenhausbereich           → laerm-nachbar-wp-2026   (loss-aversion)
 *   2. kleine Heizkörper                 → heizkoerper-luege-2026  (authority myth-bust)
 *   3. yearBuilt < 1995 + unsaniert      → altbau-wp-mythos-2026   (self-identification)
 *   4. fallback                           → foerderungs-maximizer-2026 (specificity)
 */
function selectCaseFromAnswers(b: BuildingPayload): EbookKey {
  if (b.outdoorSpace === "enger Reihenhausbereich") return "laerm-nachbar-wp-2026";
  if (b.heatSurface === "kleine Heizkörper") return "heizkoerper-luege-2026";
  if (b.yearBuilt && b.yearBuilt > 0 && b.yearBuilt < 1995 && b.renovation === "unsaniert") {
    return "altbau-wp-mythos-2026";
  }
  return "foerderungs-maximizer-2026";
}

export function CheckpointEbookTrigger({ step, building, lead }: CheckpointEbookTriggerProps) {
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<EbookKey>("foerderungs-maximizer-2026");
  const firedRef = useRef(false);

  /* Single-fire on the first step ≥ TRIGGER_AFTER_STEPS. SessionStorage gates
     across reloads within the same browser tab; we don't want to nag visitors
     who've already seen the prompt. The form-submit success state is its own
     localStorage flag (nx-ebook-popup-shown) checked at modal level. */
  useEffect(() => {
    if (firedRef.current) return;
    if (step < TRIGGER_AFTER_STEPS) return;
    let fired = false;
    try { fired = window.sessionStorage.getItem(SESSION_FLAG) === "1"; } catch {}
    if (fired) { firedRef.current = true; return; }

    firedRef.current = true;
    try { window.sessionStorage.setItem(SESSION_FLAG, "1"); } catch {}

    const key = selectCaseFromAnswers(building);
    setActiveKey(key);
    setOpen(true);
    safe(() => posthog.capture("ebook_popup_auto_shown", {
      ebook: key,
      trigger: `check_step_${step + 1}_of_5`,
      source: TRIGGER_ID,
      derived_case_from: {
        outdoorSpace: building.outdoorSpace,
        heatSurface: building.heatSurface,
        yearBuilt: building.yearBuilt,
        renovation: building.renovation
      }
    }));
  }, [step, building]);

  const c = ebookCases[activeKey];
  const prefillEmail = lead.email && lead.email.includes("@") ? lead.email : undefined;

  /* Direction A reframe: this isn't a cold-popup, it's a checkpoint. The visitor
     has given 3+ answers; we offer to save the result + send the matching PDF.
     Headline + lede match the case derived from their answers. */
  const checkpointHeadline = `Zwischenstand sichern — <em>Ihr Fall</em> als 10-Seiten-PDF.`;
  const checkpointLede = `${c.lede} Wir mailen es Ihnen jetzt; den Rechner machen Sie danach in Ruhe weiter.`;

  return (
    <EbookModal
      open={open}
      onClose={() => setOpen(false)}
      ebookKey={activeKey}
      ebookTitle={c.title}
      ebookShortTitle={c.shortTitle}
      source={TRIGGER_ID}
      initialEmail={prefillEmail}
      hookHeadlineHtml={checkpointHeadline}
      hookLede={checkpointLede}
    />
  );
}
