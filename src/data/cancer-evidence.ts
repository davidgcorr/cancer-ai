import type { RegionId, Gender } from './regions'
export const REVIEWED_ON='2026-11-15'
export type Frequency = { value?: number; min?:number; max?:number; qualifier?: 'reported'|'approximate'|'greater'|'range'; denominator:string; population:string; period:string; source:string; note:string }
export type Treatment = { modalities:string[]; context:string; source:string; reviewedOn:string }
export const FREQUENCY_MISSING='No comparable percentage is curated for this entry. Missing data does not mean 0%.'
export const TREATMENT_NOTE='Educational options, not a treatment plan. Selection depends on stage, pathology, biomarkers, prior therapy, and fitness; not every option applies.'
const seer='https://seer.cancer.gov/archive/csr/1975_2015/results_merged/topic_histologic_tabs.pdf'
const registry=(value:number,denominator:string,page:number):Frequency=>({value,qualifier:'reported',denominator,population:'U.S. SEER 18 registries; all races',period:'2011–2015',source:`${seer}#page=${page}`,note:'Historical registry distribution among histologically confirmed cases; table exclusions apply. It is not current prevalence or personal risk.'})
const site=(part:string)=>`Histologically confirmed invasive ${part} cancers; both sexes`
const breast='Histologically confirmed invasive female breast cancers'
const ovarian='Histologically confirmed invasive ovarian cancers'
const cdc=(value:number):Frequency=>({value,qualifier:'reported',denominator:'All new lung cancer cases',population:'United States; both sexes',period:'2022',source:'https://www.cdc.gov/united-states-cancer-statistics/publications/lung-cancer-types.html',note:'CDC/USCS histology groups; categories not shown remain in the denominator. Not a personal risk estimate.'})
const overview=(value:number,denominator:string,source:string,population='NCI clinical overview'):Frequency=>({value,qualifier:'approximate',denominator,population,period:'Period not specified by source',source,note:'Approximate clinical overview, not a matched registry cohort.'})
const salivarySource='https://www.cancer.gov/types/head-and-neck/hp/adult/salivary-gland-treatment-pdq'
const afipNote='Historical AFIP case series cited by NCI; not a population registry or a percentage of all head and neck cancers.'
const frequencies:Record<string,Frequency>={
 'papillary-rcc':overview(15,'All renal cell carcinomas; not all kidney cancers','https://www.cancer.gov/pediatric-adult-rare-tumor/rare-tumors/rare-kidney-tumors/papillary-renal-cell-carcinoma'),
 fibrolamellar:{min:1,max:5,qualifier:'range',denominator:'All liver cancers',population:'NCI clinical overview',period:'Period not specified by source',source:'https://www.cancer.gov/pediatric-adult-rare-tumor/rare-tumors/rare-digestive-system-tumors/fibrolamellar-hepatocellular-carcinoma',note:'Estimated range; NCI notes limited data. Not a matched registry cohort.'},
 'salivary-muco':{min:29,max:34,qualifier:'range',denominator:'Malignant tumors of major and minor salivary glands',population:'Published series summarized by NCI',period:'Period not specified by source',source:salivarySource,note:'Range across published series; not a percentage of all head and neck cancers.'},
 'salivary-acinic':{value:17,qualifier:'reported',denominator:'Primary malignant salivary gland tumors in AFIP data',population:'AFIP case series summarized by NCI',period:'Period not specified by source',source:salivarySource,note:afipNote},
 'salivary-adenoid':{value:7.5,qualifier:'approximate',denominator:'Epithelial salivary gland malignancies in AFIP data',population:'AFIP case series summarized by NCI',period:'Period not specified by source',source:salivarySource,note:afipNote},
 mantle:overview(5,'All non-Hodgkin lymphomas; not all lymphomas','https://www.cancer.gov/types/lymphoma/hp/mantle-cell-lymphoma-treatment','United States; NCI clinical overview'),
 'lung-adeno':cdc(45),'lung-squamous':cdc(21),'small-cell':cdc(12),'sclc':cdc(12),
 papillary:registry(89.8,site('thyroid'),18),follicular:registry(4.5,site('thyroid'),18),'oncocytic-thyroid':registry(1.8,site('thyroid'),18),'medullary-carcinoma':registry(1.6,site('thyroid'),18),medullary:registry(1.6,site('thyroid'),18),'anaplastic-carcinoma':registry(.8,site('thyroid'),18),anaplastic:registry(.8,site('thyroid'),18),
 ductal:registry(73.4,breast,1),lobular:registry(9.5,breast,1),'breast-mixed':registry(9.0,breast,1),'breast-mucinous':registry(1.9,breast,1),'breast-tubular':registry(.5,breast,1),phyllodes:registry(.2,breast,2),
 'esophageal-adeno':registry(63.5,site('esophageal'),7),'esophageal-scc':registry(31.6,site('esophageal'),7),
 hcc:registry(71.5,site('liver and intrahepatic bile duct'),8),ihcc:registry(21.9,site('liver and intrahepatic bile duct'),8),hepatoblastoma:registry(1.0,site('liver and intrahepatic bile duct'),8),
 'colorectal-mucinous':registry(6.3,site('colorectal'),5),'colorectal-signet':registry(1.1,site('colorectal'),5),
 intestinal:registry(8.4,site('stomach'),16),diffuse:registry(4.0,site('stomach'),16),'gastric-signet':registry(16.3,site('stomach'),16),'gastric-mucinous':registry(1.2,site('stomach'),16),
 'ovarian-clear':registry(5.6,ovarian,13),'ovarian-endometrioid':registry(9.7,ovarian,13),
 'clear-cell':{value:80,qualifier:'approximate',denominator:'Adult renal cell carcinomas; not all kidney cancers',population:'Adults; NCI clinical overview',period:'Period not specified by source',source:'https://www.cancer.gov/pediatric-adult-rare-tumor/rare-tumors/rare-kidney-tumors/clear-cell-renal-cell-carcinoma',note:'Approximate clinical overview, not a matched registry cohort.'},
 urothelial:{value:90,qualifier:'greater',denominator:'All bladder cancers',population:'NCI/SEER clinical overview',period:'Period not specified by source',source:'https://training.seer.cancer.gov/bladder/types-of-bladder-histologies.html',note:'The source reports more than 90%; this is a threshold, not an exact point estimate.'},
 'pancreatic-ductal':{value:90,qualifier:'approximate',denominator:'All pancreatic cancers',population:'NCI clinical overview',period:'Period not specified by source',source:'https://www.cancer.gov/types/pancreatic/what-is-pancreatic-cancer',note:'Approximate clinical overview, not a matched registry cohort.'},
}
export function frequencyFor(id:string,region:RegionId,gender:Gender,source:string):Frequency {
 const found=frequencies[id]
 if(found&&!(region==='breast'&&gender==='male'))return {...found}
 return {denominator:'No matched denominator curated',population:'Not available',period:'Not available',source,note:FREQUENCY_MISSING}
}
const modalities={
 brain:['Surgery','Radiation therapy','Chemotherapy','Molecularly selected targeted therapy'],
 headneck:['Surgery','Radiation therapy','Chemotherapy','Immunotherapy for eligible disease'],
 thyroid:['Surgery','Radioactive iodine for iodine-avid disease','Thyroid hormone therapy','Targeted therapy for eligible advanced disease'],
 lungs:['Surgery for operable disease','Radiation therapy','Chemotherapy','Biomarker-guided targeted therapy','Immunotherapy for eligible disease'],
 breast:['Surgery','Radiation therapy','Hormone therapy for receptor-positive disease','HER2-directed therapy when indicated','Chemotherapy','Immunotherapy for eligible disease'],
 esophagus:['Endoscopic treatment for selected early disease','Surgery','Chemoradiation','Biomarker-guided systemic therapy'],
 stomach:['Surgery','Chemotherapy','Biomarker-guided targeted therapy','Immunotherapy for eligible disease'],
 liver:['Resection or transplant in selected patients','Ablation or embolization','Immunotherapy or targeted systemic therapy'],
 pancreas:['Surgery for resectable disease','Chemotherapy','Radiation therapy in selected settings','Molecularly selected targeted therapy'],
 colorectal:['Surgery','Chemotherapy','Biomarker-guided targeted therapy','Immunotherapy for eligible disease','Radiation therapy for selected rectal cancers'],
 kidneys:['Surgery or ablation for selected localized tumors','Active surveillance in selected patients','Immunotherapy or targeted systemic therapy'],
 bladder:['Endoscopic resection','Intravesical therapy for eligible non-muscle-invasive disease','Cystectomy or bladder-preserving chemoradiation','Systemic therapy for eligible advanced disease'],
 pelvis:['Surgery','Radiation therapy','Stage- and biomarker-directed systemic therapy'],
 skin:['Surgical excision','Radiation therapy in selected settings','Immunotherapy for eligible disease','Molecularly selected targeted therapy'],
 bones:['Specialist surgery','Chemotherapy for sensitive histologies','Radiation therapy in selected settings'],
 blood:['Subtype-directed systemic therapy','Stem cell transplantation in selected patients','Supportive care'],
 lymph:['Observation for selected indolent disease','Immunotherapy or targeted therapy','Chemotherapy','Radiation therapy in selected settings'],
} satisfies Record<RegionId,string[]>
const sourceFor:Partial<Record<RegionId,string>>={breast:'https://www.cancer.gov/types/breast/treatment',bladder:'https://www.cancer.gov/types/bladder/patient/bladder-treatment-pdq',bones:'https://www.cancer.gov/types/bone/bone-fact-sheet'}
const overrides:Record<string,string[]>={
 'small-cell':['Chemotherapy','Radiation therapy','Immunotherapy in eligible settings'],
 'lung-lcnec':['Specialist surgery for operable disease','Platinum-based chemotherapy in selected settings','Radiation therapy'],
 'typical-carcinoid':['Surgery','Somatostatin-based or other systemic therapy for selected advanced disease'],
 'atypical-carcinoid':['Surgery','Somatostatin-based or other systemic therapy for selected advanced disease'],
 'collecting-duct':['Platinum-based chemotherapy','Specialist surgery in selected cases'],
 'renal-medullary':['Platinum-based chemotherapy','Specialist surgery in selected cases'],
 'medullary-carcinoma':['Surgery','Targeted therapy for eligible advanced disease','Radiation therapy in selected settings'],
 'anaplastic-carcinoma':['Molecularly selected targeted therapy','Surgery when feasible','Radiation therapy','Chemotherapy'],
 'oncocytic-thyroid':['Surgery','Radioactive iodine only when iodine uptake is demonstrated','Targeted therapy for eligible advanced disease'],
 'salivary-adenoid':['Surgery','Radiation therapy','Specialist systemic therapy for advanced disease'],
 'salivary-muco':['Surgery','Radiation therapy','Specialist systemic therapy for advanced disease'],
 'salivary-acinic':['Surgery','Radiation therapy','Specialist systemic therapy for advanced disease'],
 'salivary-duct':['Surgery','Radiation therapy','Biomarker-guided systemic therapy'],
 'phyllodes':['Surgery with appropriate margins','Radiation therapy in selected settings'],
 'breast-angiosarcoma':['Specialist surgery','Sarcoma-directed systemic therapy','Radiation therapy in selected settings'],
 'dcis-sub':['Breast-conserving surgery with radiation when indicated','Mastectomy in selected cases','Risk-reducing endocrine therapy when indicated'],
 'gastric-gist':['Surgery','Mutation-guided tyrosine kinase inhibitors'],
 'gastric-malt':['Helicobacter pylori eradication when indicated','Radiation therapy','Lymphoma-directed systemic therapy when needed'],
 'gastric-net':['Endoscopic or surgical resection in selected cases','Somatostatin-based or other systemic therapy for selected advanced disease'],
 pnet:['Surgery','Somatostatin-based or other systemic therapy for selected advanced disease','Peptide receptor radionuclide therapy when eligible'],
 'pancreatic-nec-small':['Platinum-based chemotherapy','Specialist local treatment in selected cases'],
 'pancreatic-nec-large':['Platinum-based chemotherapy','Specialist local treatment in selected cases'],
 'colorectal-nec':['Platinum-based chemotherapy','Specialist local treatment in selected cases'],
 'colorectal-net':['Endoscopic or surgical resection in selected cases','Somatostatin-based or other systemic therapy for selected advanced disease'],
 ihcc:['Surgery when resectable','Chemotherapy with immunotherapy in eligible settings','Molecularly selected targeted therapy'],
 'combined-hcc-cca':['Specialist multidisciplinary assessment','Surgery when feasible','Individualized systemic therapy'],
 fibrolamellar:['Surgery when feasible','Specialist systemic therapy or clinical trials'],
 hepatoblastoma:['Pediatric liver surgery or transplant','Chemotherapy'],
 wilms:['Pediatric renal surgery','Chemotherapy','Radiation therapy in selected settings'],
 acinar:['Active surveillance for selected low-risk disease','Surgery or radiation therapy','Androgen-deprivation therapy when indicated','Systemic therapy for eligible advanced disease'],
 'prostate-ductal':['Surgery or radiation therapy','Androgen-deprivation therapy when indicated','Systemic therapy for eligible advanced disease'],
 'prostate-small':['Platinum-based chemotherapy','Specialist local treatment in selected cases'],
 'endometrioid':['Surgery','Radiation therapy','Chemotherapy','Hormone therapy or immunotherapy in selected settings'],
 'uterine-serous':['Surgery','Chemotherapy','Radiation therapy in selected settings','Biomarker-guided systemic therapy'],
 'endometrial-clear':['Surgery','Chemotherapy','Radiation therapy in selected settings','Biomarker-guided systemic therapy'],
 'endometrial-carcinosarcoma':['Surgery','Chemotherapy','Radiation therapy in selected settings'],
 'cervical-scc':['Surgery for selected early disease','Chemoradiation','Systemic therapy for eligible advanced disease'],
 'cervical-adeno':['Surgery for selected early disease','Chemoradiation','Systemic therapy for eligible advanced disease'],
 'cervical-adeno-scc':['Surgery for selected early disease','Chemoradiation','Systemic therapy for eligible advanced disease'],
 'cervical-nec':['Platinum-based chemotherapy','Specialist local treatment in selected cases'],
 'ovarian-dysgerminoma':['Fertility-sparing surgery when appropriate','Germ-cell-directed chemotherapy when indicated'],
 'ovarian-yolk':['Fertility-sparing surgery when appropriate','Germ-cell-directed chemotherapy when indicated'],
 'ovarian-immature':['Fertility-sparing surgery when appropriate','Germ-cell-directed chemotherapy when indicated'],
 'ovarian-granulosa':['Surgery','Hormonal or other systemic therapy in selected recurrent disease'],
 bcc:['Excision or Mohs surgery','Local treatment for selected superficial lesions','Hedgehog-pathway or immune therapy for eligible advanced disease'],
 'skin-scc':['Excision or Mohs surgery','Radiation therapy','Immunotherapy for eligible advanced disease'],
 merkel:['Surgery','Radiation therapy','Immunotherapy for eligible advanced disease'],
 kaposi:['Antiretroviral therapy for HIV-associated disease','Local treatment','Systemic chemotherapy in selected disease'],
 'cutaneous-t':['Skin-directed therapy','Radiation therapy','Lymphoma-directed systemic therapy when needed'],
 chondrosarcoma:['Specialist surgery','Radiation therapy in selected settings','Chemotherapy only for selected sensitive variants'],
 chordoma:['Specialist surgery','High-dose radiation therapy in selected settings'],
 ewing:['Multiagent chemotherapy','Surgery or radiation for local control'],
 osteosarcoma:['Multiagent chemotherapy','Specialist surgery'],
 'ups-bone':['Multiagent chemotherapy','Specialist surgery'],
 all:['Multiagent chemotherapy with CNS-directed treatment','Targeted or immune therapy when indicated','Stem cell transplantation in selected patients'],
 aml:['Chemotherapy','Molecularly selected targeted therapy','Stem cell transplantation in selected patients'],
 apl:['Differentiation therapy with retinoic acid and arsenic-based treatment','Chemotherapy in selected risk groups'],
 cll:['Observation for asymptomatic disease','BTK- or BCL2-directed therapy when treatment is indicated','Antibody-based therapy in selected combinations'],
 cml:['BCR::ABL1 tyrosine kinase inhibitors','Stem cell transplantation in selected resistant or advanced disease'],
 'hairy-cell':['Observation for asymptomatic disease','Purine-analogue or other systemic therapy','Antibody or targeted therapy in selected settings'],
 'mixed-phenotype':['Specialist acute-leukemia systemic therapy','Stem cell transplantation in selected patients'],
 'plasma-myeloma':['Combination anti-myeloma systemic therapy','Autologous stem cell transplantation when eligible','Immune or targeted therapy in selected settings'],
 hodgkin:['Combination systemic therapy','Radiation therapy in selected settings','Immune or targeted therapy for selected relapsed disease'],
 dlbcl:['Antibody-based combination chemotherapy','Cellular or other immune therapy in selected relapsed disease'],
 burkitt:['Intensive systemic therapy with CNS-directed treatment','Antibody therapy when indicated'],
 'peripheral-t':['Subtype-directed systemic therapy','Stem cell transplantation in selected patients'],
 'anaplastic-lymphoma':['Subtype-directed systemic therapy','Targeted antibody-drug therapy when indicated'],
}
export function treatmentFor(region:RegionId,id:string,source:string):Treatment {
 let options=overrides[id]??modalities[region]
 if(id.startsWith('ovarian-')||id==='epithelial-ovarian')options=overrides[id]??['Surgery','Platinum-based chemotherapy','Biomarker-directed maintenance or systemic therapy']
 return {modalities:[...options],context:TREATMENT_NOTE,source:sourceFor[region]??source,reviewedOn:REVIEWED_ON}
}
