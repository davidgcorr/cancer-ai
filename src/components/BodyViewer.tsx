import { Suspense, useMemo, useState, Component } from 'react'
import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls, ContactShadows, useGLTF } from '@react-three/drei'
import { ANATOMY_BY_KEY } from 'open-anatomy-3d'
import * as THREE from 'three'
import { coverageNote, extractAnatomyMeshes, MODEL_URLS, regionForMesh, regionMeshes } from '@/data/anatomy'
import type { AnatomyView } from '@/data/anatomy'
import type { Gender, Region, RegionId } from '@/data/regions'

type Props = { gender: Gender; regions: Region[]; selected: RegionId; onSelect: (id: RegionId) => void; resetKey: number; markers: boolean; back: boolean; view: AnatomyView }
const ignoreRaycast = () => {}
function AnatomicalBody({ gender, selected, onSelect, markers, regions, view }: Props) {
  // Meshopt is bundled locally by Drei; no remote model/decoder requests.
  const { scene } = useGLTF(MODEL_URLS[gender], false, true)
  const meshes = useMemo(() => extractAnatomyMeshes(scene), [scene])
  const [hover, setHover] = useState<string | null>(null)
  const mapping = regionMeshes(gender)
  const selectedKeys = mapping[selected]
  const boundsFor = (keys: string[]) => {
    const box = new THREE.Box3()
    meshes.filter(mesh => keys.includes(mesh.key)).forEach(mesh => box.union(mesh.bounds))
    return box
  }
  const selectedBox = boundsFor(selectedKeys)
  const hoveredBox = hover ? boundsFor([hover]) : new THREE.Box3()
  const labelBox = hover && !selectedKeys.includes(hover) ? hoveredBox : selectedBox
  const label = hover && !selectedKeys.includes(hover) ? ANATOMY_BY_KEY[hover]?.label : regions.find(r => r.id === selected)?.name
  const labelPosition = labelBox.isEmpty() || (view === 'skeleton' && !hover) ? null : labelBox.getCenter(new THREE.Vector3())
  if (labelPosition) labelPosition.setZ(labelBox.max.z + .025)

  return <group dispose={null}>
    {meshes.map((mesh, index) => {
      const structure = ANATOMY_BY_KEY[mesh.key]
      const system = structure.system
      const active = selectedKeys.includes(mesh.key) && view === 'organs'
      const skin = system === 'skin'
      const skeleton = system === 'skeleton'
      const visible = view === 'surface' ? skin : view === 'skeleton' ? skeleton : skin || skeleton || system === 'organs'
      if (!visible) return null
      const ghost = view === 'organs' && (skin || skeleton)
      const opacity = ghost ? skin ? .045 : ['skull', 'mandible', 'ribs_l', 'ribs_r', 'sternum', 'pelvis'].includes(mesh.key) ? .12 : .4 : 1
      const color = active ? '#16896e' : skin ? '#c9b19b' : structure.color
      return <mesh key={`${mesh.key}-${index}`} geometry={mesh.geometry} matrix={mesh.matrix} matrixAutoUpdate={false}
        raycast={ghost ? ignoreRaycast : undefined}
        onPointerOver={e => { e.stopPropagation(); setHover(mesh.key) }}
        onPointerOut={() => setHover(null)}
        onClick={e => { e.stopPropagation(); const region = regionForMesh(mesh.key, gender); if (region) onSelect(region) }}>
        <meshStandardMaterial color={hover === mesh.key ? '#d39c4a' : color} roughness={.62} metalness={0}
          transparent={opacity < 1} opacity={opacity} depthWrite={!ghost} side={THREE.DoubleSide}
          emissive={active ? '#0e5545' : '#000000'} emissiveIntensity={.15} />
      </mesh>
    })}
    {markers && view === 'organs' && regions.map(region => {
      const box = boundsFor(mapping[region.id])
      if (box.isEmpty()) return null
      const point = box.getCenter(new THREE.Vector3()); point.z = box.max.z + .012
      return <mesh key={region.id} position={point} onClick={e => { e.stopPropagation(); onSelect(region.id) }} onPointerOver={e=>{e.stopPropagation();setHover(mapping[region.id][0])}} onPointerOut={()=>setHover(null)}>
        <sphereGeometry args={[selected === region.id ? .014 : .009, 16, 16]}/><meshBasicMaterial color={selected === region.id ? '#e5ffef' : '#278567'}/>
      </mesh>
    })}
    {markers && labelPosition && view !== 'surface' && <Html position={labelPosition} center style={{ pointerEvents: 'none' }}><div className="anatomy-label">{label}</div></Html>}
  </group>
}
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean; retry: number }> {
  state = { failed: false, retry: 0 }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <div className="canvas-fallback"><div>The anatomy model could not be displayed.<br/>Check WebGL support and reload the model.<br/><button onClick={()=>this.setState(s=>({failed:false,retry:s.retry+1}))}>Try again</button><br/>Every cancer topic is still available in the region list.</div></div> : <div key={this.state.retry} style={{height:'100%'}}>{this.props.children}</div>
  }
}
export function BodyViewer(props: Props) {
  const note = coverageNote(props.selected, props.gender)
  return <><CanvasBoundary><Canvas camera={{position:[0,.3,8.5],fov:39}} dpr={[1,1.5]} aria-label={`Detailed ${props.gender} anatomical model, ${props.view} view. Select body regions from the list or the model.`}>
    <color attach="background" args={['#eef3ef']}/>
    <ambientLight intensity={.9}/><directionalLight position={[-3,5,5]} intensity={1.8}/><directionalLight position={[3,1,-3]} intensity={1} color="#e8fff5"/>
    <Suspense fallback={<Html center><div className="model-loading" role="status"><span/>Loading anatomical model…</div></Html>}>
      <group rotation={[0,props.back?Math.PI:0,0]} position={[0,-2.4,0]} scale={3}><AnatomicalBody key={props.gender} {...props}/></group>
    </Suspense>
    <ContactShadows position={[0,-2.41,0]} opacity={.18} scale={7} blur={2.5} far={4}/>
    <OrbitControls key={props.resetKey} target={[0,.2,0]} enablePan minDistance={3} maxDistance={11} minPolarAngle={Math.PI*.18} maxPolarAngle={Math.PI*.8}/>
  </Canvas></CanvasBoundary>{note && <div className="model-coverage" role="status">{note}</div>}</>
}
