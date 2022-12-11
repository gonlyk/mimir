import { swHttp } from './index'
import { Resp } from '../../../types/api'

export function checkRegister() {
    return swHttp.request<Resp<null>>({
        method: 'get',
        url: '/check'
    })
}
