import { Context, MinimalContext } from '@/multiplatforms/common/context'
import { ClassicCollageData, generateAsymmetricCollage } from '@/internal/ditto'
import { inferDataFromContent, ModifiedClassicCollageData } from '../../helpers.js'
import { backend } from '@/caching'
import { ExpiredError } from '@/event/types/errors'
import { CommandButtonComponentType } from '@/multiplatforms/common/components/button'
import { debug } from '@/logging/logging'

const generateAndSaveData = async (ctx: MinimalContext, names: {
    displayName: string;
    username: string
}, data: ClassicCollageData) => {
    const imageURL = await generateAsymmetricCollage(ctx, names.username, data)
    debug('commands.collage', `collage generated: ${imageURL}`)

    const id = await backend!.quickSave(JSON.stringify({ ...data, ...names }))
    buildComponents(ctx, data, id)
    return imageURL
}

export default async (ctx: Context) => {
    const data = inferDataFromContent(ctx.message.content)
    const username = ctx.targetedUserData?.fmUsername ?? ctx.registeredUserData!.fmUsername
    const displayName = ctx.targetedUser?.name ?? ctx.registeredUser!.name

    const imageURL = await generateAndSaveData(ctx, { username, displayName }, data)
    ctx.reply(`${displayName}, ${data.entity}, ${data.period}`, {}, {
        imageURL,
        sendImageAsPhoto: true,
        noTranslation: true
    })
}

export const refreshCollage = async (ctx: MinimalContext) => {
    const [id, action] = ctx.interactionData!.split('_')
    const cllgData = await backend!.get(id)
    if (!cllgData) throw new ExpiredError()
    const data = JSON.parse(cllgData) as ModifiedClassicCollageData

    switch (action) {
        case 'labels':
            data.show_labels = !data.show_labels
            break
        case 'artist':
            data.entity = 'artist'
            break
        case 'album':
            data.entity = 'album'
            break
        case 'track':
            data.entity = 'track'
            break
        case '7d':
            data.period = '7day'
            break
        case '1m':
            data.period = '1month'
            break
        case '3m':
            data.period = '3month'
            break
        case '6m':
            data.period = '6month'
            break
        case 'overall':
            data.period = 'overall'
            break
    }

    await backend!.quickEdit(id, JSON.stringify(data))

    const imageURL = await generateAndSaveData(ctx, { username: data.username, displayName: data.displayName }, data)
    ctx.reply(`${data.displayName}, ${data.entity}, ${data.period}`, {}, {
        imageURL,
        sendImageAsPhoto: true,
        noTranslation: true
    })
}

const buildComponents = (ctx: MinimalContext, data: ClassicCollageData, id: string) => {
    ctx.components.newGroup((b) => {
        b.addButton({
            emoji: data.show_labels ? '✅' : '❌',
            name: 'commands:cllg.buttons.showLabels',
            type: CommandButtonComponentType.primary,
            data: id + '_labels'
        }, 'refreshCollage')
    })

    ctx.components.newGroup((b) => {
        b.addButton({
            emoji: '🧑‍🎤',
            name: 'commands:cllg.buttons.artist',
            type: CommandButtonComponentType.primary,
            data: id + '_artist'
        }, 'refreshCollage')

        b.addButton({
            emoji: '💿',
            name: 'commands:cllg.buttons.album',
            type: CommandButtonComponentType.primary,
            data: id + '_album'
        }, 'refreshCollage')

        b.addButton({
            emoji: '🎵',
            name: 'commands:cllg.buttons.track',
            type: CommandButtonComponentType.primary,
            data: id + '_track'
        }, 'refreshCollage')
    })

    ctx.components.newGroup((b) => {
        b.addButton({
            emoji: '7️⃣',
            name: 'commands:cllg.buttons.m',
            type: CommandButtonComponentType.primary,
            data: id + '_7d'
        }, 'refreshCollage')

        b.addButton({
            emoji: '1️⃣',
            name: 'commands:cllg.buttons.m',
            type: CommandButtonComponentType.primary,
            data: id + '_1m'
        }, 'refreshCollage')

        b.addButton({
            emoji: '3️⃣',
            name: 'commands:cllg.buttons.m',
            type: CommandButtonComponentType.primary,
            data: id + '_3m'
        }, 'refreshCollage')

        b.addButton({
            emoji: '6️⃣',
            name: 'commands:cllg.buttons.m',
            type: CommandButtonComponentType.primary,
            data: id + '_6m'
        }, 'refreshCollage')

        b.addButton({
            emoji: '📅',
            name: 'commands:cllg.buttons.m',
            type: CommandButtonComponentType.primary,
            data: id + '_overall'
        }, 'refreshCollage')
    })
}

export const info = {
    aliases: []
}
