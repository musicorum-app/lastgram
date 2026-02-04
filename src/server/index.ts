import { info } from '@/logging/logging'
import { register } from '@/logging/prometheus'

const PORT = process.env.PORT || 4000
export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:' + PORT

const server = Bun.serve({
    port: PORT,
    async fetch(req: Request) {
        const url = new URL(req.url)

        if (url.pathname === '/metrics' && req.method === 'GET') {
            const metrics = await register.metrics()
            return new Response(metrics, {
                status: 200,
                headers: {
                    'Content-Type': register.contentType,
                },
            })
        }

        return new Response('Not Found', { status: 404 })
    },
})

export const start = async () => {
    info('server.start', `listening on port ${server.port}`)
}
