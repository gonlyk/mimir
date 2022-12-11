/*
 * @Author: gonlyk
 * @Description: article store
 * @Date: 2022/12/01
 * @Last Modified time: 2022/12/01
 */

import { getArticles } from '@/api/swapi/article'
import { TempPrefix } from '../../shared'
import { defineStore } from 'pinia'
import { ArticleSchema } from 'types/db'
import { reactive, ref } from 'vue'

export const useArticleStore = defineStore('article', () => {
    const pageNo = ref(1)
    const articles = reactive<{ list: ArticleSchema[] }>({ list: [] })

    const newArticleId = () => {
        return TempPrefix + '_art' + new Date().getTime()
    }

    const init = async () => {
        const { data } = await getArticles(pageNo.value)
        if (data.retCode === 0) {
            articles.list = data.data
        }
    }

    return {
        pageNo,
        articles,
        newArticleId,
        init
    }
})
