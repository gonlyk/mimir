import { RouteName } from '@/router/routeName'
import type { Segment } from '@/store/segment'
import { PluginOption } from 'types/plugin'
import PluginBase from '../base'
import { KeyCode, KeyCodeHash } from '../keyCodeHash'
import ShortCut from '../shortCut'

export function registerArticlePageShortcut(option: PluginOption) {
    ShortCut.register(new KeyCodeHash([KeyCode.ShiftLeft, KeyCode.ArrowDown]), () => {
        const { currEdit, editNext } = option.segment
        if (!currEdit.value) {
            return
        }
        editNext(currEdit.value.parent as Segment, currEdit.value)
    })

    ShortCut.register(new KeyCodeHash([KeyCode.ShiftLeft, KeyCode.ArrowUp]), () => {
        const { currEdit, editPrev } = option.segment
        if (!currEdit.value) {
            return
        }
        editPrev(currEdit.value.parent as Segment, currEdit.value)
    })

    ShortCut.register(new KeyCodeHash([KeyCode.ShiftLeft, KeyCode.Enter]), () => {
        const { currEdit, insertSegment } = option.segment
        if (!currEdit.value) {
            return
        }
        insertSegment(currEdit.value.parent as Segment, currEdit.value)
    })

    ShortCut.register(new KeyCodeHash([KeyCode.ControlLeft, KeyCode.Enter]), () => {
        const { currEdit, insertChild } = option.segment
        if (!currEdit.value) {
            return
        }
        insertChild(currEdit.value)
    })

    const shortHandler = (e: KeyboardEvent) => {
        // 避免运行两次
        if (e.target === editor) {
            e.stopImmediatePropagation()
        }

        const keyCode = []
        if (e.ctrlKey) {
            keyCode.push(KeyCode.ControlLeft)
        }
        if (e.altKey) {
            keyCode.push(KeyCode.AltLeft)
        }
        if (e.shiftKey) {
            keyCode.push(KeyCode.ShiftLeft)
        }
        // https://stackoverflow.com/questions/36316326/typescript-ts7015-error-when-accessing-an-enum-using-a-string-type-parameter
        keyCode.push(KeyCode[e.code as keyof typeof KeyCode])

        const hash = new KeyCodeHash(keyCode)
        ShortCut.invoke(hash)
    }

    let editor: HTMLDivElement | null
    document.addEventListener('keydown', shortHandler)
    const { ready } = option.segment.editor
    ready.then(() => {
        editor = document.querySelector('.fr-view')
        editor?.addEventListener('keydown', shortHandler)
    })
    window.addEventListener('beforeunload', () => {
        document.removeEventListener('keydown', shortHandler)
        editor?.removeEventListener('keydown', shortHandler)
    })
}

export function unregisterAllShortcut() {
    ShortCut.unregister(new KeyCodeHash([KeyCode.ShiftLeft, KeyCode.ArrowDown]))
    ShortCut.unregister(new KeyCodeHash([KeyCode.ShiftLeft, KeyCode.ArrowUp]))
    ShortCut.unregister(new KeyCodeHash([KeyCode.ShiftLeft, KeyCode.Enter]))
    ShortCut.unregister(new KeyCodeHash([KeyCode.ControlLeft, KeyCode.Enter]))
}

// @ts-ignore
window._mimirPlugin && (window._mimirPlugin.shortcut = new class extends PluginBase {
    // 在app加载完成前调用，此时option里的一些值可能还不用
    setup(option: PluginOption): void {
        const { name, names } = option.route
        const { watch } = option.vue

        // 注册watch时路由名字还是undefined
        watch(() => name.value, (value) => {
            this.register(option, value as string, names)
        })
    }

    register(option: PluginOption, pathname: string, routes: typeof RouteName) {
        if (pathname === routes.Article) {
            console.log('register shortcut')
            registerArticlePageShortcut(option)
        } else {
            console.log('unregister shortcut')
            unregisterAllShortcut()
        }
    }
}())
