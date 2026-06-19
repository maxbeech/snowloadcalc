# SnowLoadCalc

Free **ASCE 7-22 roof snow load calculator**. Enter your ground snow load, roof
slope, exposure and thermal condition to get the flat, sloped, minimum and
governing design roof snow load in psf, with every factor shown.

Live: https://snowloadcalc.vercel.app

## What it does

- **Roof snow load** using `Pf = 0.7·Ce·Ct·Is·Pg` (Eq. 7.3-1), sloped load `Ps = Cs·Pf`,
  the §7.3.4 minimum load and the §7.10 rain-on-snow surcharge.
- **Unbalanced load (§7.6.1)** for hip and gable roofs in the 2.38° to 30.2° band:
  windward `0.3·Ps`, leeward `Ps` plus a ridge drift surcharge `hd·γ/√S` (W > 20 ft) or the
  simple `Is·Pg` uniform case (W ≤ 20 ft).
- **Live roof-section diagram** that draws the roof at its real slope and the snow
  blanket sized to the load, with a toggle to the §7.6.1 leeward-drift profile.
- **Roof shape and pitch input**: flat, gable, hip or monoslope; enter slope in degrees
  or pick a pitch (x:12).
- **Per-roof-type calculators** for flat, pitched/gable, metal building, carport,
  shed/monoslope, gambrel, greenhouse, and a ground-to-roof converter.
- **Ground snow load by state**, grouped by region, with planning ranges for all 50
  states and DC and mountainous case-study states flagged. The governing value always
  comes from the ASCE 7 Hazard Tool or your AHJ; we never assert false per-ZIP precision.
- **Snow drift calculator** for the ASCE 7-22 §7.7 leeward and windward drift at roof steps.
- **Print or Save-as-PDF** of any result; shareable result URLs; breadcrumbs and JSON-LD.
- **Methodology** page citing every equation, factor and table (single source of truth).

## Design

The interface is a single, intentional "Glaciometric" system: an arctic-ink and
glacier-frost palette with a warm amber reserved for load and drift meaning, a
Space Grotesk / Inter / JetBrains Mono type stack, a faint blueprint texture, and a
roof-section drawing as the recurring motif. Tokens live in `app/globals.css`; the
shared primitives in `components/ui.tsx` and `components/Brand.tsx` keep it coherent.

## Stack

Next.js 16 (App Router) + React 19 + Tailwind CSS 4. Pure client-side engine
(`lib/snow.ts`, `lib/drift.ts`, `lib/unbalanced.ts`, `lib/diagram.ts`) with no
database for the free tool. The Pro report tier uses an env-gated Stripe Checkout
that degrades gracefully when keys are absent.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # engine + URL + drift + unbalanced + diagram + copy-style (100+ checks)
npm run build
```

`npm test` includes a copy-style guard that fails the build if an em dash appears
anywhere in `app`, `components` or `lib`, keeping the writing free of that tell.

## Accuracy and disclaimer

The engine is validated against hand-computed ASCE 7-22 values (see `test/`).
SnowLoadCalc computes the **balanced** load plus minimum and rain-on-snow, the
**§7.6.1 unbalanced** case for hip and gable roofs, and a separate §7.7 drift surcharge.
It does not yet resolve sliding snow (§7.9), partial loading (§7.5) or the
monoslope/sawtooth unbalanced cases (§7.6.2 and §7.6.3). Those must be checked by a
licensed engineer for a permit. Always confirm the governing ground snow load for
your exact site.
