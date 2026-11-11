# UI Redesign Report: OULAD Student Prediction

Date: 2026-11-12
Branch: `feat/ui-redesign`
Target: Visual and Interaction Redesign (D0 through D8)

---

## 1. Phase Summary Table

| Phase | Status | Files Changed | Raw Evidence Summary |
|---|---|---|---|
| **D0: Baseline Audit** | DONE | `website/scripts/d0-baseline.mjs`, `docs/ui-before/*.png` | Full-page baseline screenshots captured at 375, 768, 1280, 1728px. Initial horizontal overflows measured: 375px (+161px), 1280px (+262px), 1728px (+38px). |
| **D1: Design System & Skeuomorphism** | DONE | `website/src/index.css`, `website/tailwind.config.js`, `website/package.json` | 8px spacing scale, radius tokens, warm neutral base (`#f8f9fa` / `#0d1117`), single accent (`#0969da` / `#58a6ff`), and strict semantic green/red reserved exclusively for student outcomes. Physical skeuomorphic utility classes (`.skeuo-card`, `.skeuo-plate`, `.skeuo-button`, `.skeuo-chip`, `.skeuo-segmented-switch`) implemented with dual borders, subtle inset highlights, and tactile shadows. Typography refreshed with IBM Plex Serif for headings, Inter for prose, and tabular monospace for metrics. |
| **D2: Layout Alignment & Overflow Removal** | DONE | `website/src/index.css`, `website/scripts/test-d1-alignment.mjs` | `node scripts/test-d1-alignment.mjs` PASSED with 0px overflow across all viewports (375px: 375/375, 768px: 768/768, 1280px: 1280/1280, 1728px: 1728/1728) in both Interactive and Paper views. Applied `overflow-x: clip`, content width constraints, and wrapped wide tabular layouts in `.table-scroll-container` with sticky first columns. |
| **D3: macOS-Style Dock Navigation** | DONE | `website/src/components/MacDock.tsx`, `website/src/components/Navbar.tsx`, `website/scripts/test-d3-dock.mjs` | `node scripts/test-d3-dock.mjs` PASSED. Top navbar simplified from 16 links down to 0 section links (retaining only Title, Segmented View Switch, Theme Switch). Floating bottom dock provides 16 items (13 in-page sections + divider + PDF link + GitHub link). Features cosine magnification curve via `framer-motion`, active-section scroll-spy indicator dots, keyboard navigation, and tooltips. All 14 section scroll positions land within 70–100px from the top (threshold <= 120px). |
| **D4: Scroll Smoothness & View Transitions** | DONE | `website/src/App.tsx`, `website/src/index.css`, `website/src/components/Navbar.tsx`, `website/scripts/test-d4-scroll.mjs` | `node scripts/test-d4-scroll.mjs` PASSED. Cumulative Layout Shift (CLS) = 0.0000 (< 0.05 requirement). Recorded 0 long tasks (> 50ms) during programmatic scrolling. Integrated Lenis inertia scrolling and View Transitions API (`document.startViewTransition`) with crossfade fallback. |
| **D5: Skeleton Loading & Code Splitting** | DONE | `website/src/App.tsx`, `website/src/components/Skeletons.tsx`, `website/src/components/PaperView.tsx`, `website/scripts/test-d5-skeleton.mjs` | `node scripts/test-d5-skeleton.mjs` PASSED under Slow 4G CDP network emulation (500 kbps, 400ms RTT). Skeleton rendered with `aria-busy="true"` and zero layout shift (CLS = 0.0000). React.lazy applied to `PaperView`, `ClaimsLedger`, `ReproductionSection`, `SupplementarySection`. Table CSV export buttons show active loading feedback during download preparation. |
| **D6: Responsive Behavior & Themes** | DONE | `website/src/index.css`, `website/scripts/test-d6-responsive.mjs`, `docs/ui-after/*.png` | `node scripts/test-d6-responsive.mjs` PASSED across 8 combinations (375px, 768px, 1280px, 1728px in both Light and Dark themes). Full-page screenshots saved to `docs/ui-after/`. Enforced 44px minimum touch targets on mobile interactive controls. |
| **D7: Performance & Accessibility Audit** | DONE | `website/scripts/test-axe.mjs`, `website/scripts/check-chunks.mjs`, `website/scripts/run-lighthouse.mjs`, `docs/lighthouse.json`, component contrast updates | Axe-core accessibility audit found 0 serious or critical violations. Main JS bundle size is 446.85 KB (< 500 KB limit). Lighthouse scores: Accessibility 100/100, Best Practices 100/100, SEO 91/100, Performance 70/100. `npm run verify-fixes` exited with code 0. |
| **D8: Final Verification & Report** | DONE | `UI_REPORT.md` | All test scripts verified, before/after evidence documented, git diff generated, and `npm run verify-fixes` passes with exit code 0. |

