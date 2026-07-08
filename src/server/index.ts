import { info, error } from '@/logging/logging'
import { register } from '@/logging/prometheus'
import { platformManager } from '@/multiplatforms/index'
import Telegram from '@/multiplatforms/platforms/telegram'

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

        const secretPath = process.env.WEBHOOK_SECRET_PATH
        if (url.pathname === `/webhook/telegram/${secretPath}` && req.method === 'POST') {
            try {
                const body = await req.json()
                const telegramPlatform = platformManager?.findPlatform('telegram') as Telegram
                if (telegramPlatform) {
                    telegramPlatform.processUpdate(body).catch((e: Error) => error('server.telegramWebhook', e.stack || e.message))
                    return new Response('OK', { status: 200 })
                }
                return new Response('Telegram platform not configured', { status: 500 })
            } catch (e: any) {
                error('server.telegramWebhook', `Error processing webhook: ${e.stack || e.message}`)
                return new Response('Internal Server Error', { status: 500 })
            }
        }

        return new Response('Not Found', { status: 404 })
    },
})

export const start = async () => {
    info('server.start', `listening on port ${server.port}`)
}
