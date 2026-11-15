import { useState } from 'react'
import { Download, FileCode2, Image, LoaderCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n/provider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createReport } from '@/lib/report/model'
import { downloadHtml, downloadPng } from '@/lib/report/download'
import type { Region, Gender } from '@/data/regions'
import type { CancerFamily } from '@/data/cancer-taxonomy'
import type { DetailPath } from '@/data/cancer-detail'
export function ReportExport({region,families,gender,path,color}:{region:Region;families:CancerFamily[];gender:Gender;path:DetailPath;color:string}) {
 const {t,language}=useI18n(),[scope,setScope]=useState<'region'|'branch'>('branch'),[busy,setBusy]=useState(false),[message,setMessage]=useState('')
 const run=async(format:'html'|'png')=>{
  setBusy(true);setMessage('')
  try {const report=createReport({region,families,gender,path,language,color,scope});if(format==='html')downloadHtml(report);else await downloadPng(report);setMessage(t('Report downloaded.'))}
  catch(error){setMessage(t(error instanceof Error?error.message:'Report export failed.'))}finally{setBusy(false)}
 }
 return <Dialog><DialogTrigger asChild><Button variant="outline" size="sm"><Download/>{t('Export report')}</Button></DialogTrigger><DialogContent closeLabel={t('Close')}><DialogHeader><DialogTitle>{t('Export report')}</DialogTitle><DialogDescription>{t('Download a standalone report with the classification diagram, treatments, frequency denominators, and source links.')}</DialogDescription></DialogHeader><p className="text-sm font-medium">{t(region.name)}</p><Select value={scope} onValueChange={value=>{if(value==='region'||value==='branch')setScope(value)}}><SelectTrigger aria-label={t('Report scope')}><SelectValue/></SelectTrigger><SelectContent><SelectItem value="branch">{t('Selected branch')}</SelectItem><SelectItem value="region">{t('Full selected region')}</SelectItem></SelectContent></Select><p className="text-xs text-muted-foreground">{t('The report uses the current language. It contains educational information, not a patient record or personalized treatment plan.')}</p><div className="flex flex-wrap gap-2"><Button disabled={busy} onClick={()=>void run('html')}><FileCode2/>{t('Download HTML')}</Button><Button variant="outline" disabled={busy} onClick={()=>void run('png')}>{busy?<LoaderCircle className="animate-spin"/>:<Image/>}{t('Download PNG')}</Button></div>{message&&<Alert><AlertDescription role="status">{message}</AlertDescription></Alert>}</DialogContent></Dialog>
}
