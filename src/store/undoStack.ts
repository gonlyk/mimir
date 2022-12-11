import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { Segment, useSegmentStore } from './segment'
export enum UndoType {
    ADD,
    REMOVE,
    CHANGE,
    EDIT
}
abstract class UndoItem {
    id: number
    abstract type: string | number
    mergePrev: boolean

    constructor(id: number, mergePrev = false) {
        this.id = id
        this.mergePrev = mergePrev
    }

    abstract undo(): void
    abstract redo(): void
}

class AddSegment extends UndoItem {
    data: {
        parent: Segment,
        prev: Segment | null,
        data: Segment
    }

    type = UndoType.ADD

    constructor(id: number, parent: Segment, prev: Segment | null, data: Segment, mergePrev = false) {
        super(id, mergePrev)
        this.data = {
            parent,
            prev,
            data
        }
    }

    undo(): void {
        const segmentStore = useSegmentStore()
        segmentStore.deleteSegment(this.data.parent, this.data.data, true)
    }

    redo(): void {
        const segmentStore = useSegmentStore()
        segmentStore.insertSegment(this.data.parent, this.data.prev, this.data.data, true)
    }
}

class RemoveSegment extends UndoItem {
    data: {
        parent: Segment,
        prev: Segment,
        data: Segment
    }

    type = UndoType.REMOVE

    constructor(id: number, parent: Segment, prev: Segment, data: Segment, mergePrev = false) {
        super(id, mergePrev)
        this.data = {
            parent,
            prev,
            data
        }
    }

    undo(): void {
        const segmentStore = useSegmentStore()
        segmentStore.insertSegment(this.data.parent, this.data.prev, this.data.data, true)
    }

    redo(): void {
        const segmentStore = useSegmentStore()
        segmentStore.deleteSegment(this.data.parent, this.data.data, true)
    }
}

class EditSegment extends UndoItem {
    data: Segment
    edit: boolean
    type = UndoType.EDIT

    constructor(id: number, data: Segment, edit: boolean, mergePrev = false) {
        super(id, mergePrev)
        this.data = data
        this.edit = edit
    }

    undo(): void {
        this.data.edit = !this.edit
    }

    redo(): void {
        this.data.edit = this.edit
    }
}

class ChangeSegment extends UndoItem {
    prev: string
    data: string
    type = UndoType.CHANGE

    constructor(
        id: number,
        prev: string,
        data: string,
        mergePrev = false
    ) {
        super(id, mergePrev)
        this.prev = prev
        this.data = data
    }

    undo(): void {
        console.log(this.data)
        // const richEditor = useRichEditor()
        // richEditor.editorInstance?.html.set(this.prev)
    }

    redo(): void {
        console.log(this.data)
        // const richEditor = useRichEditor()
        // richEditor.editorInstance?.html.set(this.data)
    }
}

class UndoStack {
    max = 100
    stack: UndoItem[] = []
    head = -1
    pointer = -1

    push(item: UndoItem) {
        if (this.pointer > -1 && this.pointer !== this.head) {
            this.stack = this.stack.slice(0, this.pointer)
        }
        this.stack.push(item)
        this.pointer++
        this.head = this.pointer
    }

    clear() {
        this.stack = []
    }

    undo() {
        if (this.pointer === -1) {
            return
        }

        let curr
        let mergePrev = true
        while (mergePrev) {
            curr = this.stack[this.pointer]
            curr.undo()
            this.pointer--
            mergePrev = curr.mergePrev
        }
    }

    redo() {
        if (this.pointer === this.head) {
            return
        }

        let curr
        let mergePrev = true
        while (mergePrev) {
            this.pointer++
            curr = this.stack[this.pointer]
            curr.redo()
            mergePrev = this.stack[this.pointer + 1]?.mergePrev
        }
    }
}

// 因自定义stack暂未能解决与浏览器和froala undostack的冲突的核心问题，导致其使用意义不大，暂时停止使用
// 保持之前的切换段落后清除froala undostack行为
export const useUndoStack = defineStore('undoStack', () => {
    let id = 1

    const undoStack = reactive(new UndoStack())

    const add = (parent: Segment, prev: Segment | null, data: Segment, mergePrev = false) => {
        undoStack.push(new AddSegment(id++, parent, prev, data, mergePrev))
    }

    const remove = (parent: Segment, prev: Segment, data: Segment, mergePrev = false) => {
        undoStack.push(new RemoveSegment(id++, parent, prev, data, mergePrev))
    }

    const edit = (data: Segment, edit: boolean, mergePrev = false) => {
        undoStack.push(new EditSegment(id++, data, edit, mergePrev))
    }

    const change = (prev: string, data: string, mergePrev = false) => {
        undoStack.push(new ChangeSegment(id++, prev, data, mergePrev))
    }

    return {
        undoStack,
        add,
        remove,
        edit,
        change
    }
})

if (process.env.NODE_ENV === 'development') {
    window.onload = function () {
        // @ts-ignore
        globalThis.undoStack = useUndoStack().undoStack
        // const stackView = document.createElement('div')
        // stackView.style.position = 'absolute'
        // stackView.style.overflow = 'auto'
        // stackView.style.height = '200px'
        // stackView.style.width = '200px'
        // stackView.style.bottom = '0'
        // stackView.style.left = '0'
        // stackView.style.border = '1px solid black'
        // document.body.appendChild(stackView)
        // setTimeout(() => {
        //     createApp(defineComponent({
        //         setup() {
        //             const undoStack = useUndoStack()
        //             const count = ref(0)
        //             const copy = ref<any[]>(JSON.parse(JSON.stringify(undoStack.undoStack.stack)))
        //             watch(undoStack.undoStack.stack, () => (copy.value = JSON.parse(JSON.stringify(undoStack.undoStack.stack))))
        //             // didn't rerender when stack change
        //             return () => h('div', copy.value.map(item => h('div', [item.id])).concat(
        //                 h('button', { onClick: () => { count.value += 1 } }, [count.value])
        //             ))
        //         }
        //     })).use(createPinia()).mount(stackView)
        // }, 500)
    }
}
