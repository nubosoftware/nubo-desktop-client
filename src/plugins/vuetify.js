import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    customVariables: ['~/assets/variables.scss'],
    theme: {
        options: {
            customProperties: true
        },
        themes: {
            light: {
                primary: '#3c4446',
                secondary: '#5f8982',
                accent: '#cc974c',
                error: '#b93e2d',
                info: '#5f8982',
                success: '#697d41',
                warning: '#cc974c',
                "high": "#f2ecdf",
                bru: "f8f5ed",
                bg: "f8f5ed",
            },
        },
    },
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    },
});