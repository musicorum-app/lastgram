import { ClassicCollageData } from '@/internal/ditto'

export const fixLanguageFormat = (code: string | undefined) => code?.split?.('-')?.[0]
export const inferDataFromContent = (content: string): ClassicCollageData => {
    let rows = 3
    let columns = 3
    // check if there are any "NxN" in the content (e.g. 3x3 or 10x10)
    const match = content.match(/(\d+)x(\d+)/)
    if (match) {
        rows = parseInt(match[1])
        columns = parseInt(match[2])
    }

    // check if there is "artist", "album" or "track" in the content
    let entity: 'artist' | 'album' | 'track' = 'artist'
    if (['album', 'alb', 'álbum'].some((a) => content.includes(a))) entity = 'album'
    if (['track', 'trk', 'faixa'].some((a) => content.includes(a))) entity = 'track'
    if (['artist', 'art', 'artista'].some((a) => content.includes(a))) entity = 'artist'

    // check the period
    let period: '7day' | '1month' | '3month' | '6month' | '12month' | 'overall' = 'overall'
    if (['7day', '7days', '7dias', '7d', '1s', '1w'].some((a) => content.includes(a))) period = '7day'
    if (['1month', '1mês', '1mes', '1m'].some((a) => content.includes(a))) period = '1month'
    if (['3month', '3mês', '3mes', '3m'].some((a) => content.includes(a))) period = '3month'
    if (['6month', '6mês', '6mes', '6m'].some((a) => content.includes(a))) period = '6month'
    if (['12month', '12mês', '12mes', '12m', '1y'].some((a) => content.includes(a))) period = '12month'

    return { rows, columns, entity, padded: false, show_labels: false, period }
}

export interface ModifiedClassicCollageData extends ClassicCollageData {
    username: string
    displayName: string
}
