import { DBSchema } from 'idb'
import { ArticleSchema, SegmentSchema } from '../../types/db'

// 此定义仅仅生成类型，无具体实现逻辑
export interface MimirDB extends DBSchema {
    segment: {
        key: string,
        value: SegmentSchema,
        indexes: { id: string, articleId: string }
    },
    article: {
        key: string,
        value: ArticleSchema
        indexes: { updateTime: number }
    }
}
