/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope
declare global {
    interface Window {
        _mimirPlugin: Record<string, Record<string, (...args: any) => void>>
    }
}

export { }
