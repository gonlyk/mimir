import { SegmentGetRes } from '../types/api'
import { Resp } from './core/response'
import Router from './core/router'
import articleService from './service/articleService'
import segmentService from './service/segmentService'
import { PREFIX } from '../shared'

const router = new Router({
    prefix: PREFIX
})

// 首次访问pwa页面时页面未注册，访问会404，检查一下，404就reload下页面
router.get('/check', async () => {
    return Resp(null)
})

router.get('/article/get', async ({ query }) => {
    const { articleId } = query
    const res = await articleService.getArticle(articleId)
    return Resp(res)
})

router.get('/articles/get', async ({ query }) => {
    const { pageNo, pageSize } = query
    const res = await articleService.getArticles(Number(pageNo || 1), Number(pageSize || 1000))
    return Resp(res)
})

router.post('/segment/save', async ({ payload }) => {
    await articleService.saveArticle(payload)
    return Resp()
})

router.get('/segment/get_by_article', async ({ query }) => {
    const segments = await segmentService.getSegmentByArticle(query.articleId)
    return Resp<SegmentGetRes>(segments)
})

export default router
