import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import plugins from './plugins'
//import Vuetify from 'vuetify/lib'

import initRouter from './router'
import i18n from './i18n'
import VueNotification from "@kugatsu/vuenotification";

Vue.config.productionTip = false
    //Vue.use(require("moment"));
Vue.use(VueNotification, {
    timer: 20,
    warning: {
        background: "#cc974c",
        color: "white"
    },
    error: {
        background: "#b93e2d",
        color: "white"
    },
    success: {
        background: "#697d41",
        color: "white"
    }
});

let router = initRouter(plugins.pluginsRoutes);

new Vue({
    vuetify,
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')