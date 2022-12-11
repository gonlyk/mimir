import { defineStore } from 'pinia'
import FroalaEditor from 'froala-editor'
import { ref } from 'vue'

export const useRichEditor = defineStore('richEditor', () => {
    const editorInstance = ref<FroalaEditor | null>(null)
    const editorDom = document.querySelector('#editor') as HTMLDivElement
    const ignoreChanged = ref(false)
    const currentContent = ref('')

    const _inited = ref(false)
    let _resolve: (value: unknown) => void
    const ready = new Promise(resolve => { _resolve = resolve })
    const init = () => {
        if (_inited.value) {
            _resolve(null)
            return
        }
        editorInstance.value = new FroalaEditor('#editor', {
            events: {
                // 'commands.undo': function () {
                //     const { undoStack } = useUndoStack()
                //     console.log('commands.undo')
                //     undoStack.undo()
                //     ignoreChanged.value = true
                // },
                // 'commands.redo': function () {
                //     const { undoStack } = useUndoStack()
                //     console.log('commands.redo')
                //     undoStack.redo()
                //     ignoreChanged.value = true
                // },
                // keydown: (keydownEvent: any) => {
                //     console.log('keydown')
                // },
                // contentChanged: function () {
                //     const html = editorInstance.value?.html.get()
                //     // console.log(html)
                //     setTimeout(() => {
                //         // 内容undo时也会触发contentChanged，使用setTimeout调整调用顺序，通过ignoreChanged
                //         if (html === currentContent.value || ignoreChanged.value) {
                //             return
                //         }
                //         console.log('contentChanged')
                //         const { change } = useUndoStack()
                //         change(currentContent.value, html)
                //         currentContent.value = html
                //     })
                // }
            },
            imageEditButtons: ['imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove']
        }, () => {
            _inited.value = true
            _resolve(null)
        })
    }

    return { editorInstance, init, ready, editorDom, ignoreChanged, currentContent }
})
