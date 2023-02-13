import i18next from 'i18next'
import { isDevelopment } from '../utils.js'
import Backend, { FsBackendOptions } from 'i18next-fs-backend'
import { debug } from '../loggingEngine/logging.js'

i18next
  .use(Backend)
  .init<FsBackendOptions>({
    fallbackLng: 'en',
    preload: ['en', 'pt'],
    ns: ['commands', 'errors', 'args', 'descriptions'],
    saveMissing: isDevelopment,
    saveMissingTo: 'all',
    saveMissingPlurals: true,
    backend: {
      loadPath: 'assets/locales/{{lng}}/{{ns}}.json',
      addPath: 'assets/locales/{{lng}}/{{ns}}.missing.json'
    },
    interpolation: {
      escape: (str: string): string => {
        return str.replace(/[*_`~#&<>"'\/\[\]]/g, '\\$&')
      }
    }
  }).then(() => {
  debug('translationEngine.main', 'i18next initialized')
})

export const lt = (locale: string, key: string, data: Record<string, any>) => {
  debug('translationEngine.lt', `translating ${key} for ${locale}`)
  return i18next.t(key, { lng: locale, ...data })
}
