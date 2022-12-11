module.exports = {
    lintOnSave: false,
    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: './sw-dist/service-worker.js'
        }
    }
}
