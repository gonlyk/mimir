import { ArticleSaveReq } from '../../types/api'
import ArticleDao from '../dao/articleDao'
import SegmentDao from '../dao/segmentDao'
import { getTransaction } from '../db'

class ArticleService {
    async getArticle(articleId: string) {
        return await ArticleDao.getArticle(articleId)
    }

    async getArticles(pageNo: number, pageSize: number) {
        return await ArticleDao.getArticles(pageNo, pageSize)
    }

    /**
     * 先删除多的数据，在插入
     * @param article {{ articleId, articleName, segments }}
     */
    async saveArticle(article: ArticleSaveReq) {
        const tx = await getTransaction()
        try {
            const { articleId, articleName, segments } = article
            await ArticleDao.saveArticle(articleId, articleName, tx)
            const segmentsSet = new Set(segments.map(seg => seg.id))
            await SegmentDao.deleteSegment(articleId, segmentsSet, tx)
            await SegmentDao.updateSegment(article.segments, tx)
        } catch (e) {
            tx.abort()
            throw e
        }
    }
}

export default new ArticleService()
