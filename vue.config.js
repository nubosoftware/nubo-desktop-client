module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Nubo - Desktop Client'
                return args
            })
    },

    "transpileDependencies": [
        "vuetify"
    ],

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true
        },
        /*
                moment: {
                    locales: [
                        'en'
                    ]
                }*/
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/html/desktop/' : '/'

}