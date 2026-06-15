# SnowLoadCalc

Free **ASCE 7-22 roof snow load calculator**. Enter your ground snow load, roof
slope, exposure and thermal condition to get the flat, sloped, minimum and
governing design roof snow load in psf — with every factor shown.

Live: https://snowloadcalc.vercel.app

## What it does

- **Roof snow load** — `Pf = 0.7·Ce·Ct·Is·Pg` (Eq. 7.3-1), sloped load `Ps = Cs·Pf`,
  the §7.3.4 minimum load and the §7.10 rain-on-snow surcharge.
- **Unbalanced load (§7.6.1)** — for hip & gable roofs in the 2.38°–30.2° band:
  windward `0.3·Ps`, leeward `Ps` + ridge drift surcharge `hd·γ/√S` (W>20 ft) or the
  simple `Is·Pg` uniform case (W≤20 ft).
- **Roof shape + pitch input** — flat / gable / hip / monoslope; enter slope in degrees
  or pick a pitch (x:12).
- **Per-roof-type calculators** — flat, pitched/gable, metal building, carport,
  shed/monoslope, gambrel, greenhouse, and a ground→roof converter.
- **Ground snow load by state** — planning ranges for all 50 states + DC, with
  mountainous case-study states flagged. The governing value always comes from the
  ASCE 7 Hazard Tool or your AHJ — we never assert false per-ZIP precision.
- **Snow drift calculator** — ASCE 7-22 §7.7 leeward/windward drift at roof steps.
- **Print / Save-as-PDF** of any result; shareable result URLs; breadcrumbs + JSON-LD.
- **Methodology** page citing every equation, factor and table (single source of truth).

## Stack

Next.js 16 (App Router) + React 19 + Tailwind CSS 4. Pure client-side engine
(`lib/snow.ts`, `lib/drift.ts`) — no database needed for the free tool. The Pro
report tier uses an env-gated Stripe Checkout that degrades gracefully when keys
are absent.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # engine + URL + drift + unbalanced unit tests (82 checks)
npm run build
```

## Accuracy & disclaimer

The engine is validated against hand-computed ASCE 7-22 values (see `test/`).
SnowLoadCalc computes the **balanced** load plus minimum and rain-on-snow, the
**§7.6.1 unbalanced** case for hip/gable roofs, and a separate §7.7 drift surcharge.
It does not yet resolve sliding-snow (§7.9), partial loading (§7.5) or the
monoslope/sawtooth unbalanced cases (§7.6.2–7.6.3) — these must be checked by a
licensed engineer for a permit. Always confirm the governing ground snow load for
your exact site.
