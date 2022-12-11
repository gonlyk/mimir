<template>
    <router-view />
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount, computed, watch, nextTick } from 'vue'
import { useRichEditor } from './store/richEditor'
import { useSegmentStore } from './store/segment'
import type { PluginOption } from '../types/plugin'
import PluginBase from './plugins/base'
import LifeCycle, { LifeCycleEnum } from './plugins/lifecycle'
import { RouteName } from './router/routeName'
import { useRoute } from 'vue-router'
import './plugins/shortcut/index'

const segmentStore = useSegmentStore()
const richEditor = useRichEditor()
const route = useRoute()
onBeforeMount(() => {
    // 插件注册
    // 取出可以暴露的变量和方法，从store取出变量需要更改为compute变量
    const pluginData: PluginOption = {
        segment: {
            currEdit: computed(() => segmentStore.currEdit),
            clearSegment: segmentStore.clearSegment,
            insertSegment: segmentStore.insertSegment,
            editNext: segmentStore.editNext,
            editPrev: segmentStore.editPrev,
            insertChild: segmentStore.insertChild,
            deleteSegment: segmentStore.deleteSegment,
            save: segmentStore.save,
            editor: {
                editorInstance: richEditor.editorInstance,
                ready: richEditor.ready
            }
        },
        route: {
            path: computed(() => route.path),
            name: computed(() => route.name),
            names: RouteName
        },
        vue: {
            watch: watch,
            nextTick: nextTick
        }
    }

    if (typeof window._mimirPlugin === 'object') {
        for (const key in window._mimirPlugin) {
            const plugin = window._mimirPlugin[key]
            if (plugin instanceof PluginBase) {
                plugin.setup(pluginData)
            }
        }
    }
})

onMounted(() => {
    // emit hook
    nextTick(() => {
        LifeCycle.emit(LifeCycleEnum.APP_LOADED)
    })
})
</script>

<style lang="less">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
