import i18next from "i18next"
import { isDevelopment } from "../utils.js"
import Backend, { FsBackendOptions } from "i18next-fs-backend"
import { debug } from "../logging/logging.js"

i18next
    .use(Backend)
    .init<FsBackendOptions>({
        fallbackLng: "en",
        preload: ["en", "pt", "es", "ru", "fr"],
        ns: ["core", "commands", "errors", "args", "descriptions"],
        saveMissing: isDevelopment,
        saveMissingTo: "all",
        saveMissingPlurals: true,
        joinArrays: "\n",
        backend: {
            loadPath: "assets/locales/{{lng}}/{{ns}}.json",
            addPath: "assets/locales/{{lng}}/{{ns}}.missing.json",
        },
        interpolation: {
            escape: (str: string): string => {
                return str.replace(/[*_`~#&<>"'\/\[\]]/g, "\\$&")
            },
        },
    })
    .then(() => {
        debug("translations.main", "i18next initialized")
    })

export const lt = (locale: string, key: string, data: Record<string, any>) => {
    return i18next.t(key, { lng: locale, ...data })
}
