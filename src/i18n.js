import Vue from 'vue'
import VueI18n from 'vue-i18n'
import plugins from './plugins'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })

  if (plugins.customLocales) {
    console.log(`loadLocaleMessages. customLocales: ${Object.keys(plugins.customLocales).length}`);
    for (const locale in plugins.customLocales) {     
        console.log(`loadLocaleMessages. custom locale: ${locale}`)
        if (messages[locale]) {
            console.log(`loadLocaleMessages. custom locale: ${locale} already exists. merge (${Object.keys(plugins.customLocales[locale]).length} keys) with existing`)
            messages[locale] = Object.assign(messages[locale], plugins.customLocales[locale]);
        } else {
          messages[locale] = plugins.customLocales[locale]      
        }
    }
  }
  
  return messages
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})
