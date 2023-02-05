import { I18n } from 'i18n'

export const client = new I18n({
  locales: ['en', 'pt-br'],
  directory: './assets/locales',
  defaultLocale: 'en',
  api: {
    __: 't',
    __n: 'tn'
  },
  syncFiles: true
})

export const lt = (locale: string, phrase: string) => client.__({
  phrase,
  locale
})