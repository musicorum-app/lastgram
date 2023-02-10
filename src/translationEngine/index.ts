import i18next from 'i18next'
import { isDevelopment } from '../utils.js'
import Backend, { FsBackendOptions } from 'i18next-fs-backend'
import { debug } from '../loggingEngine/logging.js'

i18next
  .use(Backend)
  .init<FsBackendOptions>({
    lng: 'en',
    nonExplicitSupportedLngs: true,
    preload: ['en', 'pt'],
    ns: ['core', 'commands', 'errors', 'args', 'descriptions'],
    saveMissing: isDevelopment,
    saveMissingTo: 'all',
    saveMissingPlurals: true,
    backend: {
      loadPath: 'assets/locales/{{lng}}/{{ns}}.json',
      addPath: 'assets/locales/{{lng}}/{{ns}}.missing.json'
    }
  }).then(() => {
  debug('translationEngine.main', 'i18next initialized')
})

export const lt = (locale: string, key: string, data: Record<string, any>) => {
  return i18next.t(key, { lng: locale, ...data })
}
