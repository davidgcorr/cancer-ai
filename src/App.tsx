import { useMemo, useState } from 'react'
import { Activity, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, CircleHelp, Cross, Eye, EyeOff, Focus, Info, Layers2, Mars, MousePointer2, MoveUpRight, RotateCcw, Rotate3D, ScanLine, Venus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { BodyViewer } from '@/components/BodyViewer'
import { ATTRIBUTION } from 'open-anatomy-3d'
import type { AnatomyView } from '@/data/anatomy'
import { getCancerUrl, getRegions } from '@/data/regions'
import type { Gender, RegionId } from '@/data/regions'

function App() {
  const [view, setView] = useState<AnatomyView>('organs')
  const [gender, setGender] = useState<Gender>('male')
  const [selected, setSelected] = useState<RegionId>('lungs')
  const [resetKey, setResetKey] = useState(0)
  const [markers, setMarkers] = useState(true)
  const [back, setBack] = useState(false)
  const [help, setHelp] = useState(false)
  const regions = useMemo(()=>getRegions(gender),[gender])
  const region = regions.find(r=>r.id===selected)!
  return <div className="app-shell">
    <header className="site-header">
      <a className="brand" href="#"><span className="brand-icon"><Cross size={21} strokeWidth={2.3}/></span>onco<span className="brand-light">atlas</span><span className="brand-dot">®</span></a>
      <nav aria-label="Main navigation"><span className="nav-active"><ScanLine size={15}/> Body explorer</span><a href="https://www.cancer.gov/types" target="_blank" rel="noreferrer">Cancer library <ArrowUpRight size={13}/></a></nav>
      <Button variant="ghost" size="sm" onClick={()=>setHelp(!help)} aria-expanded={help}><CircleHelp size={16}/><span className="about-text">About the explorer</span></Button>
    </header>
    <main>
      <section className="page-heading"><div><div className="eyebrow"><span/> THE HUMAN BODY, BETTER UNDERSTOOD</div><h1>Understanding starts here.</h1><p>Explore the body. Discover how cancer can affect each part.</p></div><span className="edition"><BookOpen size={15}/> An interactive learning experience</span></section>
      {help && <div className="help-panel" role="status"><Info size={18}/><div>Choose a body model, then select a region on the figure or in the list. Drag to rotate and scroll to zoom. The model uses BodyParts3D anatomy and selected cancer examples. Switch between organs, skeleton, and surface views. Hover over a visible structure to see its name. Structures missing from the dataset are noted. Model options represent typical anatomy and do not determine an individual’s organs or cancer risk.</div><Button size="sm" variant="ghost" onClick={()=>setHelp(false)}>Close</Button></div>}
      <div className="explorer-grid">
        <aside className="control-panel">
          <div className="section-number">01 <span>CHOOSE A BODY MODEL</span></div><h2>A view of you.</h2><p className="panel-description">Select a model to begin exploring.</p>
          <ToggleGroup type="single" value={gender} onValueChange={v=>{if(v){setGender(v as Gender);setBack(false);setResetKey(k=>k+1)}}} aria-label="Gender"><ToggleGroupItem value="male" aria-label="Male"><Mars size={17}/> Male</ToggleGroupItem><ToggleGroupItem value="female" aria-label="Female"><Venus size={17}/> Female</ToggleGroupItem></ToggleGroup>
          <div className="anatomy-note"><Info size={13}/><span>Models show typical male / female anatomy.</span></div>
          <div className="panel-divider"/>
          <div className="region-heading"><div className="section-number">02 <span>EXPLORE A REGION</span></div><span className="count">07</span></div>
          <p className="region-description">Follow your curiosity.</p>
          <div className="region-list" aria-label="Body regions">{regions.map((r,i)=><button key={r.id} className={`region-row ${selected===r.id?'selected':''}`} onClick={()=>{setSelected(r.id);setView('organs')}} aria-pressed={selected===r.id}><span className="region-index">{String(i+1).padStart(2,'0')}</span><span>{r.name}</span>{selected===r.id ? <span className="selected-indicator"/> : <ChevronRight size={14}/>}</button>)}</div>
          <div className="sidebar-bottom"><span className="small-orbit"><MousePointer2 size={16}/></span><p>You can also select a marker<br/>directly on the body.</p></div>
        </aside>
        <section className="viewer-panel" aria-label="3D anatomy explorer">
          <div className="viewer-top"><span><span className="live-dot"/> INTERACTIVE ANATOMY</span><span className="model-badge">{gender==='male'?'Male':'Female'} model <Check size={12}/></span></div>
          <div className="viewer-canvas"><BodyViewer gender={gender} regions={regions} selected={selected} onSelect={id=>{setSelected(id);setView('organs')}} view={view} resetKey={resetKey} markers={markers} back={back}/></div>
          <div className="anatomy-view-switch" role="group" aria-label="Anatomy layers">{(['organs','skeleton','surface'] as const).map(layer=><button key={layer} onClick={()=>setView(layer)} aria-pressed={view===layer}>{layer==='organs'?'Organs':layer==='skeleton'?'Skeleton':'Surface'}</button>)}</div>
          <div className="viewer-side-label">HUMAN ANATOMY <span> / </span> 3D EXPLORER</div>
          <div className="viewer-tools"><Button size="icon" variant="outline" title="Reset view" aria-label="Reset view" onClick={()=>{setBack(false);setResetKey(k=>k+1)}}><Focus size={17}/></Button><Button size="icon" variant="outline" title={markers?'Hide markers':'Show markers'} aria-label={markers?'Hide markers':'Show markers'} aria-pressed={markers} onClick={()=>setMarkers(!markers)}>{markers?<Eye size={17}/>:<EyeOff size={17}/>}</Button><Button size="icon" variant="outline" title="Rotate to opposite view" aria-label="Rotate to opposite view" onClick={()=>{setBack(!back);setResetKey(k=>k+1)}}><Rotate3D size={17}/></Button></div>
          <div className="viewer-bottom"><span><RotateCcw size={13}/> Drag to rotate <span className="hint-dot">·</span> Scroll to zoom</span><button className="front-button" onClick={()=>{setBack(!back);setResetKey(k=>k+1)}}>{back?'BACK VIEW':'FRONT VIEW'} <Rotate3D size={13}/></button></div>
        </section>
        <aside className="detail-panel" aria-live="polite">
          <div className="detail-eyebrow"><span className="detail-dot"/> REGION IN FOCUS</div>
          <div className="organ-illustration"><Activity size={72} strokeWidth={.85}/><span className="organ-orbit orbit-one"/><span className="organ-orbit orbit-two"/><span className="organ-spark"/></div>
          <span className="system-label">{region.system}</span><h2>{region.name}</h2><p className="detail-description">{region.description}</p>
          <div className="cancer-heading"><span>Associated cancer types</span><span>{String(region.types.length).padStart(2,'0')}</span></div>
          <div className="cancer-list">{region.types.map((type,i)=><a href={getCancerUrl(type, region.source)} target="_blank" rel="noreferrer" key={type}><span className="cancer-icon"><Layers2 size={15}/></span><span><small>0{i+1}</small>{type}</span><ArrowUpRight size={15}/></a>)}</div>
          <a className="learn-link" href={`https://www.cancer.gov/types/${region.source}`} target="_blank" rel="noreferrer">Explore this cancer topic <ArrowRight size={16}/></a>
          <div className="source-note"><BookOpen size={14}/><p>Learn more from the<br/><a href="https://www.cancer.gov/types" target="_blank" rel="noreferrer">National Cancer Institute <ArrowUpRight size={11}/></a></p></div>
        </aside>
      </div>
      <details className="model-credits"><summary>3D anatomy sources &amp; license · CC BY 4.0</summary><p>{ATTRIBUTION}</p><p>The female model fits shared BodyParts3D structures to a MakeHuman surface and adds Human Reference Atlas reproductive and breast organs. It is an adapted educational model, not an independently scanned or clinically validated female atlas. Our display changes colors, transparency, and selection highlights; the source geometry is unchanged.</p><p><a href="https://github.com/MervinR07/open-anatomy-3d/blob/main/ATTRIBUTION.md" target="_blank" rel="noreferrer">Sources and modifications</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0 license</a> · <a href="/anatomy/ATTRIBUTION.md">Full attribution</a></p></details>
      <section className="below-explorer"><div className="explore-prompt"><span className="prompt-icon"><MoveUpRight size={20}/></span><div><strong>A little exploration. A better understanding.</strong><p>Start with a region. Every part has a story to tell.</p></div></div><span className="education-note"><Info size={15}/> For education and awareness. Not medical advice.</span></section>
    </main>
    <footer><span>© {new Date().getFullYear()} Oncoatlas</span><span>Made for understanding.</span><a href="https://www.cancer.gov/about-cancer" target="_blank" rel="noreferrer">Trusted resources <ArrowUpRight size={12}/></a></footer>
  </div>
}
export default App
