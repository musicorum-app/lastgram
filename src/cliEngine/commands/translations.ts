import fs from 'fs'
import { bold, italic } from '../../loggingEngine/logging.js'

interface MissingKey {
  key: string
  ns: string
  lang: string
}

const namespaces: string[] = ['core', 'commands', 'errors', 'args', 'descriptions']
const allowedMissingKeys: string[] = ['youartist', 'youalbum', 'youtrack', 'meartist', 'mealbum', 'metrack', 'listening', 'assembledLyrics', 'album', 'artist', 'cllg.buttons.m', 'common.tags_hasTags', 'common.tags_noTags']

export const checkTranslations = () => {
  const locales = fs.readdirSync('assets/locales')
  const errors = new Map<string, MissingKey[]>()

  const engMissing = getMissingKeys('en', 'commands')
  if (engMissing.length) {
    console.error(`English translations are missing keys. Please fix them before checking other languages.`)
    printMissingKeys(engMissing)
  }

  for (const locale of locales) {
    if (locale === 'en') continue
    for (const ns of namespaces) {
      const english = JSON.parse(fs.readFileSync(`assets/locales/en/${ns}.json`, 'utf-8'))
      const missingKeys = getMissingKeysComparing(locale, ns, english).filter(key => !allowedMissingKeys.includes(key.key))
      if (missingKeys.length) {
        const err = errors.get(locale)
        errors.set(locale, err ? [...err, ...missingKeys] : missingKeys)
      }

      console.log(italic(`Checking ${locale}/${ns}...`), bold(missingKeys.length.toString()), 'missing keys')
    }
  }

  for (const missingKeys of Object.values(errors)) {
    printMissingKeys(missingKeys)
  }
}

const getMissingKeys = (locale: string, ns: string) => {
  // we basically load the ns.missing.json file. if we can load it, we load the actual file.
  // if the missing file has keys that the main file doesn't have, we add them to it, save the file and return its issues
  const missingFile = `assets/locales/${locale}/${ns}.missing.json`
  const mainFile = `assets/locales/${locale}/${ns}.json`

  let missingRaw
  try {
    missingRaw = fs.readFileSync(missingFile, 'utf-8')
  } catch (e) {
    return []
  }

  const missing = JSON.parse(missingRaw)
  const main = JSON.parse(fs.readFileSync(mainFile, 'utf-8'))

  return checkMissing(main, missing).map(key => ({ key, ns, lang: locale })) as MissingKey[]
}

const getMissingKeysComparing = (locale: string, ns: string, main: TranslationFile) => {
  // we use the main file as the "missing" file, since we're comparing to it.
  const missing = JSON.parse(fs.readFileSync(`assets/locales/${locale}/${ns}.json`).toString())
  return checkMissing(missing, main).map(key => ({ key, ns, lang: locale })) as MissingKey[]
}


type TranslationFile = {
  [key: string]: TranslationValue;
};

type TranslationValue = string | string[] | TranslationFile;

const handleMissingKey = (value: TranslationValue, currentPath: string) => {
  if (typeof value === 'object' && !Array.isArray(value)) {
    const subKeys = Object.keys(value)
    return subKeys.map(subKey => `${currentPath}.${subKey}`)
  }
  return [currentPath]
}

const compareValues = (main: TranslationValue, value: TranslationValue, currentPath: string): string[] => {
  if (typeof value === 'string') {
    return typeof main === 'string' ? [] : [currentPath]
  }

  if (Array.isArray(value)) {
    return (!Array.isArray(main) || main.length !== value.length) ? [currentPath] : []
  }

  if (typeof value === 'object') {
    return checkMissing(main as TranslationFile, value as TranslationFile, currentPath)
  }

  return []
}

const checkMissing = (main: TranslationFile, missing: TranslationFile, path: string = '') => {
  return Object.entries(missing).flatMap(([key, value]) => {
    const currentPath = path ? `${path}.${key}` : key

    if (!Object.prototype.hasOwnProperty.call(main, key)) {
      return handleMissingKey(value, currentPath)
    }

    return compareValues(main[key], value, currentPath)
  })
}

let currentNs = ''
const printMissingKeys = (keys: MissingKey[]) => {
  // sort by ns
  console.error(`${bold(keys.length.toString())} keys were found to be missing while checking ${bold(keys[0].lang)}/${bold(keys[0].ns)}:`)
  keys = keys.sort((a, b) => a.ns.localeCompare(b.ns))
  let currentIdent = '    '
  for (const key of keys) {
    if (key.ns !== currentNs) {
      console.log('  ', key.ns)
      currentIdent = '    '
      currentNs = key.ns
    }

    printKey(key.key, currentIdent)
  }
}

let pastKey = ''
const printKey = (key: string, currentIdent: string) => {
  let keepIdent = false
  if (key.startsWith(`${pastKey}.`)) {
    key = key.replace(`${pastKey}.`, '')
    keepIdent = true
  }

  const keys = key.split('.')
  keys.forEach((key, i) => {
    const ident = currentIdent + ' '.repeat(i * 2 + (keepIdent ? 2 : 0))
    console.error(`${ident}${key}`)
  })

  pastKey = keys[0]
}