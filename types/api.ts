/*
 * @Author: gonlyk
 * @Description: 此文件的type为接口type，前后端都使用
 * @Date: 2022/11/21
 * @Last Modified time: 2022/11/21
 */
import { ArticleSchema } from './db'
export type Resp<T> = {
    retCode: number,
    data: T
}

/** ********* service worker api ****************/
export type SegmentGetItem = {
    id: string,
    content: string,
    deleted: boolean,
    children: SegmentGetItem[]
}

// 用Res结尾表示是请求返回类型, Req结尾表示是请求参数
export type SegmentGetRes = {
    articleId: string,
    articleName: string,
    segments: SegmentGetItem[]
}

export type ArticleSaveReq = {
    articleId: string,
    articleName: string,
    segments: {
        id: string,
        index: number,
        content: string,
        articleId: string,
        parent?: string
    }[]
}

export type ArticleRes = ArticleSchema | undefined
export type ArticleListRes = ArticleSchema[]
/** ********* service worker api ****************/
