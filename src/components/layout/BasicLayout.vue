<template>
    <Head></Head>
    <div class="mimir-basic-layout">
        <div class="nav" :style="{ width: fold ? 0 : '250px' }">
            <Nav :fold="fold"></Nav>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import Head from './Head.vue'
import Nav from './Nav.vue'

const props = defineProps<{
    defaultFold?: boolean
}>()

const fold = ref(props.defaultFold || false)
</script>

<style lang="less" scoped>
.mimir-basic-layout {
    height: calc(100vh - 70px);
    margin-top: 70px;
    display: flex;
    .content {
        flex: 1;
        padding-top: 10px;
    }
}
</style>
