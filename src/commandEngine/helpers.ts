export const fixTelegramLanguageCode = (code: string | undefined) => {
  // IETF to ISO 639-1
  return code || 'en'
}