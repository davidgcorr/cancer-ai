// Input: the uncompressed output of extract-z-organs.py. Blender's Draco
// importer preserves world coordinates and source za_name metadata.
import { readFileSync, writeFileSync } from 'node:fs'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.() }) }
  readAsDataURL(blob) { blob.arrayBuffer().then(result => { this.result = `data:${blob.type};base64,${Buffer.from(result).toString('base64')}`; this.onloadend?.() }) }
}
const load = async path => {
  const b = readFileSync(path)
  return (await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(b.buffer.slice(b.byteOffset, b.byteOffset+b.byteLength), '')).scene
}
const source = await load(process.argv[2] ?? '/tmp/oncoatlas-z-selected.glb')
source.updateMatrixWorld(true)
const male = await load('node_modules/open-anatomy-3d/models/anatomy-male.glb')
const female = await load('node_modules/open-anatomy-3d/models/anatomy-female.glb')
const box = (root, key) => { const b = new THREE.Box3(); root.updateMatrixWorld(true); root.traverse(o=>{if(o.isMesh && o.name === key)b.union(new THREE.Box3().setFromObject(o))}); return b }
const center = (root,key) => box(root,key).getCenter(new THREE.Vector3())
const zTrachea = new THREE.Box3()
source.traverse(o=>{if(o.isMesh && /Trachea/i.test(o.name))zTrachea.union(new THREE.Box3().setFromObject(o))})
const sourceAnchor = zTrachea.getCenter(new THREE.Vector3())
const ids = {
  'Inferior lobe of left lung': 'lung_surface_l_lower',
  'Superior lobe of left lung': 'lung_surface_l_upper',
  'Inferior lobe of right lung': 'lung_surface_r_lower',
  'Middle lobe of right lung': 'lung_surface_r_middle',
  'Superior lobe of right lung': 'lung_surface_r_upper',
  'Thyroid gland': 'thyroid',
}
for (const [sex, target] of [['male',male],['female',female]]) {
  const targetAnchor = center(target,'trachea')
  // Male registration: align tracheal centers in the two source atlases.
  // Female adaptation: torso scale from the base model's liver widths/depths
  // and trachea-to-liver distance, then align to the female trachea.
  const scale = new THREE.Vector3(1,1,1)
  if (sex === 'female') {
    const m = box(male,'liver').getSize(new THREE.Vector3())
    const f = box(female,'liver').getSize(new THREE.Vector3())
    scale.set(f.x/m.x, (targetAnchor.y-center(female,'liver').y)/(center(male,'trachea').y-center(male,'liver').y), f.z/m.z)
  }
  const registration = new THREE.Matrix4().makeTranslation(...targetAnchor.toArray())
    .multiply(new THREE.Matrix4().makeScale(...scale.toArray()))
    .multiply(new THREE.Matrix4().makeTranslation(...sourceAnchor.clone().negate().toArray()))
  const result = new THREE.Group()
  result.userData = { license:'CC BY-SA 4.0', attribution:'Z-Anatomy, derived from BodyParts3D © The Database Center for Life Science', source:'nqwrc/3d-anatomy@8ca3b7421bcfbe88b85859eb1983d5cf79f21749', adaptation:'Organ extraction, tracheal registration; female torso scaling', registration:registration.toArray() }
  source.traverse(o=>{
    if(!o.isMesh)return
    let ancestor=o
    while(ancestor && !ids[ancestor.userData.za_name])ancestor=ancestor.parent
    if(!ancestor)return
    const id=ids[ancestor.userData.za_name]
    const geometry=o.geometry.clone().applyMatrix4(o.matrixWorld).applyMatrix4(registration)
    if(!geometry.attributes.normal.normalized) geometry.normalizeNormals()
    const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:id==='thyroid'?'#bd8164':'#c48f93',roughness:.62}))
    mesh.name=id
    mesh.userData={structureKey:id,sourceStructure:ancestor.userData.za_name,license:'CC BY-SA 4.0'}
    result.add(mesh)
  })
  const output = await new GLTFExporter().parseAsync(result,{binary:true})
  writeFileSync(`public/anatomy/z-organs-${sex}.glb`,Buffer.from(output))
  console.log(`${sex}: extracted ${result.children.length} organ primitives, scale ${scale.toArray().map(x=>x.toFixed(3))}`)
}
