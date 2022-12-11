import { ArticleSchema, Transaction } from '../../types/db'
import getDB, { getTransaction } from '../db'
import BaseDao from './baseDao'

class ArticleDao extends BaseDao {
    async getArticles(pageNo: number, pageSize) {
        let skip = (pageNo - 1) * pageSize
        let remain = pageSize
        const transaction = await getTransaction()
        const store = transaction.objectStore('article')
        const index = store.index('updateTime')

        const res: ArticleSchema[] = []
        for await (const cursor of index.iterate(null, 'prev')) {
            if (--skip >= 0) {
                continue
            }

            if (remain--) {
                res.push(cursor.value)
            }
        }

        return res
    }

    async getArticle(articleId: string) {
        const db = await getDB()
        return await db.get('article', IDBKeyRange.only(articleId))
    }

    async saveArticle(articleId: string, articleName: string, tx?: Transaction) {
        const transaction = tx || await getTransaction()
        const store = transaction.objectStore('article')
        const key = await store.put({ id: articleId, name: articleName, updateTime: parseInt(`${new Date().getTime() / 1000}`) })

        return key
    }
}

export default new ArticleDao()
