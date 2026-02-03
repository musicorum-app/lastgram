// [00:17.12] I feel your breath upon my neck\n...[03:20.31] The clock won't stop and this is what we get\n[03:25.72]
export class SynchronizedLyrics {
    /// the raw lyrics string and the offset in milliseconds to be used in the getNow() function
    constructor(public raw: string, public offset: number) {
    }

    // get something like [00:17.12] and returns 17120
    timestampToMs(timestamp: string): number {
        const [minutes, seconds, hundredths] = timestamp.split(':').map(parseFloat)
        return (minutes * 60 + seconds) * 1000 + hundredths * 10
    }
}
