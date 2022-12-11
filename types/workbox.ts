import { RouteHandlerCallbackOptions as RHCO } from 'workbox-routing/node_modules/workbox-core/types'

export interface RouteHandlerCallbackOptions extends RHCO {
    query: Record<string, string>,
    payload: any,
    store: Record<string, any>,
}
