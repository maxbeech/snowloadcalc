"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  computeSnow, DEFAULT_SNOW, degToPitch, pitchToDeg, type RiskCategory, type RoofExposure,
  type RoofShape, type SnowInputs, type Surface, type Terrain, type Thermal,
} from "@/lib/snow";
import { decodeInputs, encodeInputs } from "@/lib/snow-url";
import CalcResults from "./CalcResults";

const selectCls =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus:outline-none";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

// Number input that lets you clear and retype (keeps a raw string while editing,
// clamps to [min,max] only on blur) — fixes the papercut where the field snaps
// back to the minimum the instant you delete a digit.
function NumberField({ value, min, max, step = 1, onChange, ariaLabel }:
  { value: number; min: number; max: number; step?: number; onChange: (n: number) => void; ariaLabel?: string }) {
  const [raw, setRaw] = useState(String(value));
  // Resync the editable string when `value` changes externally (URL load, presets)
  // using the React-recommended "adjust state during render" pattern — no effect.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) { setLastValue(value); setRaw(String(value)); }
  return (
    <input type="number" inputMode="decimal" min={min} max={max} step={step} className={selectCls} value={raw}
      aria-label={ariaLabel}
      onChange={(e) => {
        setRaw(e.target.value);
        if (e.target.value === "") return;
        const n = Number(e.target.value);
        if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
      }}
      onBlur={() => {
        const n = raw === "" ? min : Math.min(max, Math.max(min, Number(raw) || min));
        setRaw(String(n)); onChange(n);
      }} />
  );
}

const PITCHES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]; // rise per 12 run

export default function Calculator({ seed }: { seed?: Partial<SnowInputs> }) {
  const [inp, setInp] = useState<SnowInputs>(() => ({ ...DEFAULT_SNOW, ...seed }));
  const hydrated = useRef(false);

  useEffect(() => {
    // Hydrate inputs from the URL on mount so shared/bookmarked links restore the
    // form. window is client-only, so this read must live in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInp(decodeInputs(window.location.search, seed));
    hydrated.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reflect inputs back into the URL (shareable). Skipped until hydration so we
    // never clobber incoming params on first paint.
    if (!hydrated.current) return;
    window.history.replaceState(null, "", `${window.location.pathname}?${encodeInputs(inp)}`);
  }, [inp]);

  const r = useMemo(() => computeSnow(inp), [inp]);
  const set = <K extends keyof SnowInputs>(k: K, v: SnowInputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  return (
    <div>
      {/* Sticky live summary on mobile — keeps the answer visible while scrolling the form */}
      <div role="status" aria-live="polite" aria-atomic="true"
        className="sticky top-0 z-20 mb-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white/95 px-4 py-2 shadow-sm backdrop-blur md:hidden print:hidden">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Design snow load</span>
        <span className="text-lg font-bold text-sky-700">{r.design} <span className="text-xs font-medium text-slate-400">psf</span></span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Your roof</h2>
          <div className="mt-3 space-y-3">
            <Field label="Ground snow load, Pg (psf)" hint="From the ASCE 7 Hazard Tool or your building department. See the per-state pages for a range.">
              <NumberField value={inp.pg} min={0} max={400} step={1} onChange={(n) => set("pg", n)} ariaLabel="Ground snow load in psf" />
            </Field>

            <Field label="Roof shape" hint="Gable & hip roofs need the §7.6.1 unbalanced (leeward-drift) check.">
              <select className={selectCls} value={inp.shape} onChange={(e) => set("shape", e.target.value as RoofShape)}>
                <option value="flat">Flat / low-slope</option>
                <option value="gable">Gable</option>
                <option value="hip">Hip</option>
                <option value="monoslope">Monoslope / shed</option>
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Roof slope (degrees)" hint={inp.slopeDeg > 0 ? `≈ ${degToPitch(inp.slopeDeg)} pitch` : "0 = flat"}>
                <NumberField value={inp.slopeDeg} min={0} max={70} step={0.5} onChange={(n) => set("slopeDeg", n)} ariaLabel="Roof slope in degrees" />
              </Field>
              <Field label="…or pick a pitch" hint="Sets the slope from rise-in-12.">
                <select className={selectCls} aria-label="Roof pitch in twelve"
                  value={PITCHES.includes(Math.round(Math.tan((inp.slopeDeg * Math.PI) / 180) * 12)) ? Math.round(Math.tan((inp.slopeDeg * Math.PI) / 180) * 12) : ""}
                  onChange={(e) => { if (e.target.value !== "") set("slopeDeg", pitchToDeg(Number(e.target.value))); }}>
                  <option value="">Custom</option>
                  {PITCHES.map((p) => <option key={p} value={p}>{p === 0 ? "Flat (0:12)" : `${p}:12`}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Thermal condition (Ct)" hint="How warm is the space under the roof?">
              <select className={selectCls} value={inp.thermal} onChange={(e) => set("thermal", e.target.value as Thermal)}>
                <option value="heated">Heated building — Ct 1.0</option>
                <option value="slightlyHeated">Kept just above freezing / cold ventilated roof — Ct 1.1</option>
                <option value="unheated">Unheated / open structure — Ct 1.2</option>
                <option value="freezer">Continuously below freezing (freezer) — Ct 1.3</option>
                <option value="greenhouse">Continuously heated greenhouse — Ct 0.85</option>
              </select>
            </Field>

            <Field label="Roof surface (Cs)" hint="Smooth metal, membrane and glass are 'slippery' — they shed sooner.">
              <select className={selectCls} value={inp.surface} onChange={(e) => set("surface", e.target.value as Surface)}>
                <option value="nonslippery">Shingles / textured — not slippery</option>
                <option value="slippery">Metal / membrane / glass — slippery</option>
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Terrain" hint="Surface roughness around the site.">
                <select className={selectCls} value={inp.terrain} onChange={(e) => set("terrain", e.target.value as Terrain)}>
                  <option value="B">B — suburban / wooded</option>
                  <option value="C">C — open terrain</option>
                  <option value="D">D — flat, unobstructed (coast)</option>
                  <option value="aboveTreeline">Above treeline / windswept</option>
                </select>
              </Field>
              <Field label="Roof exposure (Ce)">
                <select className={selectCls} value={inp.roofExposure} onChange={(e) => set("roofExposure", e.target.value as RoofExposure)}>
                  <option value="fully">Fully exposed</option>
                  <option value="partial">Partially exposed</option>
                  <option value="sheltered">Sheltered</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Risk category (Is)" hint="Most buildings are II.">
                <select className={selectCls} value={inp.risk} onChange={(e) => set("risk", e.target.value as RiskCategory)}>
                  <option value="I">I — low hazard (Is 0.8)</option>
                  <option value="II">II — normal (Is 1.0)</option>
                  <option value="III">III — substantial (Is 1.1)</option>
                  <option value="IV">IV — essential (Is 1.2)</option>
                </select>
              </Field>
              <Field label="Eave-to-ridge width, W (ft)" hint="Rain-on-snow + unbalanced drift.">
                <NumberField value={inp.width} min={5} max={500} step={1} onChange={(n) => set("width", n)} ariaLabel="Eave to ridge width in feet" />
              </Field>
            </div>

            <Field label="Roof plan area (sq ft, optional)" hint="To estimate the total snow weight.">
              <NumberField value={inp.area ?? 0} min={0} max={1000000} step={10} onChange={(n) => set("area", n)} ariaLabel="Roof plan area in square feet" />
            </Field>
          </div>
        </div>

        <CalcResults inp={inp} r={r} />
      </div>
    </div>
  );
}
