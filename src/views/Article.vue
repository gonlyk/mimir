<template>
    <Layout :defaultFold="true">
        <div class="operator">
            <button @click="saveArticle">save</button>
            <button @click="home">back</button>
            <button disabled>submit</button>
        </div>
        <Segment v-for="segment in existChildren" :segment="segment" :key="segment.id" :level="lvl"
            :parent="segmentStore.segments">
        </Segment>
    </Layout>
</template>

<script setup lang="ts">
// import 'froala-editor/css/plugins/image.min.css'
// import 'froala-editor/js/plugins/image.min.js'
import 'froala-editor/css/plugins/colors.min.css'
import 'froala-editor/js/plugins/colors.min.js'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/js/froala_editor.pkgd.min.js'
import Layout from '../components/layout/BasicLayout.vue'
import Segment from '../components/Article/Segment.vue'
import { getArticle } from '../api/swapi/article'
import { useSegmentStore } from '../store/segment'
import { useRichEditor } from '../store/richEditor'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import useEmitPageLife from '@/hooks/useEmitPageLife'
const segmentStore = useSegmentStore()
const route = useRoute()

// 层级
const lvl = ref(1)
const router = useRouter()
useEmitPageLife()

const existChildren = computed(() => {
    return segmentStore.segments.children.filter(child => !child.deleted)
})

onMounted(async () => {
    console.log('init editor')
    const richEditor = useRichEditor()
    segmentStore.init(route.query.article as string)
    richEditor.init()

    window.addEventListener('beforeunload', saveBeforeLeave)
})

onUnmounted(() => {
    window.removeEventListener('beforeunload', saveBeforeLeave)
})

const saveBeforeLeave = async () => {
    // TODO: 先检查一下本地有没有这篇文章，不然乱写东西也会存，没有就先出个提示
    try {
        const { data } = await getArticle(segmentStore.articleId)
        if (data.retCode === 0 && data.data?.id) {
            await saveArticle()
            segmentStore.clearSegment()
        }
    } catch (e) {
        alert('保存发生错误')
    }
}

onBeforeRouteLeave(async (to, from, next) => {
    await saveBeforeLeave()
    next()
})

const saveArticle = async () => {
    if (segmentStore.currEdit) {
        segmentStore.changeEdit(segmentStore.currEdit, false)
    }
    await segmentStore.save(true)
}
const home = () => {
    router.push('/')
}
</script>
<style lang="less" scoped>
.operator {
    width: 1000px;
    margin: auto;

    button {
        margin-right: 10px;
    }
}
</style>
