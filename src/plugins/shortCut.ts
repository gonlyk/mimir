import { KeyCodeHash } from './keyCodeHash'

class ShortCut {
    // eslint-disable-next-line func-call-spacing
    shortcutStore = new Map<number, () => void>()

    invoke(keyCode: KeyCodeHash) {
        if (this.shortcutStore.has(keyCode.value)) {
            try {
                this.shortcutStore.get(keyCode.value)?.()
            } catch (e) {
                return false
            }
        }
        return true
    }

    register(keyCodes: KeyCodeHash, fn: () => void) {
        if (this.shortcutStore.has(keyCodes.value)) {
            return
        }
        this.shortcutStore.set(keyCodes.value, fn)
    }

    unregister(keyCodes: KeyCodeHash) {
        this.shortcutStore.delete(keyCodes.value)
    }

    unregisterAll() {
        this.shortcutStore.clear()
    }
}

export default new ShortCut()
