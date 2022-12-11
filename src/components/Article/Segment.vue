<template>
    <div ref="segmentWrapper"
        :class="{ 'segment-wrapper': true, 'segment-modify': segment.modify, [`segment-level-${level}`]: !segment.edit, [`segment-level-edit-${level}`]: segment.edit }">
        <div class="segment-content">
            <div v-if="!segment.edit" :class="{ 'segment-text': true }" v-html="segment.content">
            </div>
            <div v-else class="segment-editor" ref="editerWrapper"></div>
        </div>
        <div class="segment-button">
            <button @click="changeEdit(segment, !segment.edit)">edit or save</button>
            <button @click="insertSegment(parent, segment)">insert</button>
            <button v-if="isFirst" @click="insertSegment(parent, null)">insert before</button>
            <button v-if="segment.edit" @click="editNext(parent, segment)">edit next</button>
            <button v-if="level < MAX_INDENT" @click="insertChild(segment)">add sub</button>
            <button @click="deleteSegment(parent, segment)">delete</button>
        </div>
    </div>
    <Self v-for="child of existChildren" :key="child.id" :segment="child" :level="level + 1" :parent="segment" />
</template>

<script setup lang="ts">
import { watchEffect, ref, nextTick, computed } from 'vue'
import { Segment, useSegmentStore } from '../../store/segment'
import { useRichEditor } from '../..//store/richEditor'
import Self from './Segment.vue'
import { MAX_INDENT } from '../../../shared'

const props = defineProps<{
    segment: Segment,
    level: number
    // segment所在的列表
    parent: Segment
}>()
const { changeEdit, insertSegment, editNext, deleteSegment, insertChild } = useSegmentStore()
const richEditor = useRichEditor()

const segmentWrapper = ref()
const editerWrapper = ref()
const existChildren = computed(() => {
    return props.segment.children.filter(child => !child.deleted)
})

const isFirst = computed(() => {
    return props.level === 1 && props.parent.children.indexOf(props.segment) === 0
})

watchEffect(() => {
    if (props.segment.edit) {
        nextTick(() => {
            editerWrapper.value.appendChild(richEditor.editorDom)
            richEditor.editorInstance?.html.set(props.segment.content)
            richEditor.editorInstance?.undo.reset()
            // 自动锁定光标
            const contentDom = richEditor.editorDom?.querySelector('.fr-element.fr-view')
            if (contentDom) {
                const range = document.createRange()
                const endOffset = contentDom.childNodes.length
                range.setStart(contentDom, endOffset)
                range.setEnd(contentDom, endOffset)
                const selection = window.getSelection()
                selection?.removeAllRanges()
                richEditor.currentContent = props.segment.content
                // 这句会触发froala的contentChanged事件，但是触发的时机和结果不是我们想要的
                selection?.addRange(range)
                segmentWrapper.value.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }
        })
    }
})
</script>

<style lang="less" scoped>
.segment-wrapper {
    width: 1000px;
    margin: 10px auto;
    display: flex;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, .4);

    .segment-content {
        flex: 1;

        .segment-text {
            padding: 20px;
            word-break: break-all;
        }
    }

    .segment-button {
        width: 100px;
        min-width: 100px;
        border-left: 1px dashed gray;

        button {
            width: 100%;
        }
    }

    &.segment-modify {
        box-shadow: 0 0 5px 0 rgba(150, 0, 0, .4) !important;
    }

    .segment-editor {
        min-height: 60px;
        width: 100%;
    }

    @level: 1, 2, 3, 4, 5;
    @unit: 2em;

    each(@level, {
        &.segment-level-@{value} {
            @child: @value + 1;
            @unit_width: 2px;
            border-left: (@value - 1) * @unit_width solid green;
            padding-left: (@value - 1) * @unit;
        }
        &.segment-level-edit-@{value} {
            @unit_width: 2px;
            border-left: (@value - 1) * @unit_width solid green;
        }
    });
}
</style>
