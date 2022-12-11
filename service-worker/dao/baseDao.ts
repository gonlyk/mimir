import getDB from '../db'

class BaseDao {
    constructor() {
        getDB()
    }
}

export default BaseDao
