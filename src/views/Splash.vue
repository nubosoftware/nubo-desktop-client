<template>
  <v-container fluid fill-height class="bg">
    <v-layout flex align-center justify-center color="bg">
      <v-flex xs12 sm4 elevation-0 color="bg">
        <v-card color="bg">
          <v-card-text class="pt-4">
            <v-toolbar color="bg" elevation-0 style="box-shadow: none">
              <v-img
                class="mx-auto"
                max-height="50"
                max-width="100"
                :src="require('../assets/logo.png')"
              ></v-img>
            </v-toolbar>
            <div class="d-flex justify-center mb-6">
              <v-banner class="text-h5">
                {{ $t("Remote Desktop") }}
              </v-banner>
            </div>
            <div class="d-flex justify-center mb-6 text-subtitle-1"  >
              {{ messageText }}
            </div>
            <div>
              <v-form v-model="valid" ref="form" v-if="!validationWait">
                <v-text-field
                  v-if="!setPassword"
                  :label="$t('Enter your email address')"
                  v-model="email"
                  :rules="emailRules"
                  required
                ></v-text-field>
                <!--
                <v-text-field
                  v-if="!resetPassword"
                  :label="$t('Enter your password')"
                  v-model="password"
                  min="8"
                  :append-icon="e1 ? 'mdi-eye ' : 'mdi-eye-off'"
                  :append-icon-cb="() => (e1 = !e1)"
                  @click:append="() => (e1 = !e1)"
                  :type="e1 ? 'password' : 'text'"
                  :rules="passwordRules"
                  counter
                  required
                ></v-text-field>
                <v-text-field
                  v-if="!resetPassword && setPassword"
                  :label="$t('Re-enter your password')"
                  v-model="passwordCheck"
                  min="8"
                  :append-icon="e2 ? 'eye' : 'mdi-eye-off'"
                  :append-icon-cb="() => (e2 = !e2)"
                  @click:append="() => (e2 = !e2)"
                  :type="e2 ? 'password' : 'text'"
                  :rules="checkPasswordRules"
                  counter
                  required
                ></v-text-field>-->
                <v-layout justify-space-between v-if="!resetPassword">
                  <v-btn
                    @click="submit"
                    color="primary"
                    :class="{
                      'blue darken-4 white--text': valid,
                      disabled: !valid,
                    }"
                    >{{ $t("Activate") }}</v-btn
                  >
                  <a href="#" @click="resetPasswordClick">{{
                    $t("Sign Up")
                  }}</a>
                </v-layout>
                <!--
                <v-layout v-if="resetPassword">
                  <v-btn
                    class="ma-4"
                    color="primary"
                    @click="resetPasswordSubmit"
                    >{{ $t("Reset Password") }}</v-btn
                  >
                  <v-btn
                    class="ma-4"
                    color="warning"
                    @click="resetPassword = false"
                    >{{ $t("Cancel") }}</v-btn
                  >
                </v-layout>-->
              </v-form>
              <v-layout v-else justify-space-between>
                <v-btn @click="resetActivation()" color="warning">{{
                  $t("Cancel")
                }}</v-btn>
              </v-layout>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!--<v-banner v-else :sticky="sticky" coloe="bg">
          A verification messaage has been sent to your email address.<br>
          Please click the verification link in that email.

          <template v-slot:actions>
            <v-btn text color="deep-purple accent-4"> Send email again </v-btn>
          </template>
        </v-banner>-->
  </v-container>
</template>


<style>
</style>

 <script>
import appData from "../modules/appData";
import appUtils from "../modules/appUtils";
import LoginController from "../modules/loginController"
import HmacSHA1 from 'crypto-js/hmac-sha1';
import Hex from 'crypto-js/enc-hex'

const DEVICE_ID = "desktop";
const DEVICE_TYPE = "Desktop";
const DEVICE_NAME = "Desktop";

