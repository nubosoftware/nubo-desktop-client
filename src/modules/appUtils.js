import appData from "./appData";
import axios from "axios";

const appUtils = {


    req: (options) => {
        if (appData.postURL && appData.postURL != "") {
            options.url = appData.postURL + options.url;
        }
        if (appData.proxyURL && appData.proxyURL != "") {
            options.url = appData.proxyURL + options.url;
        }
        if (!options.method) {
            options.method = "get";
        }
        if (!options.headers) {
            options.headers = {};
        }
        /*if (appData.adminLoginToken && appData.adminLoginToken != "") {
            options.headers['Authorization'] = `OAuth ${appData.adminLoginToken}`;
        }*/
        //console.log(options);
        return axios(options);
    },
    post: (options) => {
        options.method = "post";
        return appUtils.req(options);
    },
    get: (options) => {
        options.method = "get";
        return appUtils.req(options);
    },
    put: (options) => {
        options.method = "put";
        return appUtils.req(options);
    },
    delete: (options) => {
        options.method = "delete";
        return appUtils.req(options);
    }
}

export default appUtils