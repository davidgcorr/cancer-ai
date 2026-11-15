import type { CancerFamily, CancerSubtype, Classification } from './cancer-taxonomy'
import type { Gender, RegionId } from './regions'
const expert: Classification = { system:'Specialist classification', labels:['Histology-specific assessment'], note:'This rare entity requires its own pathology and staging or risk system. A generic stage I–IV sequence is not assigned.' }
const stages: Classification = {system:'Broad stage groups',labels:['Stage I','Stage II','Stage III','Stage IV'],note:'Selected broad stage groups, not a staging calculator. Clinical and pathological staging, biomarkers, and substages require disease-specific assessment.'}
const s=(id:string,label:string,path:string,classification=stages):CancerSubtype=>({id,label,source:`https://www.cancer.gov/${path.startsWith('types/')?path:`types/${path}`}`,classification})
const f=(id:string,label:string,subtypes:CancerSubtype[]):CancerFamily=>({id,label,subtypes})
export function expandTaxonomy(region:RegionId,gender:Gender,base:CancerFamily[]):CancerFamily[] {
 const result=base.map(family=>({...family,subtypes:[...family.subtypes]}))
 const add=(familyId:string,items:CancerSubtype[])=>{const target=result.find(x=>x.id===familyId);if(target)target.subtypes.push(...items)}
 switch(region){
 case 'brain':
  result.push(f('other-cns','Other malignant CNS tumors',[s('ependymoma','Ependymoma','brain/patient/adult-brain-treatment-pdq',expert),s('medulloblastoma','Medulloblastoma','brain/patient/adult-brain-treatment-pdq',expert),s('meningioma-grade3','Meningioma, CNS WHO grade 3','brain/patient/adult-brain-treatment-pdq',{system:'CNS WHO grade (not stage)',labels:['Grade 3'],note:'CNS WHO grade describes tumor biology; it is not a measure of spread or a TNM cancer stage.'})]))
  break
 case 'headneck':
  result.push(f('salivary','Salivary gland carcinoma',[s('salivary-adenoid','Adenoid cystic carcinoma','head-and-neck/patient/adult/salivary-gland-treatment-pdq'),s('salivary-muco','Mucoepidermoid carcinoma','head-and-neck/patient/adult/salivary-gland-treatment-pdq'),s('salivary-acinic','Acinic cell carcinoma','head-and-neck/patient/adult/salivary-gland-treatment-pdq'),s('salivary-duct','Salivary duct carcinoma','head-and-neck/patient/adult/salivary-gland-treatment-pdq')]))
  break
 case 'thyroid':
  add('differentiated',[s('oncocytic-thyroid','Oncocytic (Hürthle cell) carcinoma','thyroid/hp/thyroid-treatment-pdq',base[0].subtypes[0].classification)])
  result.push(f('poorly-differentiated-thyroid','High-grade follicular-cell thyroid cancer',[s('poorly-thyroid','Poorly differentiated thyroid carcinoma','thyroid/hp/thyroid-treatment-pdq',expert),s('high-grade-thyroid','Differentiated high-grade thyroid carcinoma','thyroid/hp/thyroid-treatment-pdq',expert)]))
  break
 case 'lungs':
  add('nsclc',[s('lung-adenosquamous','Adenosquamous carcinoma','lung/hp/non-small-cell-lung-treatment-pdq'),s('lung-sarcomatoid','Pulmonary sarcomatoid carcinoma','lung/hp/non-small-cell-lung-treatment-pdq'),s('lung-salivary','Salivary gland-type lung carcinoma','lung/hp/non-small-cell-lung-treatment-pdq'),s('lung-unclassified','Non-small cell carcinoma, unclassified','lung/hp/non-small-cell-lung-treatment-pdq')])
  result.push(f('pulmonary-net','Other pulmonary neuroendocrine tumors',[s('typical-carcinoid','Typical pulmonary carcinoid','lung/hp/non-small-cell-lung-treatment-pdq'),s('atypical-carcinoid','Atypical pulmonary carcinoid','lung/hp/non-small-cell-lung-treatment-pdq'),s('lung-lcnec','Large cell neuroendocrine carcinoma','lung/hp/non-small-cell-lung-treatment-pdq')]))
  break
 case 'breast':
  add('invasive-breast',[s('breast-mixed','Mixed ductal and lobular carcinoma','breast'),s('breast-tubular','Tubular carcinoma','breast'),s('breast-mucinous','Mucinous carcinoma','breast'),s('breast-cribriform','Invasive cribriform carcinoma','breast'),s('breast-micropapillary','Invasive micropapillary carcinoma','breast'),s('breast-papillary','Invasive papillary carcinoma','breast'),s('breast-metaplastic','Metaplastic carcinoma','breast'),s('breast-adenoid','Adenoid cystic breast carcinoma','breast')])
  result.push(f('other-breast','Other malignant breast tumors',[s('phyllodes','Malignant phyllodes tumor','breast',expert),s('breast-angiosarcoma','Breast angiosarcoma','soft-tissue-sarcoma/patient/adult-soft-tissue-treatment-pdq',expert)]))
  break
 case 'esophagus': add('esophageal',[s('esophageal-adeno-scc','Adenosquamous carcinoma','esophageal/hp/esophageal-treatment-pdq'),s('esophageal-nec','Esophageal neuroendocrine carcinoma','esophageal/hp/esophageal-treatment-pdq',expert)]);break
 case 'stomach':
  add('gastric',[s('gastric-signet','Signet-ring cell carcinoma','stomach/hp/stomach-treatment-pdq'),s('gastric-mucinous','Mucinous gastric adenocarcinoma','stomach/hp/stomach-treatment-pdq'),s('gastric-papillary','Papillary gastric adenocarcinoma','stomach/hp/stomach-treatment-pdq')])
  result.push(f('gastric-other','Other gastric malignancies',[s('gastric-gist','Gastric gastrointestinal stromal tumor','soft-tissue-sarcoma/patient/gist-treatment-pdq',expert),s('gastric-malt','Gastric MALT lymphoma','lymphoma/patient/adult-nhl-treatment-pdq',expert),s('gastric-net','Gastric neuroendocrine tumor','gi-carcinoid-tumors/patient/gi-carcinoid-treatment-pdq',expert)]));break
 case 'liver':
  add('liver-primary',[s('ihcc','Intrahepatic cholangiocarcinoma','liver/bile-duct-cancer/treatment'),s('combined-hcc-cca','Combined hepatocellular-cholangiocarcinoma','liver/hp/adult-liver-treatment-pdq',expert),s('fibrolamellar','Fibrolamellar carcinoma','liver/hp/adult-liver-treatment-pdq'),s('hepatoblastoma','Hepatoblastoma','liver/patient/child-liver-treatment-pdq',expert)]);break
 case 'pancreas':
  add('exocrine',[s('pancreas-acinar','Acinar cell carcinoma','pancreatic/hp/pancreatic-treatment-pdq'),s('pancreas-adenosquamous','Pancreatic adenosquamous carcinoma','pancreatic/hp/pancreatic-treatment-pdq'),s('pancreas-colloid','Colloid carcinoma','pancreatic/what-is-pancreatic-cancer'),s('pancreas-undifferentiated','Undifferentiated pancreatic carcinoma','pancreatic/hp/pancreatic-treatment-pdq')])
  result.push(f('pancreatic-nec','Pancreatic neuroendocrine carcinoma',[s('pancreatic-nec-small','Pancreatic small cell neuroendocrine carcinoma','pancreatic/patient/pnet-treatment-pdq',expert),s('pancreatic-nec-large','Pancreatic large cell neuroendocrine carcinoma','pancreatic/patient/pnet-treatment-pdq',expert)]));break
 case 'colorectal':
  add('colorectal',[s('colorectal-mucinous','Mucinous colorectal adenocarcinoma','colorectal/patient/colon-treatment-pdq'),s('colorectal-signet','Signet-ring colorectal carcinoma','colorectal/patient/colon-treatment-pdq'),s('colorectal-adeno-scc','Colorectal adenosquamous carcinoma','colorectal/hp/colon-treatment-pdq')])
  result.push(f('colorectal-neuroendocrine','Colorectal neuroendocrine neoplasms',[s('colorectal-net','Well-differentiated colorectal NET','gi-carcinoid-tumors/patient/gi-carcinoid-treatment-pdq'),s('colorectal-nec','Colorectal neuroendocrine carcinoma','gi-carcinoid-tumors/hp/gi-carcinoid-treatment-pdq',expert)]));break
 case 'kidneys':
  add('rcc',[s('collecting-duct','Collecting duct carcinoma','kidney/hp/kidney-treatment-pdq'),s('renal-medullary','Renal medullary carcinoma','kidney/hp/kidney-treatment-pdq'),s('translocation-rcc','Translocation-associated RCC','kidney/hp/kidney-treatment-pdq'),s('unclassified-rcc','Unclassified renal cell carcinoma','kidney/hp/kidney-treatment-pdq')])
  result.push(f('childhood-kidney','Childhood renal malignancies',[s('wilms','Wilms tumor','kidney/patient/wilms-treatment-pdq',{system:'Wilms stage',labels:['Stage I','Stage II','Stage III','Stage IV','Stage V'],note:'Wilms tumor uses a childhood renal staging system. Stage V denotes bilateral renal involvement; adult RCC staging must not be substituted.'})]));break
 case 'bladder': add('bladder-cancer',[s('bladder-scc','Bladder squamous cell carcinoma','bladder/hp/bladder-treatment-pdq'),s('bladder-adeno','Bladder adenocarcinoma','bladder/hp/bladder-treatment-pdq'),s('bladder-small','Bladder small cell carcinoma','bladder/hp/bladder-treatment-pdq')]);break
 case 'pelvis':
  if(gender==='male')add('prostate',[s('prostate-ductal','Ductal prostate adenocarcinoma','prostate/hp/prostate-treatment-pdq'),s('prostate-small','Small cell neuroendocrine prostate carcinoma','prostate/hp/prostate-treatment-pdq',expert)])
  else {
   add('endometrial',[s('endometrial-clear','Clear cell endometrial carcinoma','uterine/patient/endometrial-treatment-pdq'),s('endometrial-carcinosarcoma','Uterine carcinosarcoma','uterine/patient/endometrial-treatment-pdq')])
   add('cervical',[s('cervical-adeno-scc','Cervical adenosquamous carcinoma','cervical/hp/cervical-treatment-pdq'),s('cervical-nec','Cervical neuroendocrine carcinoma','cervical/hp/cervical-treatment-pdq',expert)])
   add('ovarian',[s('ovarian-high-serous','High-grade serous ovarian carcinoma','ovarian/patient/ovarian-epithelial-treatment-pdq'),s('ovarian-low-serous','Low-grade serous ovarian carcinoma','ovarian/patient/ovarian-epithelial-treatment-pdq'),s('ovarian-endometrioid','Endometrioid ovarian carcinoma','ovarian/patient/ovarian-epithelial-treatment-pdq'),s('ovarian-clear','Clear cell ovarian carcinoma','ovarian/patient/ovarian-epithelial-treatment-pdq'),s('ovarian-mucinous','Mucinous ovarian carcinoma','ovarian/patient/ovarian-epithelial-treatment-pdq'),s('ovarian-dysgerminoma','Dysgerminoma','ovarian/patient/ovarian-germ-cell-treatment-pdq'),s('ovarian-yolk','Ovarian yolk sac tumor','ovarian/patient/ovarian-germ-cell-treatment-pdq'),s('ovarian-immature','Immature ovarian teratoma','ovarian/patient/ovarian-germ-cell-treatment-pdq'),s('ovarian-granulosa','Granulosa cell tumor','ovarian')])
  }
  break
 case 'skin':
  add('melanoma',[s('superficial-melanoma','Superficial spreading melanoma','skin/hp/melanoma-treatment-pdq'),s('nodular-melanoma','Nodular melanoma','skin/hp/melanoma-treatment-pdq'),s('lentigo-melanoma','Lentigo maligna melanoma','skin/hp/melanoma-treatment-pdq'),s('acral-melanoma','Acral lentiginous melanoma','skin/hp/melanoma-treatment-pdq')])
  result.push(f('other-skin','Other cutaneous malignancies',[s('merkel','Merkel cell carcinoma','skin/patient/merkel-cell-treatment-pdq'),s('kaposi','Kaposi sarcoma','soft-tissue-sarcoma/patient/kaposi-treatment-pdq',expert),s('cutaneous-t','Cutaneous T-cell lymphoma','lymphoma/patient/mycosis-fungoides-treatment-pdq',expert)]));break
 case 'bones': add('bone-sarcoma',[s('chordoma','Chordoma','bone/bone-fact-sheet',expert),s('ups-bone','Undifferentiated pleomorphic sarcoma of bone','bone/patient/osteosarcoma-treatment-pdq',base[0].subtypes[0].classification)]);break
 case 'blood':
  add('leukemia',[s('apl','Acute promyelocytic leukemia','leukemia/hp/adult-aml-treatment-pdq',base[0].subtypes[1].classification),s('hairy-cell','Hairy cell leukemia','leukemia/patient/hairy-cell-treatment-pdq',expert),s('mixed-phenotype','Mixed phenotype acute leukemia','leukemia/hp/adult-all-treatment-pdq',base[0].subtypes[0].classification)])
  break
 case 'lymph': add('lymphoma',[s('mantle','Mantle cell lymphoma','lymphoma/patient/adult-nhl-treatment-pdq',base[0].subtypes[0].classification),s('marginal','Marginal zone lymphoma','lymphoma/patient/adult-nhl-treatment-pdq',base[0].subtypes[0].classification),s('burkitt','Burkitt lymphoma','lymphoma/patient/adult-nhl-treatment-pdq',base[0].subtypes[0].classification),s('peripheral-t','Peripheral T-cell lymphoma','lymphoma/patient/adult-nhl-treatment-pdq',base[0].subtypes[0].classification),s('anaplastic-lymphoma','Anaplastic large cell lymphoma','lymphoma/patient/adult-nhl-treatment-pdq',base[0].subtypes[0].classification)]);break
 }
 return result
}
