// 获取属性类型
export type PickProperty<T, K extends keyof T> = T[K]
