const path = require('path')
module.exports = api => {
    api.registerCommand(
        'build-pwa',
        {
            description: 'Writes a greeting to the console',
            usage: 'vue-cli-service greet [options]',
            options: { '--name': 'specifies a name for greeting' }
        },
        args => {
            api.configureWebpack(config => {
                config.entry = './service-worker/index.ts'
                config.mode = 'production'
                // 生成文件再丢到vue构建中
                config.output.filename = 'service-worker.js'
                config.plugins = []
                delete config.optimization.splitChunks
                // config.output.path = path.resolve(__dirname, 'sw-dist')
            })
            
            api.service.mode = api.service.mode || 'service-worker'
            api.service.commands.build.fn({...args, dest: path.resolve(__dirname, '../sw-dist')})
        }
    )
}