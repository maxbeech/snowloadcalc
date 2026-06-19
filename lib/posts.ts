// SEO guides. Each post is plain content rendered by app/blog/[slug]. Bodies are
// arrays of {h, p[]} sections so the page renders headings + paragraphs without
// a markdown dependency. Content is original, accurate and cites ASCE 7-22.
export interface PostSection { h?: string; p: string[] }
export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO; set from the build date of the product
  readMins: number;
  keyword: string;
  body: PostSection[];
}

const D = "2026-06-14";

export const POSTS: Post[] = [
  {
    slug: "how-to-calculate-roof-snow-load",
    title: "How to Calculate Roof Snow Load (ASCE 7-22, Step by Step)",
    description: "A plain-English walkthrough of the ASCE 7-22 roof snow load calculation: ground snow load, the flat-roof equation, the slope factor and the minimum load.",
    date: D, readMins: 7, keyword: "how to calculate roof snow load",
    body: [
      { p: ["Roof snow load is the design weight of snow your roof structure must carry. In the United States it is set by Chapter 7 of ASCE/SEI 7, the standard nearly every building code adopts. The good news: the core calculation is only a few steps, and this guide walks through each one."] },
      { h: "Step 1: Find your ground snow load (Pg)", p: ["Everything starts with the ground snow load, Pg, in pounds per square foot (psf). It is the weight of snow that accumulates on open ground at your site, and it is fixed by your location. Get it from the ASCE 7 Hazard Tool or your local building department; many jurisdictions publish an adopted county or town value. Our per-state pages give a planning range, but the permit value is the one your jurisdiction adopts."] },
      { h: "Step 2: Convert to the flat-roof load (Pf)", p: ["ASCE 7-22 Equation 7.3-1 converts ground snow to the flat-roof snow load: Pf = 0.7 × Ce × Ct × Is × Pg. The 0.7 base factor accounts for snow that blows or melts off a roof. Ce is the exposure factor (how wind-exposed the roof is), Ct is the thermal factor (how warm the roof is underneath), and Is is the importance factor (how critical the building is)."] },
      { h: "Step 3: Apply the slope factor (Cs) for a pitched roof", p: ["Sloped roofs shed snow, so multiply Pf by the slope factor Cs to get the sloped balanced load Ps = Cs × Pf. Cs is 1.0 up to a breakpoint slope and then decreases linearly to zero at 70°. Warm and slippery roofs shed sooner, so their breakpoint is lower."] },
      { h: "Step 4: Check the minimum and rain-on-snow", p: ["Low-slope roofs (under 15°) must also carry a minimum load: Is × Pg if Pg ≤ 20 psf, otherwise 20 × Is. And in mild-winter areas (Pg ≤ 20) a nearly flat roof gets a 5 psf rain-on-snow surcharge. Your design load is the largest governing case."] },
      { p: ["Plug your numbers into the SnowLoadCalc calculator and it does all four steps and shows every factor. For gable, stepped and multi-level roofs, also check the unbalanced, drift and sliding cases, any of which can govern."] },
    ],
  },
  {
    slug: "ground-snow-load-explained",
    title: "Ground Snow Load Explained (and How to Find Yours)",
    description: "What ground snow load (Pg) means, why it varies so much by location and elevation, and exactly where to look up the value for your site.",
    date: D, readMins: 6, keyword: "ground snow load",
    body: [
      { p: ["Ground snow load, written Pg, is the weight of accumulated snow on open ground at a site, in pounds per square foot. It is the single biggest input to any roof snow calculation, and it varies enormously: from 0 psf across the Gulf Coast to well over 100 psf in the mountains."] },
      { h: "Why it varies so much", p: ["Snow load depends on climate and, crucially, elevation. Two towns in the same county can have very different ground snow loads if one sits a few thousand feet higher. That is why ASCE 7 marks mountainous regions as 'case study' zones, where a site-specific study is required rather than a single map value."] },
      { h: "Where to find your value", p: ["The authoritative source is the ASCE 7 Hazard Tool, which returns the ASCE 7-22 ground snow load for a specific latitude/longitude. Your local building department is equally valid and often easier. Many adopt a published county or town value in their code amendments, and that adopted number is what governs a permit."] },
      { h: "Ground vs roof snow load", p: ["Ground snow load is not what your roof carries. A normal heated, sheltered house carries roughly 60–70% of the ground value once the ASCE 7 factors are applied. Use the ground value as the starting point and convert it with the roof snow load calculator."] },
    ],
  },
  {
    slug: "ground-snow-load-by-state",
    title: "Ground Snow Load by State: A Reference Map",
    description: "Planning ranges for ground snow load across all 50 states, with the mountainous case-study states flagged. Always confirm the exact value with your AHJ.",
    date: D, readMins: 5, keyword: "snow load by state",
    body: [
      { p: ["Ground snow load is a local number, but it helps to know the ballpark for your state before you look up the exact site value. We publish a planning range for the populated parts of every state, read from the ASCE 7 ground snow load map and common code amendments."] },
      { h: "The big picture", p: ["The Gulf Coast and Southwest deserts are effectively zero. The mid-Atlantic and lower Midwest run 15–30 psf. The upper Midwest and New England run 30–70 psf, and the northern tier of New England and the mountain West can exceed 100 psf at elevation."] },
      { h: "Watch the case-study states", p: ["In mountainous states (Colorado, Utah, Wyoming, Montana, Idaho, California, Washington, Oregon, Alaska and others) elevation drives the value, not the state. A valley town might be 35 psf while a resort a few miles away at altitude is 150+. Those states are flagged as case-study, meaning you must get the site value from the Hazard Tool or your AHJ."] },
      { p: ["Pick your state from the SnowLoadCalc state directory for its range, a pre-loaded calculator and the local guidance, then confirm the exact ground snow load for your address before you build."] },
    ],
  },
  {
    slug: "asce-7-22-snow-load-changes",
    title: "What Changed in ASCE 7-22 Snow Loads",
    description: "ASCE 7-22 reworked how ground snow load is determined and added reliability-targeted values. Here is what designers need to know.",
    date: D, readMins: 6, keyword: "asce 7-22 snow load",
    body: [
      { p: ["ASCE 7-22 is the 2022 edition of Minimum Design Loads and is being adopted through the 2024 IBC/IRC cycle. Its snow chapter (Chapter 7) kept the familiar equations but changed how the ground snow load is determined."] },
      { h: "Reliability-targeted ground snow loads", p: ["The biggest change is that ground snow loads are now reliability-targeted and delivered through the ASCE Hazard Tool database rather than a single printed map with case-study regions. The result is more site-specific values and, in some places, different numbers than ASCE 7-16 produced."] },
      { h: "The equations are familiar", p: ["The flat-roof equation Pf = 0.7 Ce Ct Is Pg, the slope factor Cs, the minimum-load rules and the drift formulas are all still here and broadly unchanged in form. If you know the 7-16 method, the 7-22 calculation will feel the same; it is mostly the Pg source that moved."] },
      { h: "What to do", p: ["Always pull the ground snow load from the Hazard Tool for the correct code edition your jurisdiction has adopted, and confirm which edition that is. Then run the standard calculation, which is exactly what SnowLoadCalc implements."] },
    ],
  },
  {
    slug: "ground-snow-load-vs-roof-snow-load",
    title: "Ground Snow Load vs Roof Snow Load: The Difference",
    description: "Why roof snow load is usually less than ground snow load, and the exposure, thermal and importance factors that connect them.",
    date: D, readMins: 5, keyword: "ground snow load vs roof snow load",
    body: [
      { p: ["People often use 'snow load' to mean both the snow on the ground and the snow on the roof, but ASCE 7 treats them as two different numbers connected by a formula."] },
      { h: "Ground snow load", p: ["Pg is what accumulates on open ground. It is a fixed property of your location and the input to the whole calculation."] },
      { h: "Roof snow load", p: ["The flat-roof load Pf = 0.7 × Ce × Ct × Is × Pg is what the roof actually carries. The 0.7 factor reflects that wind and a little melting remove some snow from a roof compared to open ground. Exposure (Ce), warmth (Ct) and importance (Is) then adjust it up or down."] },
      { h: "So which is bigger?", p: ["On a normal heated, partially sheltered house the roof load is about 60–70% of the ground load. But a fully exposed, unheated or essential-facility roof can have factors that push the roof load close to the ground value, and occasionally above it. Always run the conversion rather than assuming."] },
    ],
  },
  {
    slug: "snow-drift-loads-on-roofs",
    title: "Snow Drift Loads on Roofs (ASCE 7 §7.7) Made Simple",
    description: "How snow drifts form at roof steps, parapets and walls, why they can be the governing load case, and how to size the drift surcharge.",
    date: D, readMins: 6, keyword: "snow drift load",
    body: [
      { p: ["Some of the worst roof snow failures are not from uniform snow. They come from drifts that pile up where wind dumps snow against a taller wall, parapet or rooftop unit. ASCE 7 §7.7 covers these drift surcharge loads, and they often govern the design of a lower roof."] },
      { h: "Where drifts form", p: ["A drift builds on a lower roof next to a taller upper roof (a roof step), against a parapet, or beside a long rooftop screen. Wind carries snow off the upper surface and deposits it in a triangular drift on the lee side."] },
      { h: "What sets the drift size", p: ["The leeward drift height depends on the ground snow load and the length of the upper roof feeding it: hd = 0.43 × (Lu)^(1/3) × (Pg + 10)^(1/4) − 1.5 ft. The snow density γ = 0.13 Pg + 14 (capped at 30 pcf) turns that height into a surcharge load pd = hd × γ, which sits on top of the balanced load."] },
      { h: "When you can skip it", p: ["If the clear height above the balanced snow is small relative to the balanced snow depth (hc/hb < 0.2), drift need not be considered. Otherwise, run it: our snow drift calculator does the full §7.7 check."] },
    ],
  },
  {
    slug: "how-much-does-snow-weigh",
    title: "How Much Does a Foot of Snow Weigh on a Roof?",
    description: "Snow weight depends on density, not just depth. Here is how to estimate roof snow weight and why a foot of wet snow can be 5× a foot of powder.",
    date: D, readMins: 5, keyword: "how much does snow weigh",
    body: [
      { p: ["A roof does not care how deep the snow is. It cares how much that snow weighs, and weight depends on density, which varies wildly between dry powder and wet, settled snow."] },
      { h: "Density is everything", p: ["Fresh powder can be as light as 3–5 pounds per cubic foot, while old, wet, compacted snow approaches 20–30 pcf. ASCE 7 estimates settled snow density as γ = 0.13 × Pg + 14 psf-per-foot, capped at 30 pcf, so higher ground snow loads come with denser snow."] },
      { h: "Turning depth into load", p: ["Multiply density by depth to get load. A foot of powder at 5 pcf is only 5 psf, but a foot of wet snow at 20 pcf is 20 psf. Two feet of dense snow plus a rain event can quickly approach many roofs' design capacity."] },
      { h: "Knowing your number", p: ["Use the calculator to get your design roof snow load in psf, then watch real accumulation. If you can estimate the depth and whether it is light or wet, you can judge when you are approaching the design value and whether removal is warranted."] },
    ],
  },
  {
    slug: "metal-roof-snow-load-guide",
    title: "Metal Roof & Steel Building Snow Load Guide",
    description: "Why metal roofs count as 'slippery surfaces' in ASCE 7, how that lowers the slope factor, and the sliding-snow hazard to plan for.",
    date: D, readMins: 5, keyword: "metal roof snow load",
    body: [
      { p: ["Metal roofs and steel buildings are everywhere in snow country because they shed snow well. ASCE 7 recognises that by classifying smooth metal as an unobstructed slippery surface, which changes the slope factor."] },
      { h: "Slippery means it sheds sooner", p: ["On a warm roof, a slippery surface's slope factor Cs starts reducing the load at just 5°, versus 30° for shingles. So a metal roof at a moderate pitch carries noticeably less balanced snow than an equivalent asphalt roof."] },
      { h: "Don't forget the thermal factor", p: ["Many steel buildings are unheated, so they use Ct = 1.2 rather than 1.0, which adds load and partly offsets the slippery benefit. Enter the real thermal condition, not an optimistic one."] },
      { h: "Sliding snow is the catch", p: ["A slippery roof dumps its snow somewhere. ASCE 7 §7.9 sliding-snow loads land on lower roofs, walkways and equipment below. Plan where the snow goes and keep entrances and lower roofs clear of the slide path."] },
    ],
  },
  {
    slug: "solar-panels-and-snow-load",
    title: "Do Solar Panels Add to Roof Snow Load?",
    description: "How rooftop solar interacts with snow load: added dead load, changed sliding behaviour, and what to check before installing.",
    date: D, readMins: 5, keyword: "solar panels snow load",
    body: [
      { p: ["Rooftop solar is booming in snowy states, and a common question is whether the panels add to the roof's snow load. The honest answer: panels mostly add dead load, but they also change how snow behaves on the roof."] },
      { h: "Dead load first", p: ["A typical rooftop array adds roughly 3–4 psf of dead load (panels plus racking). That is separate from snow load but stacks on top of it in the load combinations, so the structure must carry both."] },
      { h: "Panels change snow behaviour", p: ["Smooth panel glass is slippery and can shed snow faster than the surrounding roof, but the racking can also trap snow at the lower edge and create mini-drifts between rows. In heavy-snow regions, designers sometimes treat the array area carefully rather than assuming it sheds clean."] },
      { h: "What to check", p: ["Confirm the roof's existing snow load capacity, add the array dead load, and make sure the attachment points and rafters still work. Run your design roof snow load here first so you know the number the structure already has to meet."] },
    ],
  },
  {
    slug: "safe-snow-load-for-my-roof",
    title: "What Is a Safe Snow Load for My Roof?",
    description: "How to tell what your roof was designed to carry, warning signs of overload, and when to remove snow.",
    date: D, readMins: 6, keyword: "safe snow load for roof",
    body: [
      { p: ["After a big storm the question is simple: is my roof okay? The answer comes from comparing the snow actually on the roof to the load the roof was designed for."] },
      { h: "Find your design load", p: ["Your structural drawings or local building department list the design ground/roof snow load. If you don't have them, compute the ASCE 7 design load for your location and roof here as a reasonable benchmark, since most modern roofs are designed at least to the code value."] },
      { h: "Estimate what's up there", p: ["Estimate the snow depth and whether it is light powder or dense, wet, settled snow. Multiply depth by density (powder ~5 pcf, wet ~20 pcf) to get the current load in psf, then compare to the design value."] },
      { h: "Warning signs", p: ["Sagging ceilings, sticking doors, new cracks in drywall, and creaking are red flags. If the estimated load is approaching the design value or you see these signs, remove snow safely (rake from the ground) or call a professional. Never get on a loaded roof."] },
    ],
  },
  {
    slug: "exposure-thermal-importance-factors",
    title: "Snow Load Factors: Exposure, Thermal and Importance Explained",
    description: "Plain-English definitions of Ce, Ct and Is, the three ASCE 7 factors that turn ground snow load into roof snow load.",
    date: D, readMins: 6, keyword: "snow load exposure factor",
    body: [
      { p: ["The flat-roof equation Pf = 0.7 Ce Ct Is Pg has three factors that trip people up. Here is what each one means and how to choose it."] },
      { h: "Exposure factor, Ce", p: ["Ce reflects how wind-exposed the roof is. A roof in open, windswept terrain loses snow to wind (Ce as low as 0.7–0.9); a roof sheltered by trees or taller buildings keeps it (Ce up to 1.2). It combines the surrounding terrain category (B, C, D) with the roof's own exposure."] },
      { h: "Thermal factor, Ct", p: ["Ct reflects how much heat escapes through the roof to melt snow from below. A continuously heated building is 1.0; a cold ventilated or barely heated roof is 1.1; an unheated structure is 1.2; a freezer is 1.3; and a continuously heated greenhouse gets 0.85."] },
      { h: "Importance factor, Is", p: ["Is scales the load by how critical the building is (Risk Category). Ordinary buildings are 1.0; low-hazard structures like minor sheds are 0.8; substantial-hazard buildings are 1.1; and essential facilities like hospitals are 1.2."] },
      { p: ["Get these three right and the rest of the calculation follows. The calculator lets you set each one and shows the value it used."] },
    ],
  },
  {
    slug: "flat-roof-snow-problems",
    title: "Why Flat Roofs Are Hardest on Snow",
    description: "Flat roofs carry the full snow load with no shedding, plus rain-on-snow and ponding risk. What to watch for and how to design.",
    date: D, readMins: 5, keyword: "flat roof snow load",
    body: [
      { p: ["Flat and low-slope roofs are the toughest case for snow because they get no help from gravity (nothing slides off), and they invite a couple of extra load cases."] },
      { h: "No slope shedding", p: ["With essentially no slope, the slope factor Cs is 1.0, so the roof carries the full flat-roof load Pf. There is no reduction for shedding the way a steep roof gets."] },
      { h: "Rain-on-snow and the minimum", p: ["In mild-winter areas (Pg ≤ 20 psf) a low-slope roof picks up a 5 psf rain-on-snow surcharge, because rain soaks into snow that can't drain. Low-slope roofs also must meet the §7.3.4 minimum load, which can govern in light-snow regions."] },
      { h: "Drainage and ponding", p: ["Beyond snow, a flat roof must drain meltwater. Blocked drains plus melting snow lead to ponding, which adds weight and can spiral. Keep drains and scuppers clear through winter, and design positive drainage."] },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