---

## 2. Screenshot Evidence Paths

### Baseline Screenshots (Before Redesign)
- `docs/ui-before/viewport-375px.png` (375x812, measured overflow: +161px)
- `docs/ui-before/viewport-768px.png` (768x1024, measured overflow: 0px)
- `docs/ui-before/viewport-1280px.png` (1280x900, measured overflow: +262px)
- `docs/ui-before/viewport-1728px.png` (1728x1080, measured overflow: +38px)

### Loading State Screenshots (Slow 4G Emulation)
- `docs/ui-loading/slow4g-loading.png` (Skeleton shimmer placeholder with `aria-busy="true"`)
- `docs/ui-loading/slow4g-loaded.png` (Fully resolved view after chunk arrival, CLS = 0.0000)

### Final Responsive & Themed Screenshots (After Redesign)
- `docs/ui-after/viewport-375px-light.png`
- `docs/ui-after/viewport-375px-dark.png`
- `docs/ui-after/viewport-768px-light.png`
- `docs/ui-after/viewport-768px-dark.png`
- `docs/ui-after/viewport-1280px-light.png`
- `docs/ui-after/viewport-1280px-dark.png`
- `docs/ui-after/viewport-1728px-light.png`
- `docs/ui-after/viewport-1728px-dark.png`

---

## 3. Git Diff Stat (`main..feat/ui-redesign`)

```
 docs/lighthouse.json                            | 18488 ++++++++++++++++++++++
 docs/ui-after/viewport-1280px-dark.png          |   Bin 0 -> 3334529 bytes
 docs/ui-after/viewport-1280px-light.png         |   Bin 0 -> 3415895 bytes
 docs/ui-after/viewport-1728px-dark.png          |   Bin 0 -> 3503474 bytes
 docs/ui-after/viewport-1728px-light.png         |   Bin 0 -> 3587332 bytes
 docs/ui-after/viewport-375px-dark.png           |   Bin 0 -> 2937730 bytes
 docs/ui-after/viewport-375px-light.png          |   Bin 0 -> 3008475 bytes
 docs/ui-after/viewport-768px-dark.png           |   Bin 0 -> 3307362 bytes
 docs/ui-after/viewport-768px-light.png          |   Bin 0 -> 3359439 bytes
 docs/ui-before/viewport-1280px.png              |   Bin 0 -> 2559530 bytes
 docs/ui-before/viewport-1728px.png              |   Bin 0 -> 2661962 bytes
 docs/ui-before/viewport-375px.png               |   Bin 0 -> 2434170 bytes
 docs/ui-before/viewport-768px.png               |   Bin 0 -> 2438621 bytes
 docs/ui-loading/slow4g-loaded.png               |   Bin 0 -> 145506 bytes
 docs/ui-loading/slow4g-loading.png              |   Bin 0 -> 32658 bytes
 website/package-lock.json                       |   158 +
 website/package.json                            |     6 +
 website/scripts/check-chunks.mjs                |    17 +
 website/scripts/d0-baseline.mjs                 |   111 +
 website/scripts/run-lighthouse.mjs              |    51 +-
 website/scripts/test-axe.mjs                    |    89 +
 website/scripts/test-d1-alignment.mjs           |   113 +
 website/scripts/test-d3-dock.mjs                |   166 +
 website/scripts/test-d4-scroll.mjs              |   139 +
 website/scripts/test-d5-skeleton.mjs            |   139 +
 website/scripts/test-d6-responsive.mjs          |   124 +
 website/src/App.tsx                             |    77 +-
 website/src/components/ClaimsLedger.tsx         |     2 +
 website/src/components/ExperimentalDesign.tsx   |     8 +-
 website/src/components/Footer.tsx               |     2 +-
 website/src/components/LeakageDesign.tsx        |    10 +-
 website/src/components/MacDock.tsx              |   264 +
 website/src/components/Navbar.tsx               |   189 +-
 website/src/components/PaperView.tsx            |   164 +-
 website/src/components/ReproductionSection.tsx  |     2 +
 website/src/components/ResultsSection.tsx       |    30 +-
 website/src/components/RobustnessSection.tsx    |     2 +-
 website/src/components/Skeletons.tsx            |    62 +
 website/src/components/SubgroupsSection.tsx     |     6 +-
 website/src/components/SupplementarySection.tsx |     2 +
 website/src/index.css                           |   349 +-
 website/tailwind.config.js                      |    10 +-
 42 files changed, 20486 insertions(+), 294 deletions(-)
```

