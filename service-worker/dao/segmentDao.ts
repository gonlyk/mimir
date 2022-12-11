import { TempPrefix } from '../../shared'
import { Transaction } from '../../types/db'
import getDB, { getTransaction } from '../db'
import BaseDao from './baseDao'

class SegmentDao extends BaseDao {
    async getList(articleId: string) {
        const db = await getDB()

        // 使用索引搜索时会按索引所在列排序
        return db.getAllFromIndex('segment', 'articleId', IDBKeyRange.only(articleId))
    }

    /**
     * 删除segment，本地segment直接删除，云端打delete标识
     * @param articleId 文章id
     * @param segmentIdSet 要处理的segment的set
     * @param tx 事务
     */
    async deleteSegment(articleId: string, segmentIdSet: Set<string>, tx?: Transaction) {
        const transaction = tx || await getTransaction()
        const store = transaction.objectStore('segment')
        const segments = await store.index('articleId').getAll(IDBKeyRange.only(articleId))
        try {
            for (const segment of segments) {
                if (!segmentIdSet.has(segment.id)) {
                    if (segment.id.startsWith(TempPrefix)) {
                        store.delete(segment.id)
                    } else {
                        // 一条数据被保存过，他的parent也会被保存过
                        const { id, index, content, articleId, parent } = segment
                        store.put({ id, index, content, articleId, parent, deleted: true })
                    }
                }
            }
        } catch (e) {
            !tx && transaction.abort()
            throw e
        }
    }

    /**
     * 保存文章，有id更新，无id插入
     */
    async updateSegment(
        segments: {
            id: string;
            index: number;
            content: string;
            articleId: string;
            parent?: string;
        }[],
        tx?: Transaction
    ) {
        const transaction = tx || await getTransaction()
        try {
            for (const segment of segments) {
                const { id, index, content, articleId, parent } = segment
                transaction.objectStore('segment').put({ id, index, content, articleId, parent })
            }
        } catch (e) {
            !tx && transaction.abort()
            throw e
        }
    }
}

export default new SegmentDao()
