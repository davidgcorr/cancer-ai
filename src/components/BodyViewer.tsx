import { Suspense, useMemo, useRef, useState, Component } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { Gender, Region, RegionId } from '@/data/regions'

type Props = { gender: Gender; regions: Region[]; selected: RegionId; onSelect: (id: RegionId) => void; resetKey: number; markers: boolean; back: boolean }
function Body({ gender }: { gender: Gender }) {
  const female = gender === 'female'
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#9fc7bd', roughness: .46, metalness: .07, clearcoat: .25 }), [])
  const torso = useMemo(() => {
    const profile = [[.34,-.25],[female ? .47:.44,-.08],[female ? .48:.43,.12],[female ? .33:.38,.51],[female ? .4:.49,1.04],[female ? .49:.57,1.48],[female ? .42:.49,1.7],[.18,1.83],[.15,1.98]]
    const curve = new THREE.SplineCurve(profile.map(([x,y])=>new THREE.Vector2(x,y)))
    return new THREE.LatheGeometry(curve.getPoints(60), 64)
  }, [female])
  function ellipsoid(position: [number,number,number], scale: [number,number,number], rotation = 0) {
    return <mesh position={position} scale={scale} rotation={[0,0,rotation]} material={material}><sphereGeometry args={[1,40,32]} /></mesh>
  }
  return <group>
    <mesh geometry={torso} material={material} scale={[1,1,.65]} />
    {ellipsoid([0,2.45,0],[.265,.365,.27])}
    {ellipsoid([0,2.17,.105],[.19,.16,.19])}
    {ellipsoid([0,1.99,0],[.15,.25,.15])}
    {ellipsoid([0,2.39,.256],[.047,.084,.06])}
    {[-1,1].map(side=><group key={side}>
      {ellipsoid([side*.263,2.43,0],[.048,.095,.066])}
      {ellipsoid([side*(female?.43:.51),1.57,0],[.23,.23,.235])}
      {ellipsoid([side*(female?.61:.69),1.17,0],[female?.14:.17,.46,.16],side*.21)}
      {ellipsoid([side*(female?.73:.81),.75,0],[.125,.135,.13])}
      {ellipsoid([side*(female?.81:.89),.43,.015],[.115,.35,.115],side*.18)}
      {ellipsoid([side*(female?.88:.96),.05,.02],[.105,.19,.073],side*.1)}
      {[0,1,2,3].map(i=><mesh key={i} position={[side*(.82+i*.042+(female?0:.08)),-.1-(i===0?.015:i===3?0:.035),.025]} material={material}><capsuleGeometry args={[.021,.13,6,10]}/></mesh>)}
      {ellipsoid([side*(female?.77:.85),.015,.045],[.044,.105,.05],-side*.5)}
      {ellipsoid([side*.255,-.58,0],[female?.255:.235,.64,.245],-side*.045)}
      {ellipsoid([side*.285,-1.15,.015],[.15,.19,.16])}
      {ellipsoid([side*.285,-1.63,-.025],[.155,.47,.17],side*.015)}
      {ellipsoid([side*.29,-2.08,0],[.095,.2,.105])}
      {ellipsoid([side*.29,-2.26,.14],[.125,.105,.27])}
      {female && ellipsoid([side*.235,1.3,.235],[.22,.19,.16])}
    </group>)}
  </group>
}
function Marker({ region, active, onSelect }: { region: Region; active: boolean; onSelect: () => void }) {
  const ref = useRef<THREE.Mesh>(null)
  const [hover, setHover] = useState(false)
  useFrame(({clock}) => { if(ref.current) ref.current.scale.setScalar(1+Math.sin(clock.elapsedTime*2)*.07) })
  return <group position={region.position}>
    <mesh ref={ref} onClick={e=>{e.stopPropagation();onSelect()}} onPointerOver={()=>setHover(true)} onPointerOut={()=>setHover(false)}>
      <sphereGeometry args={[active ? .09:.055,24,24]}/><meshBasicMaterial color={active?'#078571':'#e5fff7'} />
    </mesh>
    {active && <mesh><sphereGeometry args={[.145,24,24]}/><meshBasicMaterial color="#1caa8c" transparent opacity={.18} depthWrite={false}/></mesh>}
    {(active||hover)&&<Html position={[.2,.04,0]} center style={{pointerEvents:'none'}}><div className="anatomy-label">{region.name}<span /></div></Html>}
  </group>
}
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <div className="canvas-fallback">The 3D view requires WebGL.<br/>You can still explore every region using the list.</div> : this.props.children }
}
export function BodyViewer({gender, regions, selected, onSelect, resetKey, markers, back}: Props) {
  return <CanvasBoundary><Canvas shadows camera={{position:[0,.3,8.5],fov:39}} dpr={[1,2]} aria-label={`Interactive ${gender} human body. Use the body region list to select an organ.`}>
    <color attach="background" args={['#eef3ef']}/>
    <ambientLight intensity={1.5}/><directionalLight position={[-3,5,5]} intensity={2.4}/><directionalLight position={[3,1,-3]} intensity={2} color="#e8fff5"/>
    <Suspense fallback={null}><group rotation={[0,back?Math.PI:0,0]}><Body gender={gender}/>{markers && regions.map(region=><Marker key={region.id} region={region} active={selected===region.id} onSelect={()=>onSelect(region.id)}/>)}</group>
    <ContactShadows position={[0,-2.4,0]} opacity={.2} scale={7} blur={2.5} far={4}/>
    <OrbitControls key={resetKey} target={[0,.2,0]} enablePan={false} minDistance={5.5} maxDistance={11} minPolarAngle={Math.PI*.25} maxPolarAngle={Math.PI*.7}/></Suspense>
  </Canvas></CanvasBoundary>
}
