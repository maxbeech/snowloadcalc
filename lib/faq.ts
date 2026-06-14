export interface FaqItem {
  q: string;
  a: string;
}

// Shared FAQ rendered on the home page; per-page FAQs live in their data files.
export const HOME_FAQS: FaqItem[] = [
  {
    q: "How do you calculate roof snow load?",
    a: "Start from the ground snow load (Pg) for your site, then apply ASCE 7-22 Eq. 7.3-1: flat-roof load Pf = 0.7 × Ce × Ct × Is × Pg, where Ce is the exposure factor, Ct the thermal factor and Is the importance factor. For a sloped roof multiply by the slope factor Cs. Low-slope roofs must also carry the §7.3.4 minimum load.",
  },
  {
    q: "What is the difference between ground snow load and roof snow load?",
    a: "Ground snow load (Pg) is the weight of snow on the open ground at your site — it is fixed by your location and set by the ASCE 7 Hazard Tool or your building department. Roof snow load is what your roof actually has to carry: it is the ground value adjusted for exposure, the roof's warmth, its importance and its slope, and it is almost always less than Pg on a normal heated building.",
  },
  {
    q: "Where do I find my ground snow load?",
    a: "Use the ASCE 7 Hazard Tool (asce7hazardtool.online) or ask your local building department for the adopted design ground snow load. Many jurisdictions publish a county or town value in their building-code amendments. Our per-state pages give a planning range, but the legally-binding number for a permit is the one your AHJ adopts.",
  },
  {
    q: "Is this calculator accurate enough for a permit?",
    a: "It implements the ASCE 7-22 balanced-load equations exactly and shows every factor, so it is a strong design aid and a good check. For a permit submittal you still need the correct site ground snow load, the unbalanced/drift/sliding load cases where they apply, and a licensed engineer's review. The Pro report packages the calculation for exactly that.",
  },
];
