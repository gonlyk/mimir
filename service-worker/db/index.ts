import { IDBPDatabase } from 'idb'
import { openDB } from 'idb/with-async-ittr'
import { MimirDB } from './schema'
import { DBVersionHistory } from './version'

async function initDB() {
    return await openDB<MimirDB>('mimir-db1', DBVersionHistory.ADD_ARTICLE, {
        // 首次访问oldVersion为0
        upgrade(db, oldVersion, newVersion) {
            async function doSteps() {
                if (!newVersion) {
                    return
                }
                if (newVersion < oldVersion) {
                    // deleteDB('test-db1')
                    return
                }
                let currVersion: DBVersionHistory = oldVersion + 1
                while (currVersion <= newVersion) {
                    switch (currVersion) {
                        case DBVersionHistory.INIT: {
                            console.log('create segment store')
                            const store = db.createObjectStore('segment', {
                                keyPath: 'id'
                            })
                            // 定义索引
                            store.createIndex('articleId', 'articleId')
                            break
                        }
                        case DBVersionHistory.ADD_ARTICLE: {
                            console.log('create article store')
                            const store = db.createObjectStore('article', {
                                keyPath: 'id'
                            })
                            store.createIndex('updateTime', 'updateTime')
                            break
                        }
                        default: {
                            const error: never = currVersion
                            // 仅消除未使用错误提示
                            error
                        }
                    }
                    currVersion++
                }
            }
            doSteps()
        }
    })
}

let ready = false
let db: IDBPDatabase<MimirDB>
const dbPromise = initDB().then((res) => {
    db = res
    ready = true
})

export default async function getDB() {
    if (ready) {
        return db
    }
    await dbPromise
    return db
}

export async function getTransaction() {
    const db = await getDB()
    return db.transaction(['segment', 'article'], 'readwrite')
}
