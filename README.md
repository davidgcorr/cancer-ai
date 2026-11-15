# Oncoatlas

A React + TypeScript anatomy explorer for learning about cancer by body region.

## Run locally

```sh
npm install
npm run dev
```

Open Vite's Local URL. `npm run build` creates the production build; `npm run preview` serves it. `npm run verify:anatomy` decodes both real model assets and checks structure identity, geometry bounds, body scale, organ layout, and sex-specific structures.

## Anatomy assets

The initial primitive mannequin has been replaced with the real named meshes from **open-anatomy-3d 0.1.0**, pinned in the lockfile. Both GLB assets are imported through Vite and served locally, including Meshopt decoding; model loading does not rely on an external model CDN.

- Male: BodyParts3D 4.0 anatomy, about 1.03 million triangles, 128 named mesh structures.
- Female: adapted BodyParts3D internal anatomy fitted to a MakeHuman female surface, with Human Reference Atlas female breast/reproductive organs; about 1.17 million triangles, 133 named mesh structures. This is an adapted educational model, not a separately scanned or clinically validated female atlas.
- Separate organ, skeleton, and surface views preserve source geometry. Organ view uses translucent skin and bones to expose the internal anatomy.
- Selection highlights actual organ meshes. Marker and label locations come from transformed geometry bounds; no manually positioned placeholder organs are used.
- Hover labels identify visible structures, including structures outside the current cancer catalog. Clicks on mapped organs synchronize the cancer panel. The seven-region list remains keyboard accessible.
- Missing coverage is explicit: no separately segmented thyroid or male breast tissue; colon and rectum are grouped into a single large-intestine mesh.

## Research and source choice

- [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html) supplies an adult male atlas with identifiable anatomical structures. Its [current provider license](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html), updated February 27, 2025, is CC BY 4.0.
- [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy) is a detailed open anatomical atlas. Its distribution uses CC BY-SA 4.0 and its attribution file lists additional third-party components with their own terms. It was considered, but the chosen package offers a direct web-ready male/female integration and documented per-source provenance.
- [Open Anatomy 3D](https://github.com/MervinR07/open-anatomy-3d) provides web-ready compressed GLBs and a catalog of named mesh structures. [Its provenance and transformation pipeline](https://github.com/MervinR07/open-anatomy-3d/blob/main/ATTRIBUTION.md) document BodyParts3D, HRA, and MakeHuman sources.

The app makes no claim that the assets are clinically validated. The female adaptation and omitted structures are documented in the interface and above.

## Attribution and licenses

Anatomy: BodyParts3D © The Database Center for Life Science (CC BY 4.0); female organs: Human Reference Atlas 3D Reference Organs, HuBMAP (CC BY 4.0); female body: MakeHuman (CC0). Modified by open-anatomy-3d (https://github.com/MervinR07/open-anatomy-3d), CC BY 4.0.

Models and catalog: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Original attribution and model license are preserved in `public/anatomy/` and exposed in the app. Oncoatlas modifies display colors, transparency, and highlights only; the upstream geometry is unchanged. Package code is MIT.

Cancer examples and links reference the [National Cancer Institute](https://www.cancer.gov/types). These are selected educational examples, not an exhaustive catalog or a risk assessment.

## Stack and structure

React, Vite, TypeScript, Tailwind CSS v4, Radix/shadcn source components, Three.js, React Three Fiber, Drei, and Lucide.

- `src/data/anatomy.ts`: local GLB URLs, mesh-to-region mapping, coverage notes, geometry extraction
- `src/components/BodyViewer.tsx`: actual mesh rendering, layer views, highlights, labels, loading/error states, camera controls
- `src/data/regions.ts`: selected cancer topics
- `src/components/ui/`: editable components, configured in `components.json`
- `scripts/verify-anatomy.mjs`: compressed asset verification
