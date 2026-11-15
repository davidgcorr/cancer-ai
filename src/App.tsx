import { useI18n } from '@/lib/i18n/provider'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, Check, Circle, Eye, EyeOff, Focus, Info, Mars, Rotate3D, Settings, Venus } from 'lucide-react'
import { ATTRIBUTION } from 'open-anatomy-3d'
import { CancerPanel } from '@/components/CancerPanel'
import { BodyViewer } from '@/components/BodyViewer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
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

function ToolButton({ label, onClick, children, pressed }: { label: string; onClick: () => void; children: ReactNode; pressed?: boolean }) {
  return <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" aria-label={label} aria-pressed={pressed} onClick={onClick}>{children}</Button></TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>
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
  useEffect(() => {
    document.documentElement.dataset.palette = palette
    try { localStorage.setItem('onco-milver-palette', palette) } catch { /* Preferences are optional when storage is unavailable. */ }
  }, [palette])
  const regions = useMemo(() => getRegions(gender), [gender])
  const region = regions.find(r => r.id === selected)!
  const selectRegion = (id: RegionId) => { setSelected(id); setView(viewForRegion(id)) }
  const reset = () => { setBack(false); setResetKey(k => k + 1) }
  return <TooltipProvider>
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5"><Circle className="size-5" strokeWidth={1.75} aria-hidden="true"/><span className="text-base font-semibold tracking-tight">onco-milver</span></div>
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
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-1.5"><h1 className="text-2xl font-semibold tracking-tight">{t("Body explorer")}</h1><p className="text-sm text-muted-foreground">{t("Select a region to explore cancer types, subtypes, and disease-specific staging.")}</p></div>
        <div className="grid items-start gap-4 md:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(300px,1fr)_minmax(440px,1.25fr)]">
          <Card className="gap-5 shadow-none">
            <CardHeader><CardTitle>{t("Body model")}</CardTitle><CardDescription>{t("Select the anatomy to display.")}</CardDescription></CardHeader>
            <CardContent className="space-y-5">
              <ToggleGroup type="single" variant="outline" value={gender} className="w-full" onValueChange={value=>{if(value){setGender(value as Gender);reset()}}} aria-label={t("Gender")}>
                <ToggleGroupItem value="male" className="min-w-0 flex-1 gap-2 px-2" aria-label={t("Male")} title={t("Male")}><Mars aria-hidden="true" className="size-4 shrink-0"/><span aria-hidden="true">{t("Male").charAt(0).toLocaleUpperCase(language)}</span></ToggleGroupItem>
                <ToggleGroupItem value="female" className="min-w-0 flex-1 gap-2 px-2" aria-label={t("Female")} title={t("Female")}><Venus aria-hidden="true" className="size-4 shrink-0"/><span aria-hidden="true">{t("Female").charAt(0).toLocaleUpperCase(language)}</span></ToggleGroupItem>
              </ToggleGroup>
              <Separator/>
              <div className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-sm font-medium">{t("Body regions")}</h2><Badge variant="secondary">{regions.length}</Badge></div>
                <div className="flex flex-wrap gap-1 md:max-h-[468px] md:flex-col md:flex-nowrap md:overflow-y-auto" role="group" aria-label={t("Body regions")}>{regions.map(r=><Button key={r.id} variant={selected===r.id?'secondary':'ghost'} className={`shrink-0 justify-between md:w-full ${selected===r.id?'text-primary':''}`} onClick={()=>selectRegion(r.id)} aria-pressed={selected===r.id}>{t(r.name)}{selected===r.id&&<Check className="size-4"/>}</Button>)}</div>
              </div>
            </CardContent>
            <CardFooter><p className="text-xs leading-relaxed text-muted-foreground">{t("Select a region here or directly on the model.")}</p></CardFooter>
          </Card>
          <Card className="gap-0 overflow-hidden py-0 shadow-none">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-3 sm:p-4">
              <ToggleGroup type="single" value={view} variant="outline" aria-label={t("Anatomy view")} onValueChange={value=>{if(value)setView(value as AnatomyView)}}>
                <ToggleGroupItem value="organs" aria-label={t("Organs view")}>{t("Organs")}</ToggleGroupItem><ToggleGroupItem value="skeleton" aria-label={t("Skeleton view")}>{t("Skeleton")}</ToggleGroupItem><ToggleGroupItem value="surface" aria-label={t("Surface view")}>{t("Surface")}</ToggleGroupItem>
              </ToggleGroup>
              <Badge variant="outline" aria-label={t(gender==='male'?'Male':'Female')} title={t(gender==='male'?'Male':'Female')}>{gender==='male'?<Mars aria-hidden="true"/>:<Venus aria-hidden="true"/>}<span aria-hidden="true">{t(gender==='male'?'Male':'Female').charAt(0).toLocaleUpperCase(language)}</span></Badge>
            </div>
            <div className="relative h-[520px] bg-muted/40 sm:h-[620px]">
              <BodyViewer gender={gender} regions={regions} selected={selected} onSelect={selectRegion} view={view} resetKey={resetKey} markers={markers} back={back} highlightColor={palettes[palette].color}/>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t p-3">
              <p className="text-xs text-muted-foreground">{t("Drag to rotate · Scroll to zoom")}</p>
              <div className="flex items-center gap-2">
                <ToolButton label={t("Reset view")} onClick={reset}><Focus/></ToolButton>
                <ToolButton label={t(markers?'Hide labels and markers':'Show labels and markers')} pressed={markers} onClick={()=>setMarkers(!markers)}>{markers?<Eye/>:<EyeOff/>}</ToolButton>
                <Tooltip><TooltipTrigger asChild><Button variant="outline" size="sm" onClick={()=>{setBack(!back);setResetKey(k=>k+1)}}><Rotate3D/>{t(back?'Back':'Front')}</Button></TooltipTrigger><TooltipContent>{t("Switch front / back view")}</TooltipContent></Tooltip>
              </div>
            </div>
          </Card>
          <CancerPanel region={region} regions={regions} gender={gender} color={palettes[palette].color} onRegionChange={selectRegion}/>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t pt-4"><p className="flex items-center gap-2 text-xs text-muted-foreground"><Info className="size-3.5 shrink-0"/>{t("For education and awareness. Not medical advice.")}</p><Sources/></footer>
      </main>
    </div>
  </TooltipProvider>
}
export default App
