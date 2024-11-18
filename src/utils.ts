export const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production'

export const isBun = !!process.versions.bun