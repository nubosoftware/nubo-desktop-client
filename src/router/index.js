import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import appData from '../modules/appData'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/Login',
        name: 'Login',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Login.vue'),
    },
    {
        path: '/Splash',
        name: 'Splash',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Splash.vue'),
    },
    {
        path: '/Password',
        name: 'Password',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Password.vue'),
    },
    {
        path: '/Client',
        name: 'Client',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Client.vue'),
    },
    
]

const router = new VueRouter({
    routes
})


const noLoginRoutes = {
    "About": 1,
    "Message": 1,
    "Splash": 1,
    //"Password": 1,
};

router.beforeEach((to, from, next) => {
    if (!appData.isValidated && !(noLoginRoutes[to.name])) {
        console.log("Detect no login in route: " + to.name);
        //console.log(to);
        next({ name: 'Splash' })
    } else next()
})
export default router