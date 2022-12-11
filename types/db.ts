import { IDBPTransaction } from 'idb'
import { MimirDB } from '../service-worker/db/schema'

export type Transaction = IDBPTransaction<MimirDB, ('segment' | 'article')[], 'readwrite'>

export type SegmentSchema = {
    // 服务端id
    id: string,
    index: number,
    content: string,
    articleId: string,
    parent?: string,
    deleted?: boolean
}

export type ArticleSchema = {
    id: string,
    name: string,
    updateTime: number
}
