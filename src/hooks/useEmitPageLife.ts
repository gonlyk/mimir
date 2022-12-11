import Lifecycle, { LifeCycleEnum } from '@/plugins/lifecycle'
import { nextTick, onMounted, onUnmounted } from 'vue'

export default function useEmitPageLife() {
    onMounted(() => {
        nextTick(() => {
            Lifecycle.emit(LifeCycleEnum.PAGE_LOADED)
        })
    })

    onUnmounted(() => {
        nextTick(() => {
            Lifecycle.emit(LifeCycleEnum.PAGE_UNLOADED)
        })
    })
}
