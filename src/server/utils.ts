export const send = (
    res: Response | undefined,
    code: number,
    body: any,
    headers?: Record<string, string | number>
): Response => {
    const headersObj = new Headers()

    if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
            headersObj.set(key, String(value))
        })
    }

    return new Response(body, {
        status: code,
        headers: headersObj,
    })
}

