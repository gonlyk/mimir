const path = require('path')
const watch = require('node-watch');
const fs = require('fs')
const { DefinePlugin } = require('webpack')

module.exports = api => {
    api.registerCommand(
        'dev-pwa',
        {
            description: 'Writes a greeting to the console',
            usage: 'vue-cli-service greet [options]',
            options: { '--name': 'specifies a name for greeting' }
        },
        args => {
            api.configureWebpack(config => {
                config.entry = './service-worker/index.ts'
                // 生成文件再丢到vue构建中
                config.output.filename = 'service-worker.js'
                config.plugins = [
                    new DefinePlugin({
                        'process.env': JSON.stringify({
                            DEV_PWA: true
                        })
                    })
                ]
                delete config.optimization.splitChunks
            })

            api.service.mode = api.service.mode || 'dev-worker'
            watch('./service-worker', { recursive: true }, async function (evt, name) {
                const promise = await api.service.commands.build.fn({ ...args, dest: path.resolve(__dirname, '../sw-dist') })

                fs.copyFileSync(
                    path.resolve(__dirname, '../sw-dist/service-worker.js'),
                    path.resolve(__dirname, '../dist/service-worker.js')
                )
                console.log('build complete')
            });
            api.service.commands.build.fn({ ...args, dest: path.resolve(__dirname, '../sw-dist') })
                .then(() => {
                    fs.copyFileSync(
                        path.resolve(__dirname, '../sw-dist/service-worker.js'),
                        path.resolve(__dirname, '../dist/service-worker.js')
                    )
                    console.log('build complete')
                })
        }
    )
}