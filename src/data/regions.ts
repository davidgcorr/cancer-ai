import { getTaxonomy } from './cancer-taxonomy.ts'
export type Gender = 'male' | 'female'
export type RegionId = 'brain' | 'thyroid' | 'lungs' | 'breast' | 'liver' | 'colorectal' | 'pelvis' | 'skin' | 'bones' | 'blood' | 'lymph' | 'kidneys' | 'bladder' | 'pancreas' | 'stomach' | 'esophagus' | 'headneck'
export type Region = { id: RegionId; name: string; system: string; description: string; types: string[]; source: string }
export function getRegions(gender: Gender): Region[] {
  const regions: Region[] = [
    { id: 'brain', name: 'Brain', system: 'Nervous system', description: 'Explore selected primary brain tumors. Tumor grade is different from cancer stage.', types: ['Glioma'], source: 'brain' },
    { id: 'headneck', name: 'Head & neck', system: 'Head and neck', description: 'Selected cancers of the oral cavity and larynx. Staging depends on the exact primary site.', types: ['Head and neck cancer'], source: 'head-and-neck' },
    { id: 'thyroid', name: 'Thyroid', system: 'Endocrine system', description: 'Thyroid cancer classification depends on histology; age also affects differentiated thyroid cancer stage.', types: ['Differentiated thyroid cancer', 'Medullary thyroid cancer', 'Anaplastic thyroid cancer'], source: 'thyroid' },
    { id: 'lungs', name: 'Lungs', system: 'Respiratory system', description: 'Explore the main lung cancer groups and their histologic subtypes.', types: ['Non-small cell lung cancer', 'Small cell lung cancer'], source: 'lung' },
    { id: 'breast', name: 'Breast', system: 'Breast tissue', description: 'Breast cancer can occur in both women and men. Histology and biomarkers are separate ways of classifying it.', types: ['Invasive breast cancer', 'Ductal carcinoma in situ'], source: 'breast' },
    { id: 'esophagus', name: 'Esophagus', system: 'Digestive system', description: 'The esophagus carries food to the stomach. Its main cancer types arise in different lining cells.', types: ['Esophageal cancer'], source: 'esophageal' },
    { id: 'stomach', name: 'Stomach', system: 'Digestive system', description: 'Selected gland-forming stomach cancers. Other stomach tumor types are not included in this map.', types: ['Gastric adenocarcinoma'], source: 'stomach' },
    { id: 'liver', name: 'Liver', system: 'Digestive system', description: 'Primary liver cancer begins in the liver; cancer that spreads here keeps the name of its original site.', types: ['Primary liver cancer'], source: 'liver' },
    { id: 'pancreas', name: 'Pancreas', system: 'Digestive and endocrine systems', description: 'Pancreatic cancers include exocrine cancers and pancreatic neuroendocrine tumors.', types: ['Exocrine pancreatic cancer', 'Pancreatic neuroendocrine tumor'], source: 'pancreatic' },
    { id: 'colorectal', name: 'Colon & rectum', system: 'Digestive system', description: 'Selected cancers of the large intestine. The model combines the colon and rectum in one mesh.', types: ['Colorectal cancer'], source: 'colorectal' },
    { id: 'kidneys', name: 'Kidneys', system: 'Urinary system', description: 'Explore selected renal cell cancers, which begin in the kidney tubules.', types: ['Renal cell carcinoma'], source: 'kidney' },
    { id: 'bladder', name: 'Bladder', system: 'Urinary system', description: 'The bladder stores urine. Urothelial carcinoma is its main cancer type.', types: ['Bladder cancer'], source: 'bladder' },
    { id: 'pelvis', name: gender === 'male' ? 'Prostate' : 'Uterus & ovaries', system: 'Reproductive system', description: gender === 'male' ? 'Explore prostate cancer histology and broad stage groups.' : 'Explore selected cancers of the uterus, cervix, and ovaries.', types: gender === 'male' ? ['Prostate cancer'] : ['Endometrial cancer', 'Cervical cancer', 'Ovarian cancer'], source: gender === 'male' ? 'prostate' : 'uterine' },
    { id: 'skin', name: 'Skin', system: 'Integumentary system', description: 'Skin covers the whole body. Melanoma, basal cell carcinoma, and cutaneous squamous cell carcinoma have different classification systems.', types: ['Melanoma', 'Keratinocyte cancer'], source: 'skin' },
    { id: 'bones', name: 'Bones', system: 'Skeletal system', description: 'Primary bone cancers begin in bone. They are different from cancers that spread to bone from another site.', types: ['Primary bone sarcoma'], source: 'bone' },
    { id: 'blood', name: 'Blood & bone marrow', system: 'Hematopoietic system', description: 'Leukemia and myeloma involve blood-forming cells and bone marrow. They are systemic diseases, not a tumor at one body point.', types: ['Leukemia', 'Multiple myeloma'], source: 'leukemia' },
    { id: 'lymph', name: 'Lymphatic system', system: 'Immune system', description: 'Lymphomas develop in lymphocytes and can involve lymph nodes, spleen, marrow, and other organs throughout the body.', types: ['Lymphoma'], source: 'lymphoma' },
  ]
  return regions.map(region=>({...region,types:getTaxonomy(region.id,gender).map(family=>family.label)}))
}
export function getCancerUrl(type: string, fallback: string): string {
  const sources: Record<string, string> = { 'Endometrial cancer': 'uterine', 'Cervical cancer': 'cervical', 'Ovarian cancer': 'ovarian', 'Multiple myeloma': 'myeloma', 'Melanoma': 'skin', 'Pancreatic neuroendocrine tumor': 'pancreatic' }
  return `https://www.cancer.gov/types/${sources[type] ?? fallback}`
}