---

## 4. Documented Deviations & Justifications

1. **`PaperView.tsx` Subsection Mapping Correction**:
   - In the original layout, Table II was placed inside Subsection III-C. However, in the manuscript structure, Section III ("Dataset and Preprocessing") has only Subsections A and B ("Data Source and Context", "Target Variable Formulation"), while Subsection C ("Temporal Feature Engineering") is Section IV-C ("Methodology: Leakage-Free Design").
   - Accessing `paperSections[2].subsections[2]` resulted in `undefined` and caused a runtime crash when mounting `PaperView`. Table II was relocated to Section IV-C where Subsection C is defined in `paper_text.ts`. This preserved all manuscript content and text verbatim while allowing proper lazy rendering.

2. **Axe Accessible Label Refinement on Confusion Matrix Buttons**:
   - To satisfy WCAG 2.1 Criterion 2.5.3 (Label in Name), the confusion matrix buttons in `ResultsSection.tsx` previously used `aria-label` overrides that excluded visible text details. Removing the redundant `aria-label` override allowed the screen reader name calculation to derive directly from the child DOM text ("TP (True Positive) 2,127 Recall: 76.12%"), resolving the mismatch and resulting in 0 violations.

3. **Subtle Contrast Elevating for Small Badges**:
   - Small text badges with tinted backgrounds (`text-amber-600`, `text-slate-400`, `bg-amber-500`, `bg-red-500`) were darkened to `text-amber-700/800`, `text-slate-600`, `bg-amber-700`, and `bg-red-700` in light mode to meet the WCAG AA 4.5:1 contrast requirement while maintaining the same color semantics.

---

## 5. Verification Gate Output Summary

- Verbatim Check: 87/87 exact manuscript strings verified.
- Reference Check: 30/30 citations validated with active links and exact manuscript titles.
- Figure Captions: Figures 4, 5, 6, 7, 8 match manuscript text verbatim.
- Manuscript Numbers: 66/66 numbers match Table I, III, IV, V, VI.
- Banned Words Audit: Zero banned terms found.
- Number Integrity Audit: 366 numbers verified against manuscript ground truth.
- Axe-Core Audit: 0 serious / 0 critical violations.
- Main Bundle Size: 446.85 KB (< 500 KB limit).
- Horizontal Overflow: 0px across 375, 768, 1280, 1728px viewports in both views.

---

GO
