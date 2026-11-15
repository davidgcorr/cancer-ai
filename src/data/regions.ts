export type Gender = 'male' | 'female'
export type RegionId = 'brain' | 'thyroid' | 'lungs' | 'breast' | 'liver' | 'colorectal' | 'pelvis'
export type Region = { id: RegionId; name: string; system: string; description: string; types: string[]; source: string }
export function getRegions(gender: Gender): Region[] {
  return [
    { id: 'brain', name: 'Brain', system: 'Nervous system', description: 'Explore cancers that begin in the brain and other parts of the central nervous system.', types: ['Brain and central nervous system cancer'], source: 'brain' },
    { id: 'thyroid', name: 'Thyroid', system: 'Endocrine system', description: 'The thyroid is a small gland at the base of the neck. Explore cancer that begins in this gland.', types: ['Thyroid cancer'], source: 'thyroid' },
    { id: 'lungs', name: 'Lungs', system: 'Respiratory system', description: 'The lungs sit on either side of the chest. Lung cancers are grouped by the cells in which they begin.', types: ['Non-small cell lung cancer', 'Small cell lung cancer'], source: 'lung' },
    { id: 'breast', name: 'Breast', system: 'Breast tissue', description: 'Breast cancer starts in breast tissue and can occur in both women and men.', types: ['Breast cancer'], source: 'breast' },
    { id: 'liver', name: 'Liver', system: 'Digestive system', description: 'The liver is in the upper right abdomen. Explore primary liver cancer, which begins in the liver.', types: ['Liver cancer'], source: 'liver' },
    { id: 'colorectal', name: 'Colon & rectum', system: 'Digestive system', description: 'The colon and rectum form the large intestine. Cancers starting here are grouped as colorectal cancer.', types: ['Colon cancer', 'Rectal cancer'], source: 'colorectal' },
    { id: 'pelvis', name: gender === 'male' ? 'Prostate' : 'Uterus & ovaries', system: 'Reproductive system', description: gender === 'male' ? 'The prostate is a gland below the bladder. Explore cancer that begins in the prostate.' : 'Explore cancers that begin in the uterus, cervix, and ovaries in the pelvis.', types: gender === 'male' ? ['Prostate cancer'] : ['Endometrial cancer', 'Cervical cancer', 'Ovarian cancer'], source: gender === 'male' ? 'prostate' : 'uterine' },
  ]
}

export function getCancerUrl(type: string, fallback: string): string {
  const sources: Record<string, string> = { 'Endometrial cancer': 'uterine', 'Cervical cancer': 'cervical', 'Ovarian cancer': 'ovarian' }
  return `https://www.cancer.gov/types/${sources[type] ?? fallback}`
}
