// Programmatic per-roof-type calculator pages. Each is a keyword-targeted
// landing page that renders the SAME ASCE 7-22 engine with tailored defaults
// and copy, so the tool is relevant to the exact search ("metal building snow
// load", "flat roof snow load", "carport snow load"…). One source of truth.
import type { FaqItem } from "./faq";
import type { RoofShape, Surface, Thermal } from "./snow";

export interface RoofType {
  slug: string;
  name: string;
  h1: string;
  keyword: string;
  volume: string; // live Google Ads US monthly volume, for transparency
  meta: string;
  intro: string;
  // Defaults that make the calculator land on a relevant starting point.
  defaults: { slopeDeg?: number; thermal?: Thermal; surface?: Surface; shape?: RoofShape };
  focus: string; // one-line "what's different about this roof type"
  notes: string[];
  faqs: FaqItem[];
}

export const ROOF_TYPES: RoofType[] = [
  {
    slug: "flat-roof-snow-load",
    name: "Flat roof",
    h1: "Flat Roof Snow Load Calculator (ASCE 7)",
    keyword: "flat roof snow load",
    volume: "260/mo",
    meta: "Free flat roof snow load calculator. Get the ASCE 7-22 flat-roof load Pf, the minimum load and the rain-on-snow surcharge for a low-slope roof.",
    intro: "Flat and low-slope roofs carry the full flat-roof load Pf with no slope reduction, and they are the case where the §7.3.4 minimum load and the §7.10 rain-on-snow surcharge most often govern.",
    defaults: { slopeDeg: 0, thermal: "heated", surface: "nonslippery", shape: "flat" },
    focus: "Cs = 1.0 (no slope shedding); watch the minimum load and rain-on-snow surcharge.",
    notes: [
      "On a flat roof the sloped load equals the flat-roof load Pf, so exposure, thermal and importance factors drive the answer.",
      "Low-slope roofs in mild-winter areas (Pg ≤ 20 psf) pick up a 5 psf rain-on-snow surcharge — rain soaking into snow that can't drain.",
    ],
    faqs: [
      { q: "How much snow load can a flat roof hold?", a: "It depends on the structure, but the design value is what matters: enter your ground snow load above to get the ASCE 7 flat-roof load Pf in psf, then compare it to the roof's rated capacity on the structural drawings." },
      { q: "Why does my flat roof need a rain-on-snow surcharge?", a: "Where ground snow is light (Pg ≤ 20 psf) and the roof is nearly flat, rain can fall onto snow that has no way to drain, adding weight. ASCE 7 §7.10 adds 5 psf to the balanced load to cover it." },
    ],
  },
  {
    slug: "pitched-roof-snow-load",
    name: "Pitched / gable roof",
    h1: "Pitched Roof Snow Load Calculator",
    keyword: "snow load on pitched roof",
    volume: "210/mo",
    meta: "Free pitched roof snow load calculator. Apply the ASCE 7-22 slope factor Cs to get the sloped balanced load on a gable or hip roof, and see when to check unbalanced snow.",
    intro: "Pitched roofs shed snow, so the slope factor Cs reduces the load as the pitch steepens. Steep, slippery roofs shed the most — but gable roofs must also be checked for the unbalanced (drifted-leeward) load case.",
    defaults: { slopeDeg: 27, thermal: "heated", surface: "nonslippery", shape: "gable" },
    focus: "Slope factor Cs reduces the load; gable roofs also need the unbalanced case (§7.6.1).",
    notes: [
      "A common 6:12 pitch is about 26.6°. On a warm, non-slippery roof the slope factor only starts reducing the load above 30°.",
      "Slippery surfaces (metal, membrane) shed sooner — their slope reduction starts at just 5° on a warm roof.",
    ],
    faqs: [
      { q: "Does a steeper roof have less snow load?", a: "Yes — above the breakpoint slope the ASCE 7 slope factor Cs reduces the balanced load linearly to zero at 70°. But a steeper gable roof also drifts more snow to the leeward side, so the unbalanced case can govern." },
      { q: "What slope sheds snow best?", a: "Steeper is better, and a slippery surface helps. A metal roof above ~30–40° sheds most snow, but always design for the snow that can still accumulate, especially in the unbalanced and sliding cases." },
    ],
  },
  {
    slug: "metal-building-snow-load",
    name: "Metal building",
    h1: "Metal Building & Metal Roof Snow Load Calculator",
    keyword: "metal building snow load",
    volume: "210/mo",
    meta: "Free metal building snow load calculator. Standing-seam and metal roofs are slippery surfaces in ASCE 7, so the slope factor sheds snow sooner — see your design load.",
    intro: "Steel buildings and standing-seam metal roofs are 'unobstructed slippery surfaces' in ASCE 7, so the slope factor Cs reduces the load at a lower slope than shingles. Unheated metal buildings also use a higher thermal factor Ct.",
    defaults: { slopeDeg: 14, thermal: "unheated", surface: "slippery", shape: "gable" },
    focus: "Slippery surface → Cs sheds sooner; unheated buildings use Ct = 1.2.",
    notes: [
      "A slippery metal roof on a warm building starts shedding (Cs < 1) at just 5°; an unheated metal building (Ct = 1.2) starts at 15°.",
      "Watch sliding snow off metal roofs onto lower roofs, walks and equipment — it can dump a large load suddenly.",
    ],
    faqs: [
      { q: "Do metal roofs have lower snow loads?", a: "The design ground snow load is the same, but a metal roof is a slippery surface, so its slope factor reduces the balanced load at a lower pitch than a shingle roof. It sheds snow more readily." },
      { q: "What snow load should a steel building be designed for?", a: "Use your site ground snow load with Ct = 1.2 if the building is unheated, the slippery-surface slope factor, and your importance factor. Enter those above to get the design roof snow load in psf." },
    ],
  },
  {
    slug: "carport-patio-cover-snow-load",
    name: "Carport / patio cover",
    h1: "Carport & Patio Cover Snow Load Calculator",
    keyword: "carport snow load",
    volume: "140/mo",
    meta: "Free carport and patio cover snow load calculator. Open, unheated structures use ASCE 7 Ct = 1.2 — find the design snow load before you buy a kit.",
    intro: "Carports, patio covers and open shelters are unheated, open-air structures, so they use the higher thermal factor Ct = 1.2 — the snow on them does not get any help melting from below.",
    defaults: { slopeDeg: 5, thermal: "unheated", surface: "slippery", shape: "monoslope" },
    focus: "Open / unheated → Ct = 1.2; check the kit's rated load against this number.",
    notes: [
      "Many big-box carport and patio-cover kits are rated for a fixed snow load (often 10–30 psf). Compare that to your calculated design load before buying.",
      "A low-slope cover in a snowy area can easily exceed a light kit's rating — upgrade the gauge or add posts/purlins.",
    ],
    faqs: [
      { q: "How much snow can a carport hold?", a: "Check the kit's rated snow load on its spec sheet, then compare it to the ASCE 7 design load for your site from this calculator. If the design load is higher, the kit needs upgrading or more support." },
      { q: "What snow load rating do I need for a patio cover?", a: "At least the ASCE 7 design roof snow load for your location, computed with the unheated thermal factor (Ct = 1.2). Enter your ground snow load above to see the number." },
    ],
  },
  {
    slug: "shed-roof-snow-load",
    name: "Shed / monoslope roof",
    h1: "Shed Roof (Monoslope) Snow Load Calculator",
    keyword: "shed roof snow load",
    volume: "90/mo",
    meta: "Free shed roof / monoslope snow load calculator using ASCE 7-22. Get the balanced design load for a single-slope roof on a shed, barn or addition.",
    intro: "A shed or monoslope roof has one continuous slope, so the slope factor Cs applies straight to the flat-roof load. Single-slope roofs can also collect a windward drift along the high wall.",
    defaults: { slopeDeg: 10, thermal: "unheated", surface: "nonslippery", shape: "monoslope" },
    focus: "Single slope → one Cs; check windward drift at the high side.",
    notes: [
      "Sheds are usually unheated (Ct = 1.2), so they carry more snow than a heated house of the same slope.",
      "A monoslope roof against a taller wall can pick up a drift — check the drift case if there's a roof step or parapet.",
    ],
    faqs: [
      { q: "How do I calculate snow load on a shed roof?", a: "Use the ASCE 7 method: flat-roof load Pf from your ground snow load, then multiply by the slope factor Cs for the single slope. Sheds are usually unheated, so use Ct = 1.2. Enter the values above." },
      { q: "Is a shed roof good for snow?", a: "A steeper monoslope sheds snow well in one direction, but it can throw a lot of snow off the low edge and drift snow against a tall wall on the high side — plan where the snow goes." },
    ],
  },
  {
    slug: "gambrel-roof-snow-load",
    name: "Gambrel / barn roof",
    h1: "Gambrel (Barn) Roof Snow Load Calculator",
    keyword: "gambrel roof snow load",
    volume: "40/mo",
    meta: "Free gambrel / barn roof snow load calculator. The shallow upper slope governs the balanced load and collects unbalanced snow — see the ASCE 7 numbers.",
    intro: "A gambrel (barn) roof has a steep lower slope and a shallow upper slope. The shallow upper slope carries the most snow, so use it for the balanced load, and check the unbalanced case where snow drifts over the ridge.",
    defaults: { slopeDeg: 20, thermal: "unheated", surface: "nonslippery", shape: "gable" },
    focus: "Use the shallow upper slope for the balanced load; check unbalanced snow.",
    notes: [
      "Enter the upper (shallow) slope — it is the one that holds snow. The steep lower slope sheds and is rarely the governing balanced case.",
      "Barns are usually unheated (Ct = 1.2), and gambrel roofs are classic unbalanced-snow shapes.",
    ],
    faqs: [
      { q: "How is snow load different on a gambrel roof?", a: "The shallow upper slope governs the balanced load because it sheds the least snow. Use that slope in the calculator, and have the unbalanced load case checked since snow drifts across the shallow top." },
      { q: "What slope do I enter for a barn roof?", a: "Enter the upper, shallower slope of the gambrel — that's where snow accumulates. The steep lower slope sheds snow and rarely controls the balanced design." },
    ],
  },
  {
    slug: "greenhouse-snow-load",
    name: "Greenhouse / polycarbonate",
    h1: "Greenhouse & Polycarbonate Roof Snow Load Calculator",
    keyword: "greenhouse snow load",
    volume: "70/mo",
    meta: "Free greenhouse snow load calculator. A continuously heated greenhouse uses ASCE 7 Ct = 0.85 — find the design load on polycarbonate or glass glazing.",
    intro: "A continuously heated greenhouse melts snow from below, so ASCE 7 allows a reduced thermal factor Ct = 0.85 — but only if heat is maintained. Unheated hoop houses and cold frames do not get the reduction.",
    defaults: { slopeDeg: 25, thermal: "greenhouse", surface: "slippery", shape: "gable" },
    focus: "Heated glazing → Ct = 0.85; an unheated hoop house does NOT get the reduction.",
    notes: [
      "Ct = 0.85 only applies to a greenhouse kept continuously warm with low-R glazing. If the heat can fail, design it as a normal heated (Ct = 1.0) structure.",
      "Polycarbonate and glass are slippery surfaces, so the slope factor sheds snow sooner — a steeper greenhouse roof carries much less.",
    ],
    faqs: [
      { q: "How much snow load can a greenhouse take?", a: "Compare the kit's rated load to the ASCE 7 design load from this calculator. A continuously heated greenhouse uses Ct = 0.85; an unheated one does not, so it carries more snow." },
      { q: "Do I get the heated-greenhouse snow reduction?", a: "Only if the greenhouse is continuously heated with low-R glazing. If heating can be interrupted, ASCE 7 says to design it as an ordinary heated building (Ct = 1.0) instead of 0.85." },
    ],
  },
  {
    slug: "ground-snow-to-roof-snow-load",
    name: "Ground → roof conversion",
    h1: "Ground Snow Load to Roof Snow Load Calculator",
    keyword: "ground snow load to roof snow load",
    volume: "110/mo",
    meta: "Convert ground snow load to roof snow load with the ASCE 7-22 formula. Enter Pg and the roof's exposure, warmth and slope to get Pf and the sloped load Ps.",
    intro: "Roof snow load is the ground snow load converted for your specific roof: Pf = 0.7 × Ce × Ct × Is × Pg, then × Cs for slope. Enter your ground snow load below and adjust the factors to see exactly how the roof value is derived.",
    defaults: { slopeDeg: 18, thermal: "heated", surface: "nonslippery", shape: "gable" },
    focus: "Shows the full Pg → Pf → Ps conversion with every factor exposed.",
    notes: [
      "The 0.7 base factor already assumes some snow blows or melts off; the exposure, thermal and importance factors fine-tune it.",
      "On a normal heated, sheltered house the roof load is typically 60–70% of the ground snow load — but exposure and importance can push it higher.",
    ],
    faqs: [
      { q: "How do you convert ground snow load to roof snow load?", a: "Multiply the ground snow load Pg by 0.7 and by the exposure (Ce), thermal (Ct) and importance (Is) factors to get the flat-roof load Pf, then by the slope factor Cs for a pitched roof. This calculator does it and shows every step." },
      { q: "Is roof snow load always less than ground snow load?", a: "Usually, because the 0.7 factor accounts for snow blowing and melting off the roof. But a fully exposed, important or unheated building can have factors that push the roof load close to — occasionally above — the ground value." },
    ],
  },
];

export function getRoofType(slug: string): RoofType | undefined {
  return ROOF_TYPES.find((r) => r.slug === slug);
}
