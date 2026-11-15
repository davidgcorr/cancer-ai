import * as THREE from 'three'
import { ANATOMY_BY_KEY, type AnatomyStructure } from 'open-anatomy-3d'
import maleUrl from 'open-anatomy-3d/models/anatomy-male.glb?url'
import femaleUrl from 'open-anatomy-3d/models/anatomy-female.glb?url'
import type { Gender, RegionId } from './regions'

export type AnatomyView = 'organs' | 'skeleton' | 'surface'
export const MODEL_URLS = { male: maleUrl, female: femaleUrl }
export const SUPPLEMENT_URLS = { male: `${import.meta.env.BASE_URL}anatomy/z-organs-male.glb`, female: `${import.meta.env.BASE_URL}anatomy/z-organs-female.glb` }
export const STRUCTURES: Record<string, AnatomyStructure> = { ...ANATOMY_BY_KEY,
  thyroid: {key:'thyroid',label:'Thyroid gland',system:'organs',category:'Endocrine',color:'#bd8164'},
  ...Object.fromEntries([
    ['lung_surface_l_upper','Superior lobe of left lung'],['lung_surface_l_lower','Inferior lobe of left lung'],
    ['lung_surface_r_upper','Superior lobe of right lung'],['lung_surface_r_middle','Middle lobe of right lung'],['lung_surface_r_lower','Inferior lobe of right lung'],
  ].map(([key,label])=>[key,{key,label,system:'organs',category:'Respiratory',color:'#c48f93'}])),
}
export function viewForRegion(id: RegionId): AnatomyView { return id === 'skin' ? 'surface' : id === 'bones' ? 'skeleton' : 'organs' }
export const regionMeshes = (gender: Gender): Record<RegionId, string[]> => ({
  brain: ['brain', 'cerebellum', 'brainstem'],
  headneck: ['tongue','larynx','salivary_glands','pharynx'],
  esophagus: ['esophagus'],
  stomach: ['stomach'],
  pancreas: ['pancreas'],
  kidneys: ['kidney_l','kidney_r'],
  bladder: ['bladder'],
  skin: ['skin'],
  bones: Object.values(STRUCTURES).filter(s=>s.system==='skeleton').map(s=>s.key),
  blood: [], // Blood-forming cells/marrow are not separately meshed. Never substitute vessels for leukemia.
  lymph: ['spleen','thymus'],
  thyroid: ['thyroid'],
  lungs: ['lung_surface_l_upper','lung_surface_l_lower','lung_surface_r_upper','lung_surface_r_middle','lung_surface_r_lower'],
  breast: gender === 'female' ? ['breast_l', 'breast_r'] : [],
  liver: ['liver'],
  colorectal: ['colon'],
  pelvis: gender === 'male' ? ['prostate'] : ['uterus', 'ovary_l', 'ovary_r', 'fallopian_tubes'],
})
export function regionForMesh(key: string, gender: Gender): RegionId | undefined {
  return (Object.entries(regionMeshes(gender)) as [RegionId, string[]][]).find(([, keys]) => keys.includes(key))?.[0]
}
export function coverageNote(id: RegionId, gender: Gender): string | undefined {
  if (id === 'blood') return 'Leukemia and myeloma involve blood-forming cells and marrow throughout the body. These tissues are not separately meshed; no single tumor site is marked.'
  if (id === 'lymph') return 'Spleen and thymus provide anatomical context. Lymph nodes and the full distributed lymphatic system are not separately shown.'
  if (id === 'bones') return 'The skeleton is highlighted as a tissue system. This does not indicate a tumor in every bone or show bone marrow.'
  if (id === 'breast' && gender === 'male') return 'Male breast tissue is not separately segmented in this dataset. Breast cancer information remains available for both models.'
  if (id === 'colorectal') return 'The dataset groups the large intestine in one mesh; the rectum is not independently selectable.'
}
export type AnatomyMesh = { key: string; geometry: THREE.BufferGeometry; matrix: THREE.Matrix4; bounds: THREE.Box3 }
export function extractAnatomyMeshes(scene: THREE.Object3D): AnatomyMesh[] {
  scene.updateMatrixWorld(true)
  const meshes: AnatomyMesh[] = []
  scene.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return
    let named: THREE.Object3D | null = object
    while (named && !STRUCTURES[named.userData.structureKey ?? named.name]) named = named.parent
    if (!named) return
    object.geometry.computeBoundingBox()
    meshes.push({ key: named.userData.structureKey ?? named.name, geometry: object.geometry, matrix: object.matrixWorld.clone(), bounds: object.geometry.boundingBox!.clone().applyMatrix4(object.matrixWorld) })
  })
  return meshes
}
