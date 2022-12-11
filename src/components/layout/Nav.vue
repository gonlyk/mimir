<template>
    <div class="mimir-nav" :style="{left: fold ? '-250px' : 0}">
    </div>
</template>

<script setup lang="ts">

defineProps<{
    fold: boolean
}>()
</script>

<style lang="less" scoped>
.mimir-nav {
    position: fixed;
    width: 250px;
    height: calc(100vh - 70px);
    border-right: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
