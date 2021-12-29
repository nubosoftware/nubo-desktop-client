import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import appData from '../modules/appData'
import appUtils from "../modules/appUtils"

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/About',
        name: 'About',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue'),
    },
    {
        path: '/Splash',
        name: 'Splash',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Splash.vue'),
    },
    {
        path: '/Signup',
        name: 'Signup',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Signup.vue'),
    },
    {
        path: '/Password',
        name: 'Password',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Password.vue'),
    },
    {
        path: '/OTP',
        name: 'OTP',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/OTP.vue'),
    },
    {
        path: '/Client',
        name: 'Client',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Client.vue'),
    },
    {
        path: '/ActivationLink/:status/:activationType',
        name: 'ActivationLink',
        component: () =>
            import ( '../views/ActivationLink.vue'),
    },
    
]

const router = new VueRouter({
    routes
})


const noLoginRoutes = {
    "About": 1,
    "Message": 1,
    "Splash": 1,
    "Signup": 1,
    "ActivationLink": 1,
    //"Password": 1,
};

router.beforeEach((to, from, next) => {
    //console.log(`navigator.language: ${navigator.language}`);
    //console.log(`router.beforeEach. to: ${to.name}, from: ${from.name}`);
    appUtils.getWebCommon().then(() => {
        if (noLoginRoutes[to.name]) {
            next()
        } else if (!appData.isValidated) {
            console.log("Detect no login in route: " + to.name);
            //console.log(to);
            next({ name: 'Splash' })
        } else {
            if (appData.isValidated && !appData.isValidatedChecked) {
                console.log("recheckValidate for login token: " + appData.loginToken);
                appUtils
                    .get({
                        url: "recheckValidate",
                        params: {
                            loginToken: appData.loginToken,
                        },
                    })
                    .then((response) => {
                        console.log(`recheckValidate ressponse..`);
                        console.log(response.data);
                        if (response.data.status == 1) {
                            next();
                        } else {
                            next({ name: 'Splash' });
                        }
                    }).catch( (err) => {
                        console.error(err);
                        next({ name: 'Splash' });
                    });
            }  else {
                next()
            }
        }
    }).catch(err => {
        console.error("Error in getWebCommon",err);
        next({ name: 'Splash' });
    });
    
})
export default router