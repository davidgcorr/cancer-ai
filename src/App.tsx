import { useI18n } from '@/lib/i18n/provider'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Bone, Circle, Eye, EyeOff, Focus, Heart, Info, Mars, Maximize2, Minimize2, Rotate3D, Settings, UserRound, Venus } from 'lucide-react'
import { ATTRIBUTION } from 'open-anatomy-3d'
import { CancerPanel } from '@/components/CancerPanel'
import { AnatomyTree } from '@/components/AnatomyTree'
import type { DetailPath } from '@/data/cancer-detail'
import { BodyViewer } from '@/components/BodyViewer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { languages, isLanguage } from '@/lib/i18n/core'
import { palettes, isPalette, savedPalette } from '@/lib/palettes'
import type { Palette } from '@/lib/palettes'
import { viewForRegion } from '@/data/anatomy'
import type { AnatomyView } from '@/data/anatomy'
import { getRegions } from '@/data/regions'
import type { Gender, RegionId } from '@/data/regions'

function ToolButton({ label, onClick, children, pressed, expanded, controls }: { label: string; onClick: () => void; children: ReactNode; pressed?: boolean; expanded?: boolean; controls?: string }) {
  return <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon-sm" className="bg-background aria-pressed:bg-accent aria-pressed:text-accent-foreground" aria-label={label} aria-pressed={pressed} aria-expanded={expanded} aria-controls={controls} onClick={onClick}>{children}</Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>
}
function IconToggle({label,value,children}:{label:string;value:string;children:ReactNode}) {
  return <Tooltip><TooltipTrigger asChild><ToggleGroupItem value={value} className="size-8 p-0" aria-label={label}>{children}</ToggleGroupItem></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>
}
function Sources() {
  const { t } = useI18n()
  return <Dialog>
    <DialogTrigger asChild><Button variant="ghost" size="sm">{t("About & sources")}</Button></DialogTrigger>
    <DialogContent closeLabel={t("Close")} className="max-h-[85dvh] overflow-y-auto sm:max-w-xl">
      <DialogHeader><DialogTitle>{t("About onco-milver")}</DialogTitle><DialogDescription>{t("Explore anatomy and cancer types by body region.")}</DialogDescription></DialogHeader>
      <p className="text-sm leading-relaxed text-muted-foreground">{t("Choose a model and a body region. Drag to rotate, scroll to zoom, and right-drag to pan. Switch between organs, skeleton, and surface views. Select an organ or use the region list to view the associated cancer topics.")}</p>
      <Accordion type="multiple" defaultValue={['anatomy']}>
        <AccordionItem value="anatomy"><AccordionTrigger>{t("Anatomy sources & licenses")}</AccordionTrigger><AccordionContent className="space-y-4 text-muted-foreground">
          <p className="text-xs font-medium">{t("Original source attribution")}</p><p lang="en">{ATTRIBUTION}</p>
          <p>{t("Lung lobes and thyroid: Z-Anatomy, derived from BodyParts3D © The Database Center for Life Science, CC BY-SA 4.0. These meshes are extracted and registered to the base atlas; female geometry is scaled to torso landmarks.")}</p>
          <p>{t("The female model fits shared BodyParts3D structures to a MakeHuman surface and adds Human Reference Atlas breast and reproductive organs. It is an adapted educational model, not an independently scanned or clinically validated female atlas. Male breast tissue is not separately segmented. Colon and rectum are grouped in one mesh.")}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild><a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0<ArrowUpRight/></a></Button>
            <Button variant="outline" size="sm" asChild><a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0<ArrowUpRight/></a></Button>
            <Button variant="outline" size="sm" asChild><a href={`${import.meta.env.BASE_URL}anatomy/ATTRIBUTION.md`} target="_blank" rel="noreferrer">{t("Full attribution")}<ArrowUpRight/></a></Button>
            <Button variant="outline" size="sm" asChild><a href={`${import.meta.env.BASE_URL}anatomy/SUPPLEMENT-NOTICE.md`} target="_blank" rel="noreferrer">{t("Adaptation details")}<ArrowUpRight/></a></Button>
          </div>
        </AccordionContent></AccordionItem>
        <AccordionItem value="catalog"><AccordionTrigger>{t('Catalog coverage')}</AccordionTrigger><AccordionContent className="space-y-3 text-muted-foreground"><p>{t('Coverage: major and selected rare histologies; not a complete WHO or ICD-O catalog. Overlapping umbrella categories must not be added together.')}</p><p>{t('Percentages use the stated source population and denominator. Missing values are not zero; estimates from different cohorts must not be summed or treated as personal risk.')}</p><Button variant="outline" size="sm" asChild><a href={`${import.meta.env.BASE_URL}cancer-catalog-audit.md`} target="_blank" rel="noreferrer">{t('Source audit')}<ArrowUpRight/></a></Button></AccordionContent></AccordionItem>
        <AccordionItem value="content"><AccordionTrigger>{t("Cancer information")}</AccordionTrigger><AccordionContent className="space-y-3 text-muted-foreground"><p>{t("The cancer map links regions to selected types, subtypes, and stage or classification alternatives. Its link widths count taxonomy relationships, not patients or risk. Stages are alternatives, not a disease progression timeline. Grades, phases, and disease status are labeled separately. The selected cancer examples link to the National Cancer Institute. This is not an exhaustive cancer catalog or an individual risk assessment. Model options represent typical anatomy and do not determine an individual’s organs or cancer risk.")}</p><Button variant="outline" size="sm" asChild><a href="https://www.cancer.gov/about-cancer" target="_blank" rel="noreferrer">{t("National Cancer Institute")}<ArrowUpRight/></a></Button></AccordionContent></AccordionItem>
      </Accordion>
      <p className="text-xs text-muted-foreground">{t("For education and awareness. Not medical advice.")}</p>
    </DialogContent>
  </Dialog>
}

