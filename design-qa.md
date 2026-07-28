# Design QA — 視覺回退

**Source visual truth**

- Primary target: `/private/tmp/editorial-baseline-desktop.jpg`
- Supporting pre-editorial structure reference: `/private/tmp/studio-structure-before-services.png`

**Rendered implementation evidence**

- Hero (Desktop): `/private/tmp/restored-editorial-hero-ready-1440.png`
- Service cards and expanded short-film detail (Desktop): `/private/tmp/restored-editorial-services-1440.png`, `/private/tmp/restored-editorial-short-detail-1440.png`
- Aerial detail (Desktop): `/private/tmp/restored-editorial-aerial-detail-1440.png`
- Restored advisor result (Desktop): `/private/tmp/restored-editorial-advisor-result-1440.png`
- Tablet: `/private/tmp/restored-editorial-services-768.png`
- Mobile: `/private/tmp/restored-editorial-services-390.png`, `/private/tmp/restored-editorial-short-detail-390.png`

**Viewport and state**

- Desktop source and implementation: 1440 × 1000 pixels, CSS viewport 1440 × 1000, device scale factor 1. No density normalization was necessary.
- Tablet implementation: CSS viewport 768 × 1000, screenshot 768 × 1000.
- Mobile implementation: CSS viewport 390 × 844, screenshot 390 × 844.
- Desktop comparison state: initial Hero after its entry transition completed; source and implementation were reviewed together in the same visual comparison input.
- Focused comparison state: selected short-film service card and the expanded detail container, compared against the supporting pre-editorial structure capture. This supporting capture has a different vertical crop (1440 × 1100), so only its shared service-card/detail regions were judged.

**Comparison history**

1. **P1 — editorial redesign drift (pre-fix).**
   - Evidence: the running page used altered Hero copy/hierarchy, flat service presentation, segmented full-width detail content, and a changed advisor/contact treatment instead of the specified pre-editorial visual direction.
   - Fixes made: restored the Hero copy/hierarchy and floating-player label; reinstated the three large service cards; restored the rounded detail container with a left information column and right workflow column; restored the advisor and contact section framing.
2. **Post-fix comparison.**
   - Evidence: the Desktop Hero comparison uses the primary target and `/private/tmp/restored-editorial-hero-ready-1440.png`; the service/detail comparison uses the supporting structure reference and the Desktop detail captures above.
   - Result: no remaining actionable P0, P1, or P2 visual mismatch was found within the requested rollback scope.

**Findings**

- No actionable P0/P1/P2 findings remain.
- [P3] The service-detail content necessarily carries the later verified price, phase, and “修改至滿意” workflow data, so its typography and internal sequence are newer than the historical supporting screenshot. This is intentional and required by the rollback brief; the original container hierarchy, card treatment, border, and split-column visual structure are restored.

**Required fidelity surfaces**

- **Fonts and typography:** The Hero eyebrow, two-line white H1, supporting copy, player label, centered services heading, and card hierarchy match the pre-editorial hierarchy. No truncation or clipping was observed at 1440, 768, or 390px.
- **Spacing and layout rhythm:** The Hero preserves the broad left-copy/right-player composition. The service selector is again a three-card grid on desktop/tablet and a one-column stack on mobile. The service detail is again one rounded bordered container with a local left/right split rather than the removed full-width editorial sections.
- **Colors and visual tokens:** Sky blue/cloud Hero, mist-white page, pale blue borders, restrained shadows, and small fluorescent-yellow selection/CTA accents are present and consistent with the source direction.
- **Image quality and asset fidelity:** The existing `hero-sky` image asset and actual HTML video player were retained. No generated image, fake artwork, CSS drawing, or handcrafted SVG replacement was introduced.
- **Copy and content:** Baseline Hero and section copy were restored where requested. Current verified prices, delivery labels, formula, recommendation result, and workflow language remain intentionally current.
- **Interactions and accessibility:** Cards remain semantic buttons with `aria-expanded`; the tier picker remains a radiogroup. A real browser check confirmed one selected card/detail at a time, the short-film NT$500 tier update, long-film NT$1,500 without long-term plans, aerial 5/10/15-minute pricing examples, and the local recommendation result.
- **Viewport resilience:** `documentElement.scrollWidth === clientWidth` at 1440, 768, and 390px. No horizontal overflow was observed.
- **Workflow stability:** During a full short-film playback, `longTermTop` remained `340.1640625px` and `contactTop` remained `509.1640625px` across steps 01–06 and the final conclusion; the workflow still reveals sequentially.

**Open questions**

- Reduced-motion emulation was not available in this browser session. The existing implementation remains in place and was not changed by this rollback.

**Implementation checklist**

1. Restore the pre-editorial visual hierarchy without reverting verified service data or workflow logic. — complete
2. Validate the three responsive widths and active service states. — complete
3. Build the production bundle and inspect the browser console. — complete

**Follow-up polish**

- None required for this rollback. If a later visual-art-direction pass is requested, use a new approved reference rather than changing this restored baseline.

final result: passed
