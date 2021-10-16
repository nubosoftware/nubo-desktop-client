//import { v4 as uuidv4 } from 'uuid';
import Bowser from "bowser";

const production = process.env.NODE_ENV === 'production' ? true : false;
const persistedProps = [
    "firstname",
    "lastname",
    "email",
    "deviceid",
    "deviceName",
    "activationkey"
];
const loginProps = [
    "isAuthenticated",
    "authComplete",
    "isValidated",
    "loginToken",
    "clientauthtype",
    "passwordValidated",
    "biometricValidated",
    "authUserPreference"
];

const appData = {

    // configuration
    //postURL: "/",
    postURL: production ? "/" :  "http://127.0.0.1/", //"http://labil.nubosoftware.com:8080/",
    proxyURL: production ? null : "http://127.0.0.1:9080/", //"http://localhost:9080/",
    //proxyURL: null,

    // loaded users params
    appName: "Nubo Desktop",
    
    firstname: "",
    lastname: "",
    email: "",
    deviceid: "",
    deviceName: "",
    activationkey: "",
    authComplete: "",

    // validation params
    
    isAuthenticated: false,
    isValidated: false,
    loginToken: "",
    clientauthtype: 0,
    passwordValidated: false,
    biometricValidated: false,
    authUserPreference: 0,

    // additional data
    moduleName: "",

    commit: () => {
        for (const prop of persistedProps) {
            localStorage.setItem(prop, appData[prop]);
        }
    },
    commitProp(prop) {
        localStorage.setItem(prop, appData[prop]);
    },
    load: () => {
        console.log("Loading app data..");
        for (const prop of persistedProps) {
            appData[prop] = localStorage.getItem(prop);
        }
        if (appData.isAuthenticated == "false") appData.isAuthenticated = false;
        console.log(`Loading app data appData.isAuthenticated: ${appData.isAuthenticated}`);
        
        /*if (!appData.deviceid || appData.deviceid == "") {
            appData.deviceid = uuidv4();
            localStorage.setItem("deviceid", appData.deviceid);
            //console.log("appData.deviceid: " + appData.deviceid);
        }*/

        if (!appData.deviceName || appData.deviceName == "") {
            let parsedUserAgent = Bowser.parse(navigator.userAgent);
            appData.deviceName = `${parsedUserAgent.browser.name}`;
            localStorage.setItem("deviceName", appData.deviceName);
            console.log(`deviceName: ${appData.deviceName}`);
        }
        
        console.log(`Email: ${appData.email}`);
    },
    clearValidate() {
        for (const prop of loginProps) {
            appData[prop] = '';
        }
    },
    logout: () => {
        for (const prop of persistedProps) {
            localStorage.setItem(prop, "");
        }
        appData.commit();
        appData.load();
    },

};


appData.load();

export default appData