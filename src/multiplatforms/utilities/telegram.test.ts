import { describe, expect, it, mock, beforeEach } from 'bun:test'

const mockHasCommand = mock((name: string) => name === 'pl')
const mockFindCommand = mock((name: string) => {
    if (name === 'pl') return { name: 'listening', noPrefix: true }
    if (name === 'you') return { name: 'youtrack', noPrefix: true }
    if (name === 'start') return { name: 'start', noPrefix: false }
    return undefined
})
const mockCorrectName = mock((name: string) => {
    if (name === 'pl') return 'listening'
    if (name === 'you') return 'youtrack'
    if (name === 'start') return 'start'
    return undefined
})
const mockRunCommand = mock(async (...args: any[]) => undefined)

mock.module('@/commands', () => ({
    commandRunner: {
        hasCommand: mockHasCommand,
        findCommand: mockFindCommand,
        correctName: mockCorrectName,
        runCommand: mockRunCommand,
    },
}))

mock.module('@/database', () => ({
    client: {
        user: {
            updateMany: async () => ({}),
        },
    },
}))

const { handleTelegramMessage } = await import('./telegram')

const baseMessage = (text: string) => ({
    text,
    message_id: 1,
    date: Date.now(),
    from: { id: 1, first_name: 'Tester' },
    chat: { id: 1, type: 'private' },
})

describe('handleTelegramMessage', () => {
    beforeEach(() => {
        mockHasCommand.mockClear()
        mockFindCommand.mockClear()
        mockCorrectName.mockClear()
        mockRunCommand.mockClear()
    })

    it('dispatches a whitelisted command when sent without a slash', async () => {
        await handleTelegramMessage('lastgrambot', baseMessage('pl'))
        expect(mockRunCommand).toHaveBeenCalledTimes(1)
        expect(mockRunCommand.mock.calls[0][0]).toBe('pl')
    })

    it('dispatches another whitelisted alias without a slash', async () => {
        await handleTelegramMessage('lastgrambot', baseMessage('you'))
        expect(mockRunCommand).toHaveBeenCalledTimes(1)
        expect(mockRunCommand.mock.calls[0][0]).toBe('you')
    })

    it('does not dispatch a real command that is not opted in', async () => {
        await handleTelegramMessage('lastgrambot', baseMessage('start'))
        expect(mockRunCommand).not.toHaveBeenCalled()
    })

    it('does not dispatch on free text', async () => {
        await handleTelegramMessage('lastgrambot', baseMessage('hello there'))
        expect(mockRunCommand).not.toHaveBeenCalled()
    })

    it('still dispatches the slash-prefixed form', async () => {
        await handleTelegramMessage('lastgrambot', baseMessage('/pl'))
        expect(mockRunCommand).toHaveBeenCalledTimes(1)
        expect(mockRunCommand.mock.calls[0][0]).toBe('pl')
    })
})
