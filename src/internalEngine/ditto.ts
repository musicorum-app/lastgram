import { MinimalContext } from '../multiplatformEngine/common/context.js'
import { CollageError } from '../commandEngine/errors.js'
import { error, grey } from '../loggingEngine/logging.js'

export interface CollageData {
  period: '7day' | '1month' | '3month' | '6month' | '12month' | 'overall',
  entity: 'artist' | 'album' | 'track',
  show_labels: boolean
}

export interface ClassicCollageData extends CollageData {
  padded: boolean
  rows: number
  columns: number
}

const buildRequestBody = (theme: string, data: Record<string, any>) => JSON.stringify({
  theme,
  data
})

export const generateClassicCollage = async (
  ctx: MinimalContext,
  username: string,
  collageData: ClassicCollageData
) => {
  const request = await fetch(`${process.env.DITTO_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: buildRequestBody('classic_collage', { ...collageData, username })
  })

  if (!request.ok) {
    error('internalEngine.ditto', `collage generation failed: ${request.status} ${request.statusText}\n${grey(await request.text())}`)
    throw new CollageError(ctx)
  }
  const data = await request.json()

  return `${process.env.DITTO_URL}/results/${data.file}`
}

export const generateAsymmetricCollage = async (
  ctx: MinimalContext,
  username: string,
  collageData: CollageData
) => {
  const request = await fetch(`${process.env.DITTO_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: buildRequestBody('asymmetric_collage', { ...collageData, username })
  })

  if (!request.ok) {
    error('internalEngine.ditto', `collage generation failed: ${request.status} ${request.statusText}\n${grey(await request.text())}`)
    throw new CollageError(ctx)
  }
  const data = await request.json()

  return `${process.env.DITTO_URL}/results/${data.file}`
}
