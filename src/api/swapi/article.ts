import { ArticleListRes, ArticleRes, Resp } from 'types/api'
import { swHttp } from './index'

export function getArticle(articleId: string) {
    return swHttp.request<Resp<ArticleRes>>({
        url: '/article/get',
        method: 'get',
        params: {
            articleId
        }
    })
}

export function getArticles(pageNo: number) {
    return swHttp.request<Resp<ArticleListRes>>({
        url: '/articles/get',
        method: 'get',
        params: {
            pageNo
        }
    })
}
