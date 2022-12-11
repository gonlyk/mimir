<template>
    <div class="mimir-header">
        <div class="mimir-title">
            <div>
                <img src="../../assets/logo.png" alt="mimir" />
            </div>
            <div class="mimir-title-text">Mimir</div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
.mimir-header {
    display: flex;
    position: fixed;
    background-color: white;
    top: 0;
    height: 70px;
    width: 100%;
    line-height: 50px;
    box-shadow: 1px 2px 8px 3px rgba(0, 0, 0, 0.1);

    padding: 10px;
    img {
        width: 50px;
        display: inline-block;
    }
    .mimir-title {
        display: flex;
        .mimir-title-text {
            font-size: 30px;
            height: 70px;
        }
    }
}
</style>
