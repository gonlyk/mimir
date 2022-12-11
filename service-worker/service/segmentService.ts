import { SegmentGetItem } from '../../types/api'
import { SegmentSchema } from '../../types/db'
import ArticleDao from '../dao/articleDao'
import SegmentDao from '../dao/segmentDao'

class SegmentService {
    async getSegmentByArticle(articleId: string) {
        const article = await ArticleDao.getArticle(articleId)
        const segmentList = await SegmentDao.getList(articleId)
        return this.getRes({
            articleId: article?.id || '',
            articleName: article?.name || '',
            segments: segmentList
        })
    }

    /**
     * 远程同步后调用，移除temp_开头id后updateArticle
     */
    async syncArticle() {
        console.log('syncArticle')
    }

    getRes({ articleId, articleName, segments }: {
        articleId: string;
        articleName: string;
        segments: SegmentSchema[];
    }) {
        const res: SegmentGetItem[] = []
        const segmentMap = new Map<string, SegmentGetItem>()
        for (const item of segments) {
            const next: SegmentGetItem = {
                id: item.id,
                content: item.content,
                deleted: !!item.deleted,
                children: []
            }
            if (!item.parent) {
                res.push(next)
            } else {
                const p = segmentMap.get(item.parent)
                p?.children.push(next)
            }
            segmentMap.set(item.id, next)
        }

        return {
            articleId,
            articleName,
            segments: res
        }
    }
}

export default new SegmentService()
