import { getArticle, saveArticle } from '@/api/swapi/segment'
import { RootPrefix, TempPrefix } from '../../shared'
import { defineStore } from 'pinia'
import { SegmentGetItem } from 'types/api'
import { reactive, ref } from 'vue'
import { filterXSS, whiteList } from 'xss'
import { useArticleStore } from './article'
import { useRichEditor } from './richEditor'

// https://github.com/leizongmin/js-xss/blob/master/README.zh.md#%E7%99%BD%E5%90%8D%E5%8D%95
const xssWhiteList = JSON.parse(JSON.stringify(whiteList))
xssWhiteList.p.push('style')
xssWhiteList.span.push('style')

export type Segment = {
    id: string,
    edit: boolean, // 默认false 要通过changeEdit更改
    content: string,
    modify: boolean,
    deleted: boolean,
    children: Segment[],
    parent?: Segment
}

function newSegment(parent: Segment) {
    return {
        // 本地id，用于绑定key，上传后应赋予数据库id
        id: TempPrefix + new Date().getTime(),
        edit: false,
        content: '',
        modify: false,
        deleted: false,
        children: [],
        parent
    }
}

export const useSegmentStore = defineStore('segment', () => {
    const articleId = ref('')
    const articleName = ref('')
    const segments = reactive<Segment>({
        // 本地id，用于绑定key，上传后应赋予数据库id，最外层的数据没有用，由于vue的限制，不能直接更改reactive注册的对象，所以实际的segments数组在root数据的children下
        // 其他数据仅仅用于保持数据类型（有些函数需要传parent），以后也有可能有其他用
        id: RootPrefix,
        edit: false,
        content: '',
        modify: false,
        deleted: false,
        children: []
    })

    const currEdit = ref<Segment | null>(null)

    const clearSegment = () => { segments.children = [] }

    // edit状态变化
    const changeEdit = (segment: Segment, edit: boolean) => {
        // 记录是否发生两次更改，在一个segment在编辑状态时按另一个编辑会发生，然后需要合并undo
        // let changeTwice = false

        // const { edit: editUndo } = useUndoStack()

        const richEditor = useRichEditor()
        const content = richEditor.editorInstance?.html.get()
        if (currEdit.value && currEdit.value.content !== content) {
            currEdit.value.modify = true
        }
        if (edit) {
            if (currEdit.value) {
                // 内部自带反xss
                currEdit.value.content = content
                currEdit.value.edit = false
                if (segment !== currEdit.value) {
                    // changeTwice = true
                    // editUndo(currEdit.value, false)
                }
            }
            currEdit.value = segment
        } else if (segment === currEdit.value) {
            currEdit.value.content = content
            currEdit.value = null
        }
        segment.edit = edit
        // editUndo(segment, edit, changeTwice)
    }

    // 保存后恢复modify
    const noModify = () => {
        const parse = (list: Segment[]) => {
            for (const segment of list) {
                segment.modify = false
                if (segment.children.length) {
                    parse(segment.children)
                }
            }
        }
        parse(segments.children)
    }

    /**
     * 插入一个新的segment
     * @param parent parent segment
     * @param segment prev segment
     * @param exist 插入已存在的segment，现用于redo
     * @param weak 是否记录更改到undoStack
     */
    const insertSegment = (parent: Segment, segment: Segment | null, exist?: Segment, weak = false) => {
        const nSegment = exist || newSegment(parent)
        if (segment === null) {
            changeEdit(nSegment, true)
            parent.children.unshift(nSegment)
            return
        }

        const index = parent.children.findIndex(item => item === segment)
        if (index > -1) {
            changeEdit(nSegment, true)
            parent.children = parent.children.slice(0, index + 1).concat(nSegment).concat(parent.children.slice(index + 1))
        }
        // if (!weak) {
        //     const { add } = useUndoStack()
        //     add(segment, nSegment)
        // }
    }

    // 当前的下一个edit状态变化
    const editNext = (parent: Segment, segment: Segment) => {
        if (segment.edit) {
            changeEdit(segment, false)
        }

        // 找到他的下一个，优先找子项
        const firstChild = segment.children[0]
        if (firstChild) {
            changeEdit(firstChild, true)
            return
        }

        let p: Segment | undefined = parent
        let s: Segment | undefined = segment
        while (p) {
            const index = p.children.findIndex(item => item === s)
            if (index > -1 && index + 1 < p.children.length) {
                changeEdit(p.children[index + 1], true)
                return
            }
            s = p
            p = p.parent
        }
    }
    // 当前的上一个edit状态变化
    const editPrev = (parent: Segment, segment: Segment) => {
        if (segment.edit) {
            changeEdit(segment, false)
        }

        // 先找同级的上一个，然后找父
        const index = parent.children.findIndex(item => item === segment)
        if (index > 0 && parent.children[index - 1]) {
            changeEdit(parent.children[index - 1], true)
            return
        }

        if (parent && parent.id !== RootPrefix) {
            changeEdit(parent, true)
        }
    }

    // 插入一个child
    const insertChild = (segment: Segment) => {
        const nSegment = newSegment(segment)
        segment.children.unshift(nSegment)
        changeEdit(nSegment, true)
    }

    // 删除
    const deleteSegment = (parent: Segment, segment: Segment, weak = false) => {
        if (parent === segments && segments.children.length <= 1) {
            // 最后一个不给删
            return
        }
        const index = parent.children.findIndex(item => item === segment)
        if (index > -1) {
            changeEdit(segment, false)
            parent.children = parent.children.slice(0, index).concat(parent.children.slice(index + 1))
        }

        // if (!weak) {
        //     const { remove } = useUndoStack()
        //     remove(parent.children[index - 1] || null, segment)
        // }
    }

    // 初始化
    const { newArticleId } = useArticleStore()
    const init = async (article?: string) => {
        articleId.value = article || ''

        const newArticle = () => {
            articleId.value = articleId.value || newArticleId()
            articleName.value = `未命名-${articleId.value}`
            const nSegment = newSegment(segments)
            segments.children = [nSegment]
            changeEdit(nSegment, true)
        }
        if (articleId.value) {
            const { data } = await getArticle(articleId.value)
            if (data.retCode === 0) {
                const deal = (list: SegmentGetItem[], parent: Segment) => {
                    return list.reduce<Segment[]>((res, item) => {
                        const seg: Segment = {
                            id: item.id,
                            edit: false,
                            modify: false,
                            deleted: item.deleted,
                            content: filterXSS(item.content, { whiteList: xssWhiteList }),
                            children: [],
                            parent
                        }
                        seg.children = deal(item.children, seg)
                        res.push(seg)
                        return res
                    }, [])
                }
                segments.children = deal(data.data.segments, segments)
                // 如果没有值会传空，此时应保留query上的值
                articleId.value = data.data.articleId || articleId.value
                articleName.value = data.data.articleName || articleName.value
            }
            if (segments.children.length === 0) {
                newArticle()
            }
        } else {
            // 正常情况不会走这，列表页新建会带id过来，不然页面刷新有问题
            newArticle()
        }
    }

    // 保存文章
    const save = async (local: boolean) => {
        const params: any[] = []
        const parse = (list: Segment[], parentId?: string) => {
            for (let index = 0; index < list.length; index++) {
                const item = list[index]
                const { id, content, children } = item
                params.push({
                    id,
                    index,
                    content,
                    articleId: articleId.value,
                    parent: parentId
                })
                if (children.length) {
                    parse(children, id)
                }
            }
        }

        parse(segments.children)

        if (local) {
            const { data } = await saveArticle({
                articleId: articleId.value,
                articleName: articleName.value,
                segments: params
            })
            if (data.retCode === 0) {
                console.log('save success')
                noModify()
                return true
            }
        }
    }

    return {
        articleId,
        segments,
        currEdit,
        init,
        clearSegment,
        changeEdit,
        insertSegment,
        editPrev,
        editNext,
        insertChild,
        deleteSegment,
        save
    }
})
