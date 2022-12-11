# mimir

基于vue3+pwa项目

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

开发pwa时需要先run watch-build在run dev-pwa，总之就是看一下dist下的service-worker.js有没有内容
使用http-server启动服务器，访问时记得要用localhost（pwa的限制）