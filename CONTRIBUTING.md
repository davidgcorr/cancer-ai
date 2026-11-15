# Contribute to onco-milver

Contributors are welcome: developers, clinicians, anatomy specialists, designers, translators, and people who can help test the explorer.

Try the [live project](https://oncomilver.davidgc.com), browse [open issues](https://github.com/davidgcorr/cancer-ai/issues), or open an issue describing what you would like to improve. Small, focused contributions are welcome.

## Where help is needed

- **Clinical content and references:** review the selected cancer taxonomy, classifications, and educational treatment summaries. Attach authoritative references and explain which entries change. This is an educational catalog, not a complete WHO or ICD-O ontology.
- **Frequency data:** add published subtype proportions only with a source, denominator, population, period, and appropriate precision. Preserve ranges and thresholds. Leave unavailable values hidden; never infer zero or normalize unrelated cohorts.
- **Anatomy and 3D:** improve selection, visibility, model registration, performance, and coverage. Document source provenance and preserve model licenses and attribution.
- **Accessibility and interface:** keyboard navigation, screen-reader support, touch controls, responsive layouts, and readable diagrams. Use the existing shadcn components.
- **Translations:** improve English, Spanish, French, and German; add missing clinical or interface translations with consistent terminology.
- **Testing and documentation:** reproducible bug reports, useful regression checks, screenshots, and clearer setup instructions.

## Local development

Use Node.js 24 and npm.

```sh
git clone https://github.com/YOUR-USERNAME/cancer-ai.git
cd cancer-ai
git switch -c your-change
npm ci
npm run dev
```

Before opening a pull request:

```sh
npm run check
npm run build
```

Describe the problem, the resulting behavior, and how you verified the change. Add screenshots for visible interface changes and primary references for clinical content. Include relevant browser, device, language, and palette details in bug reports. Do not submit patient information or other personal health data.

Fork the repository and open a pull request against `davidgcorr/cancer-ai:main`. Contributors do not need Cloudflare credentials or production access. Maintainers handle releases.

## Licensing

Original application contributions use the [MIT license](LICENSE). The anatomy assets and third-party dependencies retain their own licenses; see the [anatomy notices](public/anatomy/ATTRIBUTION.md) and [supplement notice](public/anatomy/SUPPLEMENT-NOTICE.md). Do not relicense third-party models as application code.
