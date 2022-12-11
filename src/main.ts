import registerServiceWorker from './registerServiceWorker'
import './style/index.less'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { checkRegister } from './api/swapi/check'

async function initVue() {
    // 使用serve热更新开发时是空的pwa，使用watch-build有pwa但是NODE_ENV是development，开发第一次访问时需要自己刷新一次。还有问题就先build后访问一次
    // 不建议使用npm run serve，pwa请求404会导致页面不正常，除非你mock，或者可以TODO:添加watch-build脚本，不直接使用http-server启动，用browser-sync watch自动刷新页面
    if (process.env.NODE_ENV === 'production') {
        try {
            await checkRegister()
        } catch {
            location.reload()
        }
    }
    createApp(App).use(router).use(createPinia()).mount('#app')
}

registerServiceWorker(initVue)
