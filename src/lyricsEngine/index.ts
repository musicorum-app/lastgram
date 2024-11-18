interface LyricsResponse {
  lyrics: string
  provider: 'vagalume' | 'lyrics.ovh'
}

const findLyrics = (music: string, artist: string) => {
  return fetch()
}

const vagalumeRequest = async (music: string, artist: string) => {
  const response = await fetch(
    `https://api.vagalume.com.br/search.php?art=${encodeURIComponent(artist)}&mus=${encodeURIComponent(music)}&apikey={process.env.VAGALUME_API_KEY}`
  ).then((res: Response) => res.json())

  console.log(response)
}

const lyricsOVHRequest = async (music: string, artist: string) => {
  const response = await fetch(
    `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(music)}`
  ).then((res: Response) => res.json())

  console.log(response)
}