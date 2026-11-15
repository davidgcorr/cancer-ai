# onco-milver catalog source audit

Source review date: 2026-11-15. Educational catalog, not clinical validation.

## Scope

This audit expands the original selective example catalog to 121 entries in the male model and 136 in the female model. It includes major and selected rare histologies or disease lineages for the 17 existing regions. Some entries are umbrella groups (such as cutaneous melanoma and epithelial ovarian carcinoma) alongside finer entries. They overlap and must not be added together. Molecular subgroups, histologic variants, pediatric entities and rare WHO/ICD-O entities are not comprehensively enumerated. Benign lesions, LCIS and other non-cancer risk lesions are not represented as invasive cancers.

No claim of a complete WHO or ICD-O catalog is made. NCI patient/health-professional summaries, SEER histology definitions and selected primary registry publications are the source framework. Specific sources are attached to every entry, its treatments and any numerical estimate.

| Region | Male entries | Female entries | Female-model entries with numerical estimates |
|---|---:|---:|---:|
| Brain | 6 | 6 | 0 |
| Head & neck | 6 | 6 | 3 |
| Thyroid | 7 | 7 | 5 |
| Lungs | 11 | 11 | 3 |
| Breast | 13 | 13 | 6 |
| Esophagus | 4 | 4 | 2 |
| Stomach | 8 | 8 | 4 |
| Liver | 5 | 5 | 4 |
| Pancreas | 8 | 8 | 1 |
| Colon & rectum | 7 | 7 | 2 |
| Kidneys | 8 | 8 | 2 |
| Bladder | 4 | 4 | 1 |
| Uterus & ovaries | 3 | 18 | 2 |
| Skin | 10 | 10 | 0 |
| Bones | 5 | 5 | 0 |
| Blood & bone marrow | 8 | 8 | 0 |
| Lymphatic system | 8 | 8 | 1 |

## Source framework

- Cancer definitions and treatments: https://www.cancer.gov/types
- Histologic classification, lung: https://www.cancer.gov/types/lung/hp/non-small-cell-lung-treatment-pdq
- Thyroid histology: https://www.cancer.gov/types/thyroid/hp/thyroid-treatment-pdq
- Salivary gland histology: https://www.cancer.gov/types/head-and-neck/hp/adult/salivary-gland-treatment-pdq
- Bone sarcoma treatment distinctions: https://www.cancer.gov/types/bone/bone-fact-sheet
- Rare renal tumor histology: https://www.cancer.gov/types/kidney/hp/kidney-treatment-pdq
- Blood and lymphatic entities: https://www.cancer.gov/types/leukemia and https://www.cancer.gov/types/lymphoma

## Frequency interpretation

Registry percentages are historical, site-specific distributions among histologically confirmed cases, not current prevalence or individual risk. Population, sex restrictions, time period and denominator accompany every value. The historical SEER tables exclude hematologic malignancies, Kaposi sarcoma and mesothelioma from those site denominators; consult the table footnotes and ICD-O group definitions. Current diagnostic groupings may not map one-to-one to historical codes. Female breast values are not applied to the male model.

- Historical site histologies: SEER 18, all races, 2011–2015; relevant tables/pages are linked per estimate: https://seer.cancer.gov/archive/csr/1975_2015/results_merged/topic_histologic_tabs.pdf
- U.S. lung histologies: CDC/USCS, 2022: https://www.cdc.gov/united-states-cancer-statistics/publications/lung-cancer-types.html
- Bladder overview threshold: https://training.seer.cancer.gov/bladder/types-of-bladder-histologies.html
- Adult clear cell RCC overview (denominator is RCC, not all kidney cancers): https://www.cancer.gov/pediatric-adult-rare-tumor/rare-tumors/rare-kidney-tumors/clear-cell-renal-cell-carcinoma
- Pancreatic ductal overview: https://www.cancer.gov/types/pancreatic/what-is-pancreatic-cancer

Frequency badges and report sections are hidden when no comparable sourced estimate is available. It never means zero. Entries from different denominators or cohorts must not be combined into a normalized distribution. Sankey widths continue to count classification relationships, not incidence.

## Treatments and classifications

Treatment summaries list broad options, with subtype-specific exceptions, and do not prescribe a regimen, dose, sequence or individual plan. A stage detail inherits its subtype’s educational options and explicitly links to disease-specific guidance; it is not a stage-specific prescription. Radioactive iodine is not presented as a treatment for medullary thyroid cancer; CML, CLL, APL, GIST, neuroendocrine tumors, bone sarcomas and germ-cell tumors have distinct summaries.

Rare entities without an implemented appropriate stage system are labeled for specialist classification instead of receiving invented I–IV stages. Stages, tumor grades, phases, disease status and risk assessments remain separate. Shared stage nodes require the user to choose the actual parent subtype before showing breadcrumbs.

Additional NCI overview estimates reviewed on 2026-11-15: papillary RCC (≈15% of RCC), fibrolamellar carcinoma (1–5% of liver cancers), mantle cell lymphoma (≈5% of U.S. NHL), salivary mucoepidermoid carcinoma (29–34% of malignant salivary tumors), and historical AFIP acinic/adenoid cystic salivary series (17%/≈7.5%, with their distinct denominators). Ranges are not converted to midpoint estimates. Sources and cohort restrictions are attached to each record in `cancer-evidence.ts` and exposed in subtype details and reports.
