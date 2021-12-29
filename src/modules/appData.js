import { v4 as uuidv4 } from 'uuid';
import Bowser from "bowser";

const production = process.env.NODE_ENV === 'production' ? true : false;
const persistedProps = [
    "firstname",
    "lastname",
    "email",
    "deviceid",
    "deviceName",
    "activationkey",
    "authUserPreference",
    "menuBtnLeft",
    "menuBtnTop",
];
const loginProps = [
    "isAuthenticated",
    "authComplete",
    "isValidated",
    "loginToken",
    "clientauthtype",
    "passwordValidated",
    "biometricValidated",
    "secondauthmethod",
    "isCancelBiometric",
    "isCancelOTP",
    "isCancelPassword",
    "canSetOTPToken",
    "canSetBiometricToken",
    "sessionid"
];

const DEVICE_TYPE = "Desktop";

const appData = {

    // configuration
    //postURL: "/",
    production: production,
    postURL: production ? "/" :  "https://labil.nubosoftware.com/", //"http://127.0.0.1/", //"http://labil.nubosoftware.com:8080/",
    proxyURL: production ? null : "http://127.0.0.1:9080/", //"http://localhost:9080/",
    //proxyURL: null,

    // loaded users params
    appName: "Nubo Desktop",
    appVersion: "3.1.01",
    
    firstname: "",
    lastname: "",
    email: "",
    deviceid: "",
    deviceName: "",
    activationkey: "",
    menuBtnLeft: 0,
    menuBtnTop: 0,


    authComplete: "",
    secondauthmethod: "",
    isCancelBiometric: false,
    isCancelOTP: false,
    isCancelPassword: false,
    canSetOTPToken: false,
    canSetBiometricToken: false,
    deviceType: DEVICE_TYPE,

    // validation params
    
    isAuthenticated: false,
    isValidated: false,
    isValidatedChecked: false,
    loginToken: "",
    sessionid: "",
    clientauthtype: 0,
    passwordValidated: false,
    biometricValidated: false,
    authUserPreference: 0,

    // additional data
    moduleName: "",

    commit: () => {
        for (const prop of persistedProps) {
            appData.commitProp(prop);
        }
        for (const prop of loginProps) {
            appData.commitProp(prop);
        }
    },
    commitProp(prop) {
        let val = appData[prop];
        if (!val || val == "null") {
            localStorage.removeItem(prop);
        } else {
            localStorage.setItem(prop, appData[prop]);
        }
    },
    load: () => {
        console.log("Loading app data..");
        for (const prop of persistedProps) {
            appData[prop] = localStorage.getItem(prop);
        }
        for (const prop of loginProps) {
            appData[prop] = localStorage.getItem(prop);
            console.log(`${prop}: ${appData[prop]}`);
        }
        if (!appData.loginToken) {
            appData.clearValidate();
        }
        if (appData.isAuthenticated == "false") appData.isAuthenticated = false;
        console.log(`Loading app data appData.isAuthenticated: ${appData.isAuthenticated}`);
        
        if (!appData.deviceid || appData.deviceid == "") {
            appData.deviceid = uuidv4();
            localStorage.setItem("deviceid", appData.deviceid);
            console.log("appData.deviceid: " + appData.deviceid);
        }

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
    deleteAll: () => {
        for (const prop of persistedProps) {
            appData[prop] = '';
        }
        for (const prop of loginProps) {
            appData[prop] = '';
        }
        appData.commit();
        appData.load();
    },
    

};


appData.load();

export default appData