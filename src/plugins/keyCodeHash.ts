// key值应与keyboardevent.code相同
export enum KeyCode {
    KeyA = 0, KeyB, KeyC, KeyD, KeyE, KeyF, KeyG, KeyH, KeyI, KeyJ, KeyK, KeyL, KeyM, KeyN, KeyO, KeyP, KeyQ, KeyR, KeyS, KeyT, KeyU, KeyV, KeyW, KeyX, KeyY, KeyZ, Digit0, Digit1, Digit2, Digit3, Digit4, Digit5, Digit6, Digit7, Digit8, Digit9, Minus, Equal, Backspace,
    Tab, ShiftLeft, ControlLeft, AltLeft, Enter,
    Numpad0, Numpad1, Numpad2, Numpad3, Numpad4, Numpad5, Numpad6, Numpad7, Numpad8, Numpad9,
    ArrowUp, ArrowLeft, ArrowRight, ArrowDown
    // ...
}

export class KeyCodeHash {
    readonly value: number
    constructor(keyCode: KeyCode | KeyCode[]) {
        if (Array.isArray(keyCode)) {
            this.value = keyCode.reduce((val, key) => {
                val += Math.pow(2, key)
                return val
            }, 0)
        } else {
            this.value = keyCode
        }
    }
}
