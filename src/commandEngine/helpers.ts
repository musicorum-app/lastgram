export const fixTelegramLanguageCode = (code: string | undefined): string => {
  // IETF to ISO 639-1
  return code || 'en'
}