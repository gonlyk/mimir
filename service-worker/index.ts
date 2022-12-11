import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { RouteHandlerCallbackOptions } from '../types/workbox'
import bodyParser from './core/bodyParser'
import { Error } from './core/response'
import Router from './core/router'
import getDB from './db'
import router from './router'
import { PREFIX } from '../shared'
import { ErrorCode } from '../shared/errorCode'

getDB()

function matchCb({ url }) {
    return url.pathname.startsWith(PREFIX)
}

async function handlerCb(ctx: RouteHandlerCallbackOptions) {
    await bodyParser(ctx)
    try {
        return Router.use(router, ctx)
    } catch (e) {
        return Error(ErrorCode.SERVICE_ERROR, e)
    }
}

// html的缓存策略
registerRoute(
    ({ request }) => request.destination === 'document',
    new NetworkFirst()
)
// css\js 缓存策略，开发时页面会使用vue-cli-service build --watch,watch标识会禁用静态文件命名hash导致每次都读sw缓存
// 环境变量区分，开发环境NetworkFirst，生产CacheFirst
registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    process.env.DEV_PWA ? new NetworkFirst() : new CacheFirst({
        cacheName: 'mimir-static',
        plugins: [
            new ExpirationPlugin({
                maxAgeSeconds: 7 * 24 * 60 * 60
            })
        ]
    })
)

registerRoute(matchCb, handlerCb as any)
registerRoute(matchCb, handlerCb as any, 'POST')

self.addEventListener('install', event => {
    // https://github.com/microsoft/TypeScript/issues/14877
    // @ts-ignore
    self.skipWaiting()
    console.log('install new content')
})

console.log(`listen on ${PREFIX}`)
