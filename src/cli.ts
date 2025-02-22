process.env['CLI_MODE'] = 'true'
process.env['FM_API_KEY'] = process.env['FM_API_KEY'] || 'a'
process.env['NODE_ENV'] = 'production'

await import('./cliEngine/index.js')

export { }
