# onco-milver

A React + TypeScript anatomy explorer for learning about cancer by body region.

## Run locally

```sh
npm install
npm run dev
```

Open Vite's Local URL. `npm run build` creates the production build; `npm run preview` serves it. `npm run verify:anatomy` decodes both real model assets and checks structure identity, geometry bounds, body scale, organ layout, and sex-specific structures.

## Anatomy assets

The initial primitive mannequin has been replaced with the real named meshes from **open-anatomy-3d 0.1.0**, pinned in the lockfile. Both GLB assets are imported through Vite and served locally, including Meshopt decoding; model loading does not rely on an external model CDN.

- Male: BodyParts3D 4.0 base anatomy, about 1.03 million triangles, 128 named mesh structures.
- Female: adapted BodyParts3D internal anatomy fitted to a MakeHuman female surface, with Human Reference Atlas female breast/reproductive organs; about 1.17 million triangles, 133 named mesh structures. This is an adapted educational model, not a separately scanned or clinically validated female atlas.
- Z-Anatomy supplies five genuine outer lung lobes and the thyroid as separate locally bundled supplement assets. The base package’s meshes labeled lung contain branching internal structures; those are excluded from rendering and selection in favor of these actual lung surfaces.
- Separate organ, skeleton, and surface views preserve source geometry. Organ view uses translucent skin and bones to expose the internal anatomy.
- Selection highlights actual organ meshes. Marker and label locations come from transformed geometry bounds; no manually positioned placeholder organs are used.
- Hover labels identify visible structures, including structures outside the current cancer catalog. Clicks on mapped organs synchronize the cancer panel. The 17-region list remains keyboard accessible.
- Missing coverage is explicit: no separately segmented male breast tissue; colon and rectum are grouped into a single large-intestine mesh.

## Research and source choice

