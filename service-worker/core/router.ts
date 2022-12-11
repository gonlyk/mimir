/*
 * @Author: gonlyk
 * @Description: router
 * @Date: 2022/11/18
 * @Last Modified time: 2022/11/18
 */
import { RouteHandlerCallbackOptions } from '../../types/workbox'
class Router {
    _perfix: string
    getHandler = new Map()
    postHandler = new Map()

    constructor(option?: { prefix?: string }) {
        this._perfix = option?.prefix || ''
        if (!this._perfix.startsWith('/')) {
            this._perfix = '/' + this._perfix
        }
    }

    get(url: string, handler: (ctx: RouteHandlerCallbackOptions) => Promise<Response>) {
        if (this.getHandler.has(url)) {
            throw new Error('重复注册')
        }
        this.getHandler.set(url, handler)
    }

    post(url: string, handler: (ctx: RouteHandlerCallbackOptions) => Promise<Response>) {
        if (this.postHandler.has(url)) {
            throw new Error('重复注册')
        }
        this.postHandler.set(url, handler)
    }

    static async use(router: Router, ctx: RouteHandlerCallbackOptions) {
        let pathname = ctx.url.pathname
        pathname = pathname.replace(router._perfix, '').replace('//', '/')
        if (!pathname.startsWith('/')) {
            pathname = '/' + pathname
        }

        if (router.getHandler.has(pathname)) {
            return await router.getHandler.get(pathname)(ctx)
        } else if (router.postHandler.has(pathname)) {
            return await router.postHandler.get(pathname)(ctx)
        }
    }
}

export default Router
