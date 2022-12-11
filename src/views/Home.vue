<template>
    <Layout :defaultFold="true">
        <div class="wrapper">
            <div class="operator">
                <button @click="createArticle">add article</button>
            </div>
            <div class="article-list-item" v-for="article in articles.list" :key="article.id"
                @click="articleDetail(article.id)">
                <span>{{ article.name }}</span>
            </div>
        </div>
    </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/layout/BasicLayout.vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/store/article'
import { onMounted } from 'vue'
import useEmitPageLife from '@/hooks/useEmitPageLife'

const router = useRouter()
const articleStore = useArticleStore()

useEmitPageLife()
onMounted(() => {
    console.log('init article')
    articleStore.init()
})

const createArticle = () => {
    router.push({
        path: '/article',
        query: {
            article: articleStore.newArticleId()
        }
    })
}

const articleDetail = (id: string) => {
    router.push({
        path: '/article',
        query: {
            article: id
        }
    })
}
const { articles } = articleStore
</script>

<style lang="less" scoped>
.wrapper {
    width: 1000px;
    margin: auto;

    .operator {
        margin-bottom: 10px;
    }

    .article-list-item {
        padding-left: 60px;
        border-top: 1px solid gray;
        height: 60px;
        line-height: 60px;
        cursor: pointer;

        &:hover {
            background-color: aliceblue;
        }

        &:nth-last-child(1) {
            border-bottom: 1px solid gray;
        }
    }
}
</style>
