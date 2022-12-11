
export function Resp<T = undefined>(data?: T) {
    return new Response(JSON.stringify({
        retCode: 0,
        data
    }))
}

export function Error(errCode, errMsg) {
    return new Response(JSON.stringify({
        retCode: errCode,
        errMsg: typeof errMsg === 'string' ? errMsg : (errMsg && errMsg.message) || ''
    }))
}
