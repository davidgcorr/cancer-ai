import * as THREE from 'three'
import { ANATOMY_BY_KEY } from 'open-anatomy-3d'
import maleUrl from 'open-anatomy-3d/models/anatomy-male.glb?url'
import femaleUrl from 'open-anatomy-3d/models/anatomy-female.glb?url'
import type { Gender, RegionId } from './regions'

export type AnatomyView = 'organs' | 'skeleton' | 'surface'
export const MODEL_URLS = { male: maleUrl, female: femaleUrl }
export const regionMeshes = (gender: Gender): Record<RegionId, string[]> => ({
  brain: ['brain', 'cerebellum', 'brainstem'],
  thyroid: [], // This release does not segment the thyroid; do not invent a mesh.
  lungs: ['lung_l', 'lung_r'],
  breast: gender === 'female' ? ['breast_l', 'breast_r'] : [],
  liver: ['liver'],
  colorectal: ['colon'],
  pelvis: gender === 'male' ? ['prostate'] : ['uterus', 'ovary_l', 'ovary_r', 'fallopian_tubes'],
})
export function regionForMesh(key: string, gender: Gender): RegionId | undefined {
  return (Object.entries(regionMeshes(gender)) as [RegionId, string[]][]).find(([, keys]) => keys.includes(key))?.[0]
}
export function coverageNote(id: RegionId, gender: Gender): string | undefined {
  if (id === 'thyroid') return 'The thyroid is not separately segmented in this dataset. Its cancer information is available here; no substitute organ is highlighted.'
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
    while (named && !ANATOMY_BY_KEY[named.name]) named = named.parent
    if (!named) return
    object.geometry.computeBoundingBox()
    meshes.push({ key: named.name, geometry: object.geometry, matrix: object.matrixWorld.clone(), bounds: object.geometry.boundingBox!.clone().applyMatrix4(object.matrixWorld) })
  })
  return meshes
}
