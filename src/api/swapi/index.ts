import Axios from 'axios'

export const swHttp = Axios.create({
    baseURL: '/sw/api'
})
