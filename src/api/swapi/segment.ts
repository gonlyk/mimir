import { swHttp } from './index'
import { ArticleSaveReq, Resp, SegmentGetRes } from '../../../types/api'

export function getArticle(articleId?: string) {
    return swHttp.request<Resp<SegmentGetRes>>({
        method: 'get',
        url: '/segment/get_by_article',
        params: { articleId }
    })
}

export function saveArticle({ articleId, articleName, segments }: ArticleSaveReq) {
    return swHttp.request<Resp<null>>({
        method: 'post',
        url: '/segment/save',
        data: {
            articleId,
            articleName,
            segments
        }
    })
}