- [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html) supplies an adult male atlas with identifiable anatomical structures. Its [current provider license](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html), updated February 27, 2025, is CC BY 4.0.
- [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy) is a detailed open anatomical atlas. Its distribution uses CC BY-SA 4.0 and its attribution file lists additional third-party components with their own terms. Its five lung lobes and thyroid are extracted from a [pinned web-ready export](https://github.com/nqwrc/3d-anatomy/tree/8ca3b7421bcfbe88b85859eb1983d5cf79f21749/public/models). These selected organ adaptations retain CC BY-SA 4.0; no kidney, inner ear, or other separately licensed third-party geometry is included.
- [Open Anatomy 3D](https://github.com/MervinR07/open-anatomy-3d) provides web-ready compressed GLBs and a catalog of named mesh structures. [Its provenance and transformation pipeline](https://github.com/MervinR07/open-anatomy-3d/blob/main/ATTRIBUTION.md) document BodyParts3D, HRA, and MakeHuman sources.

The app makes no claim that the assets are clinically validated. The female adaptation and omitted structures are documented in the interface and above.

## Attribution and licenses

Anatomy: BodyParts3D © The Database Center for Life Science (CC BY 4.0); female organs: Human Reference Atlas 3D Reference Organs, HuBMAP (CC BY 4.0); female body: MakeHuman (CC0). Modified by open-anatomy-3d (https://github.com/MervinR07/open-anatomy-3d), CC BY 4.0.

Base models and catalog: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Original attribution and model license are preserved in `public/anatomy/` and exposed in the app. The base geometry is unchanged. Package code is MIT.

Lung and thyroid supplements: Z-Anatomy, derived from BodyParts3D © DBCLS, **CC BY-SA 4.0**. onco-milver extracts, translates, and (for the female torso) scales these meshes using cross-atlas tracheal and liver landmarks. These registrations are educational adaptations, not clinical alignments. Full provenance and changes are in `public/anatomy/SUPPLEMENT-NOTICE.md`; original upstream notices are retained alongside the two freely downloadable derivative GLBs.

### Reproduce supplementary assets

Download `visceral.glb` from the pinned source export linked above. With Blender installed:

```sh
blender --background --python scripts/extract-z-organs.py -- /path/to/visceral.glb /tmp/z-selected.glb
node scripts/build-z-organs.mjs /tmp/z-selected.glb
npm run verify:anatomy
```

The build script preserves the source organ surfaces and records the registration matrix and source names in the resulting GLB metadata.

Cancer examples and links reference the [National Cancer Institute](https://www.cancer.gov/types). These are selected educational examples, not an exhaustive catalog or a risk assessment.

## Stack and structure

React, Vite, TypeScript, Tailwind CSS v4, official shadcn/ui components with Radix primitives, Three.js, React Three Fiber, Drei, and Lucide.

- `src/data/anatomy.ts`: local GLB URLs, mesh-to-region mapping, coverage notes, geometry extraction
- `src/components/BodyViewer.tsx`: actual mesh rendering, layer views, highlights, labels, loading/error states, camera controls
- `src/data/regions.ts`: selected cancer topics
- `src/components/ui/`: editable components, configured in `components.json`
- `scripts/verify-anatomy.mjs`: compressed asset verification

## Interface and palettes

The interface uses the official shadcn/ui Button, Card, Badge, Select, ToggleGroup, Separator, Dialog, Accordion, Alert, Label, and Tooltip components. The header contains the onco-milver wordmark, a simple circle icon, and a gear button that opens a shadcn settings menu with palette choices. Neutral is the default; Blue, Violet, Rose, and Orange are available. Palettes update semantic shadcn theme variables and the 3D organ selection color. Preferences persist locally when browser storage is available.

## Cancer classification map

The right-hand shadcn panel contains a D3 Sankey: body region → cancer group → selected subtype → stage or disease-specific classification. The region selector includes an all-regions overview. Clicking a region, type, or subtype focuses the map; selecting a classification reveals its system, caveats, and NCI sources. Nodes support keyboard activation and hover/focus connection tracing. Zoom controls and an internally scrollable diagram support smaller panels.

Use the header’s float button to detach the panel, drag its header, or resize its edges. The grip button supports arrow-key movement. The dock button restores it on the right. Browser resizing keeps the floating panel within the viewport.

The diagram is a sourced educational taxonomy, not incidence data, a prognosis, or a disease-progression timeline. Link values count classification relationships, and link widths are labeled accordingly. Broad solid-tumor stage groups are distinguished from CNS WHO grades, acute leukemia disease status, CLL Rai stages, CML phases, myeloma ISS stages, and extent/status descriptions. Skin cancers and age-dependent thyroid staging have explicit exceptions. Sources are attached to individual subtypes and classification nodes. Examples are selective and not an exhaustive clinical ontology.

Skin selects the surface view; bones select the skeletal view. Blood/marrow cancers are treated as systemic and have no fabricated point marker or vascular highlight. Lymphatic coverage highlights the available spleen and thymus with a coverage note.

- `src/data/cancer-taxonomy.ts`: sourced subtype and classification examples
- `src/data/cancer-graph.ts`: Sankey data, relationship counts, filters, and tracing
- `src/components/CancerPanel.tsx`: draggable/resizable, dockable panel and controls
- `src/components/CancerSankey.tsx`: SVG visualization and accessible node interactions
- `npm run verify:cancer-map`: verify every region/gender graph, filters, conservation, layouts, and key classification exceptions

## Languages

The gear menu includes English, Español, Français, and Deutsch. The saved language preference is independent of the palette and persists in `onco-milver-language` when local storage is available. Switching language preserves the selected body region, gender, camera, diagram filters, and floating panel state. The document language and title also update.

Translations cover the interface, accessible labels, region descriptions, visible anatomy labels, cancer types/subtypes, classification labels, disease-specific explanations, and coverage notes. Source IDs and reference URLs stay stable; the original attribution text remains in English and is marked accordingly. Reference pages may remain in English.

- `src/lib/i18n/core.ts`: supported locales, saved-language fallback, translation and interpolation
- `src/lib/i18n/messages.ts`: authored Spanish/French/German translations keyed by English source text
- `src/lib/i18n/provider.tsx`: shared live language context and document metadata
- `npm run verify:i18n`: checks translation coverage for both models, clinical data, visible anatomy, placeholders, and stored preference fallbacks

## Detailed view, treatment summaries, and frequency evidence

Select a Sankey node to open Details. The breadcrumbs follow region → cancer group → subtype → stage/classification. Every ancestor is navigable. Shared stage nodes prompt for the actual parent subtype rather than inventing an ancestry. Details can also be opened directly with the Map / Details toggle.

The audited catalog now has 121 entries for the male model and 136 for the female model across the existing 17 regions. It includes major and selected rare histologies/disease lineages, **not a complete WHO/ICD-O catalog**. Umbrella groups and finer histologies sometimes overlap. The source framework, counts, missing coverage, and denominator restrictions are recorded in `public/cancer-catalog-audit.md`, linked from About & sources.

Every subtype has a sourced educational treatment summary, displayed as cards in the detail view and HTML/PNG reports. Profiles distinguish important exceptions (CML, CLL, APL, differentiated/medullary thyroid cancer, GIST, neuroendocrine tumors, bone sarcomas and germ-cell tumors). Stage pages inherit subtype-level options with an explicit note that they are not stage-specific prescriptions. No doses or personalized treatment recommendations are generated.

Frequency values include a source, denominator, population, period, and precision qualifier. CDC lung figures use U.S. 2022 cases. SEER site-specific histology tables use historical 2011–2015 cohorts with table-specific exclusions and ICD-O groupings. Approximate NCI overviews are distinguished from registry values. Male breast entries do not inherit female estimates. Percentages are shown only when a sourced estimate is available; otherwise frequency badges and sections are omitted from the app and reports. Published ranges are preserved. These data must not be normalized across different cohorts or used as personal cancer risk. Sankey link widths remain classification counts.

## HTML and PNG reports

Use Export report in the cancer panel. Choose the current branch or the full selected region, then Download HTML or Download PNG. The export uses the active language and includes the parent path, classification diagram, subtype treatments, frequency metadata, source links, source review date, and generation timestamp. A selected stage is explicitly labeled as using subtype-level treatment options.

HTML reports are standalone, script-free, printable documents with an embedded SVG. PNG reports render the same information locally with Canvas; the entire report is drawn rather than capturing a clipped scroll viewport. No files are uploaded. Very large images show an explicit error with the option to use HTML or a smaller branch.

- `src/data/catalog-expansion.ts`: added histologies and disease lineages
- `src/data/cancer-evidence.ts`: treatment summaries and sourced frequency records
- `src/data/cancer-detail.ts`: validated parent paths and branch scopes
- `src/components/CancerDetails.tsx`: breadcrumbs, treatment options, frequency evidence
- `src/lib/report/`: standalone report model, SVG/HTML generation, PNG rendering and downloads
- `npm run verify:reports`: checks all parent paths, evidence metadata, 136 localized region-report combinations, safe HTML escaping, branch/stage scope, and real PNG encoding using a native canvas test adapter

The source review is educational source verification, not validation by a clinical team.

## Cloudflare deployment

Production: https://oncomilver.davidgc.com, hosted as the `onco-milver` Cloudflare Worker with static assets. `wrangler.jsonc` defines the custom domain and SPA fallback. Wrangler manages the domain's DNS record and TLS certificate in the existing `davidgc.com` zone.

`.github/workflows/cloudflare.yml` verifies pull requests and deploys successful pushes to `main`. It runs lint, translations, cancer-map validation, real report exports, anatomy checks, the production build, and a Wrangler dry run. The deploy job publishes the verified build artifact and checks the live JavaScript, anatomy models, and source audit. You can also start it from GitHub Actions using **Run workflow**.

For unattended GitHub deployments, set the repository Actions secret `CLOUDFLARE_API_TOKEN` to a Cloudflare API token with **Account → Workers Scripts → Edit**, **Zone → Workers Routes → Edit**, and **Zone → Zone → Read**. Restrict account access to the configured account and zone access to `davidgc.com`. Do not use a local Wrangler OAuth token for CI; it expires. The account ID is public configuration in `wrangler.jsonc`.

Local deployment with an authenticated Cloudflare account:

```sh
npx wrangler login
npm run deploy
```

Validate without deploying with `npm run deploy:dry-run`. To restore an earlier production version, use `npx wrangler rollback` and select the version to restore.

Cloudflare references: [static assets](https://developers.cloudflare.com/workers/static-assets/), [custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), [GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).

## Open source and licensing

The application source code is available at [davidgcorr/cancer-ai](https://github.com/davidgcorr/cancer-ai) under the [MIT license](LICENSE). Copyright © 2026 David G. Corr.

Anatomy assets are separately licensed and are excluded from the application MIT license. The base models retain [CC BY 4.0](public/anatomy/LICENSE-MODELS.md); the lung and thyroid supplements retain [CC BY-SA 4.0](public/anatomy/SUPPLEMENT-NOTICE.md). Preserve their attribution and license notices when redistributing these assets. Third-party dependencies retain their respective licenses.

[Website](https://davidgc.com) · [Twitter / X](https://x.com/davidgcorr) · [LinkedIn](https://www.linkedin.com/in/davidgarciacorrochano/)
