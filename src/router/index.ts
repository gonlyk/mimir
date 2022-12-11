import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { RouteName } from './routeName'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: RouteName.Home,
        component: () => import('../views/Home.vue')
    },
    {
        path: '/article',
        name: RouteName.Article,
        component: () => import('../views/Article.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router
