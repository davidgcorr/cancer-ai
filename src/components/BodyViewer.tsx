import { useI18n } from '@/lib/i18n/provider'
import { Suspense, useMemo, useState, Component } from 'react'
import type { ReactNode } from 'react'
import { Info, LoaderCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls, ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { coverageNote, extractAnatomyMeshes, MODEL_URLS, SUPPLEMENT_URLS, STRUCTURES, regionForMesh, regionMeshes } from '@/data/anatomy'
import type { AnatomyView } from '@/data/anatomy'
import type { Gender, Region, RegionId } from '@/data/regions'

type Props = { gender: Gender; regions: Region[]; selected: RegionId; onSelect: (id: RegionId) => void; resetKey: number; markers: boolean; back: boolean; view: AnatomyView; highlightColor: string }
const ignoreRaycast = () => {}
function AnatomicalBody({ gender, selected, onSelect, markers, regions, view, highlightColor }: Props) {
  const { t } = useI18n()
  // Meshopt is bundled locally by Drei; no remote model/decoder requests.
  const [base, supplement] = useGLTF([MODEL_URLS[gender], SUPPLEMENT_URLS[gender]], false, true)
  const meshes = useMemo(() => [...extractAnatomyMeshes(base.scene), ...extractAnatomyMeshes(supplement.scene)], [base.scene, supplement.scene])
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
  const label = hover && !selectedKeys.includes(hover) ? STRUCTURES[hover]?.label : regions.find(r => r.id === selected)?.name
  const labelPosition = labelBox.isEmpty() || (view === 'skeleton' && !hover) ? null : labelBox.getCenter(new THREE.Vector3())
  if (labelPosition) labelPosition.setZ(labelBox.max.z + .025)

  return <group dispose={null}>
    {meshes.map((mesh, index) => {
      if (mesh.key === 'lung_l' || mesh.key === 'lung_r') return null // Superseded by the actual Z-Anatomy lung surfaces.
      const structure = STRUCTURES[mesh.key]
      const system = structure.system
      const active = selectedKeys.includes(mesh.key) && (view === 'organs' || (selected === 'skin' && view === 'surface') || (selected === 'bones' && view === 'skeleton'))
      const skin = system === 'skin'
      const skeleton = system === 'skeleton'
      const visible = view === 'surface' ? skin : view === 'skeleton' ? skeleton : skin || skeleton || system === 'organs'
      if (!visible) return null
      const ghost = view === 'organs' && (skin || skeleton)
      const opacity = ghost ? skin ? .045 : ['skull', 'mandible', 'ribs_l', 'ribs_r', 'sternum', 'pelvis'].includes(mesh.key) ? .12 : .4 : 1
      const color = active ? highlightColor : skin ? '#c9b19b' : structure.color
      return <mesh key={`${mesh.key}-${index}`} geometry={mesh.geometry} matrix={mesh.matrix} matrixAutoUpdate={false}
        raycast={ghost ? ignoreRaycast : undefined}
        onPointerOver={e => { e.stopPropagation(); setHover(mesh.key) }}
        onPointerOut={() => setHover(null)}
        onClick={e => { e.stopPropagation(); const region = regionForMesh(mesh.key, gender); if (region) onSelect(region) }}>
        <meshStandardMaterial color={hover === mesh.key ? highlightColor : color} roughness={.62} metalness={0}
          transparent={opacity < 1} opacity={opacity} depthWrite={!ghost} side={THREE.DoubleSide}
          emissive={active ? highlightColor : '#000000'} emissiveIntensity={.15} />
      </mesh>
    })}
    {markers && view === 'organs' && regions.map(region => {
      if (['skin','bones','blood','lymph'].includes(region.id)) return null
      const box = boundsFor(mapping[region.id])
      if (box.isEmpty()) return null
      const point = box.getCenter(new THREE.Vector3()); point.z = box.max.z + .012
      return <mesh key={region.id} position={point} onClick={e => { e.stopPropagation(); onSelect(region.id) }} onPointerOver={e=>{e.stopPropagation();setHover(mapping[region.id][0])}} onPointerOut={()=>setHover(null)}>
        <sphereGeometry args={[selected === region.id ? .014 : .009, 16, 16]}/><meshBasicMaterial color={selected === region.id ? '#ffffff' : highlightColor}/>
      </mesh>
    })}
    {markers && labelPosition && !(['skin','bones'].includes(selected) && !hover) && (view !== 'surface' || hover) && <Html position={labelPosition} center style={{ pointerEvents: 'none' }}><Badge variant="outline" className="translate-x-1/2 whitespace-nowrap bg-background shadow-sm">{t(label??'')}</Badge></Html>}
  </group>
}
function ModelError({onRetry}:{onRetry:()=>void}) { const { t } = useI18n(); return <div className="absolute inset-0 flex items-center justify-center p-6"><Alert className="max-w-sm"><Info/><AlertTitle>{t("Model unavailable")}</AlertTitle><AlertDescription><p>{t("Check WebGL support and try reloading the model. Cancer topics are still available in the region list.")}</p><Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>{t("Try again")}</Button></AlertDescription></Alert></div> }
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean; retry: number }> {
  state = { failed: false, retry: 0 }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <ModelError onRetry={()=>this.setState(s=>({failed:false,retry:s.retry+1}))}/> : <div key={this.state.retry} className="h-full">{this.props.children}</div>
  }
}
export function BodyViewer(props: Props) {
  const { t } = useI18n()
  const note = coverageNote(props.selected, props.gender)
  return <><CanvasBoundary><Canvas camera={{position:[0,.3,8.5],fov:39}} dpr={[1,1.5]} aria-label={t("Detailed {gender} anatomical model, {view} view. Select body regions from the list or the model.",{gender:t(props.gender==='male'?'Male':'Female'),view:t(props.view==='organs'?'Organs':props.view==='skeleton'?'Skeleton':'Surface')})}>
    <color attach="background" args={['#fafafa']}/>
    <ambientLight intensity={.9}/><directionalLight position={[-3,5,5]} intensity={1.8}/><directionalLight position={[3,1,-3]} intensity={1} color="#ffffff"/>
    <Suspense fallback={<Html center><Card className="whitespace-nowrap py-0 shadow-sm" role="status"><CardContent className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin"/>{t("Loading anatomical model…")}</CardContent></Card></Html>}>
      <group rotation={[0,props.back?Math.PI:0,0]} position={[0,-2.4,0]} scale={3}><AnatomicalBody key={props.gender} {...props}/></group>
    </Suspense>
    <ContactShadows position={[0,-2.41,0]} opacity={.18} scale={7} blur={2.5} far={4}/>
    <OrbitControls key={props.resetKey} target={[0,.2,0]} enablePan minDistance={3} maxDistance={11} minPolarAngle={Math.PI*.18} maxPolarAngle={Math.PI*.8}/>
  </Canvas></CanvasBoundary>{note && <Alert className="absolute right-4 bottom-4 left-4 w-auto bg-background/95"><Info/><AlertDescription>{t(note)}</AlertDescription></Alert>}</>
}
