import type { useSegmentStore, Segment } from '../src/store/segment'
import type { PickProperty } from './common'
import type FroalaEditor from 'froala-editor'
import type { ComputedRef, nextTick, watch } from 'vue'
import { RouteName } from '@/router/routeName'
import { RouteRecordName } from 'vue-router'
type SegmentStore = ReturnType<typeof useSegmentStore>

export type PluginOption = {
    segment: {
        currEdit: ComputedRef<Segment | null>,
        clearSegment: PickProperty<SegmentStore, 'clearSegment'>,
        insertSegment: PickProperty<SegmentStore, 'insertSegment'>
        editNext: PickProperty<SegmentStore, 'editNext'>
        editPrev: PickProperty<SegmentStore, 'editPrev'>
        insertChild: PickProperty<SegmentStore, 'insertChild'>
        deleteSegment: PickProperty<SegmentStore, 'deleteSegment'>
        save: PickProperty<SegmentStore, 'save'>
        editor: {
            editorInstance: FroalaEditor | null,
            ready: Promise<unknown>
        }
    },
    route: {
        path: ComputedRef<string>,
        name: ComputedRef<RouteRecordName | null | undefined>,
        names: typeof RouteName
    },
    vue: {
        watch: typeof watch,
        nextTick: typeof nextTick
    }
}
