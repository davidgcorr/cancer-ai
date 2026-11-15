# Oncoatlas

A React + TypeScript anatomy explorer for learning about cancer by body region.

## Run locally

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite. Create a production build with `npm run build`; serve it with `npm run preview`.

## Stack

- React and Vite with TypeScript
- Tailwind CSS v4 through the Vite plugin
- shadcn/ui-style source components with Radix primitives, configured in `components.json`
- Three.js via React Three Fiber and Drei
- Lucide icons

## First version

- Male/female selection updates the procedural body model and reproductive-region examples.
- Seven selectable regions, synchronized between the 3D markers and accessible region buttons.
- Drag to rotate, scroll/pinch to zoom, reset view, flip front/back, and show/hide markers.
- Responsive layout and a fallback message if WebGL is unavailable.
- Educational cancer examples and links to the National Cancer Institute.

The model is a simplified, locally generated illustration, not a clinical anatomical model. Region markers are approximate. The selected cancer examples are not an exhaustive catalog or risk assessment. Body model selection does not describe every individual's anatomy.

## Source structure

- `src/data/regions.ts`: gender-dependent regions, cancer examples, approximate marker positions
- `src/components/BodyViewer.tsx`: procedural human meshes, interactive markers, camera controls
- `src/components/ui/`: editable shadcn component source
- `src/App.tsx`: explorer interface and selection state
- `src/index.css`: Tailwind setup and visual styling

Content reference: https://www.cancer.gov/types
