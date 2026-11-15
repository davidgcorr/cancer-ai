import { formatFrequency, hasPublishedFrequency } from '@/lib/frequency'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Fragment } from 'react'
import type { CancerFamily, CancerSubtype } from '@/data/cancer-taxonomy'
import type { Frequency } from '@/data/cancer-evidence'
import { resolveDetail } from '@/data/cancer-detail'
import type { DetailPath } from '@/data/cancer-detail'
import type { Region } from '@/data/regions'

export function FrequencyInfo({frequency,compact=false}:{frequency?:Frequency;compact?:boolean}) {
 const {t,language}=useI18n()
 if(!hasPublishedFrequency(frequency))return null
 const formatted=formatFrequency(frequency,language)
 if(compact)return <Badge variant="outline" title={t(frequency!.denominator)}>{formatted}</Badge>
 return <Card className="gap-3 py-4 shadow-none"><CardHeader className="px-4"><CardTitle className="text-sm">{t('Share among site cases')}</CardTitle><CardDescription>{t('Population frequency, not personal risk.')}</CardDescription></CardHeader><CardContent className="space-y-2 px-4"><p className="text-2xl font-semibold tabular-nums">{formatted}</p>{frequency&&<><p className="text-sm">{t(frequency.denominator)}</p><p className="text-xs text-muted-foreground">{t(frequency.population)} · {t(frequency.period)}</p><p className="text-xs leading-relaxed text-muted-foreground">{t(frequency.note)}</p><Button variant="link" size="sm" className="h-auto px-0" asChild><a href={frequency.source} target="_blank" rel="noreferrer">{t('Frequency source')}<ArrowUpRight/></a></Button></>}</CardContent></Card>
}
function SubtypeSummary({subtype}:{subtype:CancerSubtype}) {
 const {t}=useI18n()
 return <div className="space-y-3"><p className="text-sm leading-relaxed text-muted-foreground">{t(subtype.classification.note)}</p><div className="space-y-2"><h4 className="text-sm font-medium">{t('Main treatment options')}</h4><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{subtype.treatment?.modalities.map(option=><Card key={option} className="gap-0 py-0 shadow-none"><CardContent className="p-4"><p className="text-sm leading-relaxed font-medium">{t(option)}</p></CardContent></Card>)}</div><p className="text-xs leading-relaxed text-muted-foreground">{t(subtype.treatment?.context??'')}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" asChild><a href={subtype.source} target="_blank" rel="noreferrer">{t('Classification source')}<ArrowUpRight/></a></Button><Button variant="outline" size="sm" asChild><a href={subtype.treatment?.source??subtype.source} target="_blank" rel="noreferrer">{t('Treatment source')}<ArrowUpRight/></a></Button></div></div>
}
export function CancerDetails({region,families,path,choices,onNavigate}:{region:Region;families:CancerFamily[];path:DetailPath;choices?:DetailPath[];onNavigate:(path:DetailPath)=>void}) {
 const {t}=useI18n()
 const detail=resolveDetail(region,families,path)
 if(choices&&choices.length>1)return <div className="space-y-4"><h2 className="text-lg font-semibold">{t('Choose the parent subtype')}</h2><p className="text-sm text-muted-foreground">{t('This classification belongs to multiple subtypes. Choose one to view its actual parent path and treatment context.')}</p>{choices.map(choice=>{const entry=resolveDetail(region,families,choice);return <Button key={`${choice.familyId}:${choice.subtypeId}`} variant="outline" className="h-auto w-full justify-between py-3 text-left whitespace-normal" onClick={()=>onNavigate(choice)}><span>{t(entry.family!.label)} → {t(entry.subtype!.label)}</span><ArrowRight/></Button>})}</div>
 return <div className="space-y-5">
  <Breadcrumb aria-label={t('Cancer hierarchy')}><BreadcrumbList>{detail.breadcrumbs.map((crumb,i)=><Fragment key={i}>{i>0&&<BreadcrumbSeparator/>}<BreadcrumbItem>{i===detail.breadcrumbs.length-1?<BreadcrumbPage>{t(crumb.label)}</BreadcrumbPage>:<BreadcrumbLink asChild><Button variant="link" className="h-auto p-0 text-left whitespace-normal" onClick={()=>onNavigate(crumb.path)}>{t(crumb.label)}</Button></BreadcrumbLink>}</BreadcrumbItem></Fragment>)}</BreadcrumbList></Breadcrumb>
  <div className="space-y-2"><h2 className="text-xl font-semibold">{t(detail.title)}</h2><p className="text-sm text-muted-foreground">{t(detail.subtype?.classification.system??region.system)}</p>{!detail.family&&<p className="text-sm leading-relaxed text-muted-foreground">{t(region.description)}</p>}</div>
  {detail.stage&&<p className="rounded-md border bg-muted/40 p-3 text-sm">{t('The options below describe the subtype, not a stage-specific prescription. Use the linked source for stage-specific treatment.')}</p>}
  {detail.subtype?<>
    <FrequencyInfo frequency={detail.subtype.frequency}/>
    <SubtypeSummary subtype={detail.subtype}/>
    {!detail.stage&&<div className="space-y-3"><h3 className="text-sm font-medium">{t('Stages and classifications')}</h3><div className="flex flex-wrap gap-2">{detail.subtype.classification.labels.map(stage=><Button key={stage} variant="outline" size="sm" onClick={()=>onNavigate({...detail.path,stage})}>{t(stage)}</Button>)}</div></div>}
  </>:detail.family?<>
    <FrequencyInfo frequency={detail.family.frequency}/>
    <h3 className="text-sm font-medium">{t('Histologic and disease subtypes')}</h3>
    <Accordion type="multiple">{detail.family.subtypes.map(subtype=><AccordionItem value={subtype.id} key={subtype.id}><AccordionTrigger><span className="flex w-full flex-wrap items-center justify-between gap-2 pr-2"><span>{t(subtype.label)}</span><FrequencyInfo frequency={subtype.frequency} compact/></span></AccordionTrigger><AccordionContent className="space-y-4"><SubtypeSummary subtype={subtype}/><Button variant="outline" size="sm" onClick={()=>onNavigate({familyId:detail.family!.id,subtypeId:subtype.id})}>{t('Open subtype details')}<ArrowRight/></Button></AccordionContent></AccordionItem>)}</Accordion>
  </>:<div className="space-y-3">{families.map(family=><Card key={family.id} className="gap-3 py-4 shadow-none"><CardHeader className="px-4"><CardTitle className="text-base">{t(family.label)}</CardTitle><CardDescription>{t('Subtypes')}: {family.subtypes.length}</CardDescription></CardHeader><CardContent className="flex items-center justify-end gap-3 px-4 has-[[data-slot=badge]]:justify-between"><FrequencyInfo frequency={family.frequency} compact/><Button variant="outline" size="sm" onClick={()=>onNavigate({familyId:family.id})}>{t('Open details')}<ArrowRight/></Button></CardContent></Card>)}</div>}
  <p className="text-xs text-muted-foreground">{t('Coverage: major and selected rare histologies; not a complete WHO or ICD-O catalog. Overlapping umbrella categories must not be added together.')}</p>
 </div>
}