function App() {
  const { t, language, setLanguage } = useI18n()
  const [palette, setPalette] = useState<Palette>(savedPalette)
  const [view, setView] = useState<AnatomyView>('organs')
  const [gender, setGender] = useState<Gender>('male')
  const [selected, setSelected] = useState<RegionId>('lungs')
  const [resetKey, setResetKey] = useState(0)
  const [markers, setMarkers] = useState(true)
  const [back, setBack] = useState(false)
  const [modelMinimized, setModelMinimized] = useState(false)
  const [treeSelection,setTreeSelection]=useState<{regionId:RegionId;gender:Gender;path:DetailPath}>({regionId:'lungs',gender:'male',path:{}})
  const [navigation,setNavigation]=useState<{regionId:RegionId;gender:Gender;path:DetailPath}>()

  useEffect(() => {
    document.documentElement.dataset.palette = palette
    try { localStorage.setItem('onco-milver-palette', palette) } catch { /* Preferences are optional when storage is unavailable. */ }
  }, [palette])
  const regions = useMemo(() => getRegions(gender), [gender])
  const region = regions.find(r => r.id === selected)!
  const selectRegion = (id: RegionId) => { setSelected(id); setView(viewForRegion(id)) }
  const selectFromTree=(regionId:RegionId,path:DetailPath)=>{
    selectRegion(regionId)
    const selection={regionId,gender,path}
    setTreeSelection(selection);setNavigation(selection)
  }
  const reset = () => { setBack(false); setResetKey(k => k + 1) }
  const genderSelector=<ToggleGroup type="single" variant="outline" value={gender} className="bg-background" onValueChange={value=>{if(value){setGender(value as Gender);reset()}}} aria-label={t("Gender")}>
    <IconToggle value="male" label={t("Male")}><Mars aria-hidden="true"/></IconToggle>
    <IconToggle value="female" label={t("Female")}><Venus aria-hidden="true"/></IconToggle>
  </ToggleGroup>

  return <TooltipProvider>
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5"><Circle className="size-5" strokeWidth={1.75} aria-hidden="true"/><span className="text-base font-semibold tracking-tight">onco-milver</span><span className="text-xs font-normal text-muted-foreground">Onco explorer</span></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={t("Settings")} title={t("Settings")}><Settings className="size-4"/></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[calc(100dvh-2rem)] w-52 overflow-y-auto">
              <DropdownMenuLabel>{t("Settings")}</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{t("Language")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={language} onValueChange={value=>{if(isLanguage(value))setLanguage(value)}} aria-label={t("Language")}>
                {Object.entries(languages).map(([code,label])=><DropdownMenuRadioItem value={code} key={code} lang={code}>{label}</DropdownMenuRadioItem>)}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator/>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{t("Color palette")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={palette} onValueChange={value=>{if(isPalette(value))setPalette(value)}} aria-label={t("Color palette")}>
                {Object.entries(palettes).map(([key,item])=><DropdownMenuRadioItem value={key} key={key}><Circle className="size-3 fill-current" style={{color:item.color}} aria-hidden="true"/>{t(item.label)}</DropdownMenuRadioItem>)}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main aria-label="Onco explorer" className={`mx-auto w-full space-y-6 px-4 py-6 sm:px-8 lg:px-10 lg:py-8 ${modelMinimized?'max-w-6xl':'max-w-[1600px]'}`}>
        <div className={`grid items-start gap-4 ${modelMinimized?'grid-cols-1':'xl:grid-cols-[minmax(480px,1fr)_minmax(440px,1.15fr)]'}`}>
          <Card className="gap-0 overflow-hidden py-0 shadow-none">
            {modelMinimized&&<div className="flex flex-wrap items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-3"><span className="text-sm font-medium">{t("Body model")}</span>{genderSelector}</div>
              <ToolButton label={t('Restore 3D model')} expanded={false} controls="anatomy-panel-content" onClick={()=>setModelMinimized(false)}><Maximize2 aria-hidden="true"/></ToolButton>
            </div>}
            <div id="anatomy-panel-content" hidden={modelMinimized}>{!modelMinimized&&<div className="relative h-[520px] bg-muted/40 sm:h-[620px]">
              <div className="absolute inset-x-0 top-28 bottom-0 flex gap-2 p-3 sm:top-16">
                <AnatomyTree regions={regions} gender={gender} selected={selected} path={treeSelection.regionId===selected&&treeSelection.gender===gender?treeSelection.path:{}} onSelect={selectFromTree}/>
                <div className="relative min-w-0 flex-1">
              <BodyViewer gender={gender} regions={regions} selected={selected} onSelect={selectRegion} view={view} resetKey={resetKey} markers={markers} back={back} highlightColor={palettes[palette].color}/>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-wrap items-start justify-between gap-2">
                <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-lg border bg-background/95 p-1 shadow-sm">
                  <ToggleGroup type="single" value={view} variant="outline" className="bg-background" aria-label={t("Anatomy view")} onValueChange={value=>{if(value)setView(value as AnatomyView)}}>
                    <IconToggle value="organs" label={t("Organs view")}><Heart aria-hidden="true"/></IconToggle>
                    <IconToggle value="skeleton" label={t("Skeleton view")}><Bone aria-hidden="true"/></IconToggle>
                    <IconToggle value="surface" label={t("Surface view")}><UserRound aria-hidden="true"/></IconToggle>
                  </ToggleGroup>
                  {genderSelector}
                </div>
                <div className="pointer-events-auto ml-auto flex items-center gap-1 rounded-lg border bg-background/95 p-1 shadow-sm">
                  <ToolButton label={t("Reset view")} onClick={reset}><Focus aria-hidden="true"/></ToolButton>
                  <ToolButton label={t(markers?'Hide labels and markers':'Show labels and markers')} pressed={markers} onClick={()=>setMarkers(!markers)}>{markers?<Eye aria-hidden="true"/>:<EyeOff aria-hidden="true"/>}</ToolButton>
                  <ToolButton label={t("Switch front / back view")} pressed={back} onClick={()=>{setBack(!back);setResetKey(k=>k+1)}}><Rotate3D aria-hidden="true"/></ToolButton>
                  <ToolButton label={t('Minimize 3D model')} expanded={true} controls="anatomy-panel-content" onClick={()=>setModelMinimized(true)}><Minimize2 aria-hidden="true"/></ToolButton>
                </div>
              </div>
            </div>}</div>
          </Card>
          <CancerPanel region={region} regions={regions} gender={gender} color={palettes[palette].color} onRegionChange={selectRegion} navigation={navigation} onPathChange={path=>setTreeSelection({regionId:selected,gender,path})}/>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t pt-4"><p className="flex items-center gap-2 text-xs text-muted-foreground"><Info className="size-3.5 shrink-0"/>{t("For education and awareness. Not medical advice.")}</p><Sources/></footer>
      </main>
    </div>
  </TooltipProvider>
}
export default App
