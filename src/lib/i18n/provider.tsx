import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { savedLanguage, translate } from './core'
import type { Language } from './core'
type I18n = { language: Language; setLanguage: (language: Language) => void; t: (text: string, values?: Record<string,string|number>) => string }
const Context = createContext<I18n | null>(null)
export function I18nProvider({children}:{children:ReactNode}) {
  const [language,setLanguage] = useState<Language>(savedLanguage)
  useEffect(()=>{
    document.documentElement.lang = language
    document.title = `onco-milver — ${translate(language,'Body explorer')}`
    try {localStorage.setItem('onco-milver-language',language)} catch { /* Language changes still work without browser storage. */ }
  },[language])
  const value=useMemo(()=>({language,setLanguage,t:(text:string,values?:Record<string,string|number>)=>translate(language,text,values)}),[language])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useI18n() { const context=useContext(Context);if(!context)throw new Error('I18nProvider is required');return context }
