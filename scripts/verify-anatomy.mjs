import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { ANATOMY_BY_KEY } from 'open-anatomy-3d'

// Decode the actual compressed assets: validate mesh identity, geometry, scale,
// bounds, organ layout, and sex-specific anatomy rather than only a static list.
await MeshoptDecoder.ready
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
for (const sex of ['male', 'female']) {
  const file = readFileSync(new URL(`../node_modules/open-anatomy-3d/models/anatomy-${sex}.glb`, import.meta.url))
  const gltf = await loader.parseAsync(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength), '')
  const scene = gltf.scene
  scene.updateMatrixWorld(true)
  const keys = new Map()
  let triangles = 0
  scene.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return
    let named = object
    while (named && !ANATOMY_BY_KEY[named.name]) named = named.parent
    assert.ok(named, `Uncatalogued mesh: ${object.name}`)
    const geometry = object.geometry
    assert.ok(geometry.getAttribute('position').count > 0)
    triangles += (geometry.index?.count ?? geometry.getAttribute('position').count) / 3
    geometry.computeBoundingBox()
    const box = geometry.boundingBox.clone().applyMatrix4(object.matrixWorld)
    assert.ok([...box.min, ...box.max].every(Number.isFinite), `Invalid bounds: ${named.name}`)
    keys.set(named.name, (keys.get(named.name) ?? new THREE.Box3()).union(box))
  })
  for (const key of ['skin','skull','brain','lung_l','lung_r','liver','colon','heart','femur_l','hand_l','foot_r']) assert.ok(keys.has(key), `Missing ${key} in ${sex}`)
  const body = keys.get('skin')
  const height = body.max.y - body.min.y
  assert.ok(height > 1.4 && height < 2.1, `Unexpected model height: ${height}`)
  const center = key => keys.get(key).getCenter(new THREE.Vector3())
  assert.ok(center('brain').y > center('lung_l').y)
  assert.ok(center('lung_l').y > center('liver').y)
  assert.ok(center('liver').y > center('colon').y)
  assert.ok(center('lung_l').x > center('lung_r').x)
  assert.ok(center('liver').x < center('heart').x)
  if (sex === 'male') {
    assert.ok(keys.has('prostate'))
    assert.ok(!keys.has('uterus'))
  } else {
    for (const key of ['uterus','ovary_l','ovary_r','breast_l','breast_r']) assert.ok(keys.has(key), `Missing female ${key}`)
    assert.ok(!keys.has('prostate'))
  }
  console.log(`${sex}: ${keys.size} named mesh structures, ${Math.round(triangles).toLocaleString()} triangles, ${height.toFixed(2)} m body. Organ geometry and sex-specific checks passed.`)
}
