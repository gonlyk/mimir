import { RouteHandlerCallbackOptions } from '../../types/workbox'

async function bodyParser(ctx: RouteHandlerCallbackOptions) {
    const { url, request } = ctx
    const payload = await request.json().catch(() => ({}))
    ctx.payload = payload || {}

    if (url.search) {
        const querys: any = {}
        const query = url.search.slice(1).concat('&')
        const reg = /(.*)=(.*)&/g
        const res = query.matchAll(reg)
        while (true) {
            const next = res.next()
            if (next.value) {
                querys[next.value[1]] = next.value[2]
            }
            if (!next.done) {
                break
            }
        }
        ctx.query = querys
    } else {
        ctx.query = {}
    }
}

export default bodyParser
