export const fixLanguageFormat = (code: string | undefined) => {
  // IETF code to en-US format
  if (code === 'en') return 'en-US'
  if (code === 'zh') return 'zh-CN'
  if (code === 'pt') return 'pt-BR'
  return code
}