/*
{
    "status": 1,
    "message": "Device activated !",
    "authenticationRequired": false,
    "passcodeActivationRequired": false,
    "orgName": "Demo",
    "authType": "0",
    "firstName": "Test",
    "lastName": "4",
    "jobTitle": "",
    "sendTrackData": true,
    "trackDataUrl": "https://nubosoftware.com/track/trackAPI",
    "platformVersionCode": 360,
    "photoCompression": 70,
    "clientProperties": {
        "wallpaperX": "html/player/clientWallpaper/wallpaper.jpg",
        "passcodeTimeout": 300
    },
    "sendCameraDetails": true,
    "passcodeminchars": 6,
    "passcodetype": 1,
    "passcodetypechange": 0,
    "clientauthtype": 4,
    "secondauthmethod": 3,
    "otptype": 0,
    "watermark": "Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    Nubo Demo App                                    ",
    "canSetBiometricToken": true,
    "canSetOTPToken": true,
    "disableUserAuthentication": false,
    "loginToken": "3c2aa34c9f472419d0ce445d61a202fca977f8d74df2d8a0c0cf9f8df7ebc803dcd8dccd8c0cb0a6e5888f743a52b951"
}
*/
export default {
  name: "Login",
  data: () => ({
    validationWait: false,
    resetPassword: false,
    setPassword: false,
    messageText: "",
    msgType: "info",
    valid: false,
    e1: true,
    e2: true,
    password: "",
    passwordCheck: "",
    passwordRules: [(v) => !!v || "Password is required"],
    checkPasswordRules: [(v) => !!v || "Password is required"],
    email: "",
    emailRules: [
      (v) => !!v || "Email is required",
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(v) ||
        "Email must be valid",
    ],
    activate_text: "",
    appData,
  }),
  methods: {
    resetActivation() {
      this.validationWait = false;
      appData.activationkey = "";
      this.messageText = this.activate_text;
      appData.commit();
    },
    checkValidation: function () {
      let thisPage = this;
      if (thisPage.validationWait) {
         appData.clearValidate();
          appUtils
            .get({
              url: "validate",
              params: {
                username: thisPage.email,
                deviceid: appData.deviceid,
                activationKey: appData.activationkey,
                playerVersion: "3.0.50"
              },
            })
            .then((response) => {
              console.log(response.data);
              if (response.data.status == 0) {
                console.log("Pending...");
                this.messageText = this.$t(
                  "A verification messaage has been sent to your email address. Please click the verification link in that email."
                );
                if (thisPage.validationWait) {
                  thisPage.checkValidationLoop();
                }
              } else if (response.data.status == 1) {
                console.log("Validatd!");
                appData.loginToken = response.data.loginToken;
                appData.clientauthtype = response.data.clientauthtype;
                appData.secondauthmethod = response.data.secondauthmethod;
                appData.isValidated = true;
                  thisPage.validationWait = false;
                  thisPage.messageText = thisPage.$t("Validated!");
                  LoginController.instance.nuboAuthProcess(thisPage);
               
                  //thisPage.submit();
                
              } else {
                console.log("Error");
                thisPage.validationWait = false;
                thisPage.messageText = thisPage.$t(
                  "Log in to the Admin Control Panel"
                );
              }
            })
            .catch((error) => {
              console.log(error);
              if (thisPage.validationWait) {
                thisPage.checkValidationLoop();
              }
            });
        }
    },
    checkValidationLoop: function () {
      let thisPage = this;
      setTimeout(function () {
        thisPage.checkValidation();
      }, 1000);
    },
    resetPasswordClick: function () {
      this.resetPassword = true;
      this.messageText = this.$t("Reset password");
    },
    resetPasswordSubmit: function () {
      console.log("resetPasswordSubmit..");
      appUtils
        .post({
          url: "api/auth/reset",
          data: {
            userName: this.email,
            deviceid: appData.deviceid,
            deviceName: appData.deviceName,
            activationkey: appData.activationkey,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.resetPassword = false;
          if (response.data.status == 200) {
            appData.activationkey = response.data.activationkey;
            appData.email = this.email;
            this.validationWait = true;
            this.messageText = this.$t(
              "A verification messaage has been sent to your email address. Please click the verification link in that email."
            );
            this.checkValidationLoop();
          } else {
            this.messageText = this.$t("Reset password error");
            this.msgType = "error";
            console.log("Error");
          }
        })
        .catch((error) => console.log(error));
    },
    submit: function () {
      //if (this.$refs.form.validate()) {
      console.log("submit");
      this.messageText = this.$t("Checking login information");
      this.msgType = "info";

      let deviceID = DEVICE_ID
      appData.deviceid = deviceID;
      let plain = this.email + '_' + deviceID;
      //et signature = CryptoJS.HmacSHA1(
      let signature = Hex.stringify(HmacSHA1(
        plain,
        "1981abe0d32d93967648319b013b03f05a119c9f619cc98f"
      ));
      console.log("signature=" + signature);

      /*var url =
        mgmtURL +
        "/activate?deviceid=" +
        encodeURIComponent(settings.get("deviceID")) +
        "&email=" +
        encodeURIComponent(settings.get("workEmail")) +
        "&signature=" +
        encodeURIComponent(signature) +
        "&regid=none&alreadyUser=Y&deviceType=Web&deviceName=Web";*/

      let params = {
        deviceid: deviceID,
        email: this.email,
        signature: signature,
        regid: "none",
        alreadyUser: "Y",
        deviceType: DEVICE_TYPE,
        deviceName: DEVICE_NAME
      };
      
      
        appUtils
          .get({
            url: "activate",
            params,
          })
          .then((response) => {
            console.log(response.data);
            
            if (response.data.status == 0) {
              appData.activationkey = response.data.activationKey;
              appData.email = this.email;
              appData.validationWait = true;
              this.validationWait = true;
              this.messageText = this.$t(
                "A verification messaage has been sent to your email address. Please click the verification link in that email."
              );
              appData.commit();
              this.checkValidationLoop();
            } else {
              this.messageText = this.$t("Incorrect email address or password");
              this.msgType = "error";
              console.log("Error");
            } 
          })
          .catch((error) => console.log(error))
          .finally(() => (this.loading = false));
      
      /*} else {
        console.log("Submit. form is not valid..");
      }*/
    },
  },
  watch: {
    /*validationWait: function (newVal) {
      console.log(`validationWait: ${newVal}`);
      appData.validationWait = newVal;
    },*/
  },
  created: function () {

    
    this.activate_text  = this.$t("Activate access to remote desktop from this browser")
    this.validationWait = (appData.activationkey != "");
    console.log(`validationWait: ${appData.validationWait}`);
    this.email = appData.email;
    if (this.validationWait) {
      this.messageText = this.$t("Checking activation...");
      this.checkValidation();
    } else {
      this.messageText = this.activate_text;
    }
    
    this.passwordRules = [(v) => !!v || this.$t("Password is required")];
    this.checkPasswordRules = [
      (v) => !!v || this.$t("Password is required"),
      (v) => v === this.password || "Passwords do not match",
    ];
    this.emailRules = [
      (v) => !!v || this.$t("Email is required"),
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(v) ||
        this.$t("Email must be valid"),
    ];
    //this.$emit("updatePage", "Login");
  },
};
</script>