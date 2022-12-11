export enum LifeCycleEnum {
    APP_LOADED = 0,
    PAGE_LOADED,
    PAGE_UNLOADED
}

class LifeCycle {
    // eslint-disable-next-line func-call-spacing
    private event = new Map<LifeCycleEnum, (() => void)[]>()
    constructor() {
        this.event.set(LifeCycleEnum.APP_LOADED, [])
        this.event.set(LifeCycleEnum.PAGE_LOADED, [])
        this.event.set(LifeCycleEnum.PAGE_UNLOADED, [])
    }

    emit(life: LifeCycleEnum) {
        const cbs = this.event.get(life)
        if (!cbs) {
            return
        }

        for (const cb of cbs) {
            cb()
        }
    }

    on(life: LifeCycleEnum, cb: () => void) {
        let cbs = this.event.get(life)
        if (!cbs) {
            cbs = []
        }

        if (cbs.indexOf(cb) === -1) {
            return false
        }

        cbs.push(cb)
        this.event.set(life, cbs)
        return true
    }

    off(life: LifeCycleEnum, cb: () => void) {
        let cbs = this.event.get(life)
        if (!cbs) {
            cbs = []
        }

        const index = cbs.indexOf(cb)
        if (index > -1) {
            cbs = cbs.slice(0, index).concat(cbs.slice(index + 1))
            return true
        }

        return false
    }
}

export default new LifeCycle()
