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
                :src=" ( appData.webCommon.logoURL ? appData.webCommon.logoURL : require('../assets/logo.png'))  "
              ></v-img>
            </v-toolbar>
            <div class="d-flex justify-center mb-6">
              <v-banner class="text-h5">
                {{ $t("Remote Desktop") }}
              </v-banner>
            </div>
            <div class="d-flex justify-center mb-6 text-subtitle-1">
              {{ messageText }}
            </div>
            <div v-if="alertText != ''">
              <v-alert :type="alertType">
                {{ alertText }}
              </v-alert>
            </div>
            <div>
              <v-form v-model="valid" ref="form">
                <v-text-field
                  v-if="!resetOTP && !appData.canSetOTPToken"
                  :label="$t('OTP Code')"
                  v-model="otpcode"
                  :append-icon="e1 ? 'mdi-eye ' : 'mdi-eye-off'"
                  :append-icon-cb="() => (e1 = !e1)"
                  @click:append="() => (e1 = !e1)"
                  :type="e1 ? 'password' : 'text'"
                  :rules="passwordRules"
                  counter
                  required
                  autocomplete="off"
                  :name="Math.random()"
                  ref="otpField"
                ></v-text-field>

                <v-layout
                  justify-space-between
                  v-if="!resetOTP && !appData.canSetOTPToken"
                >
                  <v-btn
                    @click="submit"
                    color="primary"
                    :class="{
                      'blue darken-4 white--text': valid,
                      disabled: !valid,
                    }"
                    >{{ $t("Login") }}</v-btn
                  >

                  <v-btn
                    @click="
                      resetOTP = true;
                      messageText = $t('Reset the TOTP code?');
                    "
                    color="error"
                    :class="{
                      'blue darken-4 white--text': valid,
                      disabled: !valid,
                    }"
                    >{{ $t("Reset the TOTP code") }}</v-btn
                  >

                  <v-btn
                    @click="cancelOTP"
                    color="warning"
                    :class="{
                      'blue darken-4 white--text': valid,
                      disabled: !valid,
                    }"
                    >{{ $t("Cancel") }}</v-btn
                  >
                </v-layout>

                <v-layout v-if="resetOTP">
                  <v-btn
                    class="ma-4"
                    color="primary"
                    @click="resetPasswordSubmit"
                    >{{ $t("Reset OTP Code") }}</v-btn
                  >
                  <v-btn
                    class="ma-4"
                    color="warning"
                    @click="resetOTP = false || setPageParams()"
                    >{{ $t("Cancel") }}</v-btn
                  >
                </v-layout>
                <v-layout v-if="appData.canSetOTPToken">
                  <v-container>
                    <v-row justify="center">
                      <vue-qrcode :value="otpURL" />
                    </v-row>
                    <v-row justify="center">
                      <v-btn
                        class="ma-4"
                        color="primary"
                        @click="scanComplete()"
                        >{{ $t("Scan Complete") }}</v-btn
                      >
                      <v-btn
                        class="ma-4"
                        color="warning"
                        @click="cancelOTP()"
                        >{{ $t("Cancel") }}</v-btn
                      >
                    </v-row>
                  </v-container>
                </v-layout>
              </v-form>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    
  </v-container>
</template>


<style>
</style>

 <script>
import appData from "../modules/appData";
import appUtils from "../modules/appUtils";
import LoginController from "../modules/loginController";
import VueQrcode from "vue-qrcode";
//var base32 = require('base32');
var base32 = require("thirty-two");
//import HelloWorld from "../components/HelloWorld.vue";
//import FloatingMenu from "../components/FloatingMenu.vue"

export default {
  name: "OTP",
  components: {
    VueQrcode,
    //FloatingMenu
  },
  data: () => ({
    resetOTP: false,
    messageText: "",
    msgType: "info",
    alertText: "",
    alertType: "error",
    valid: false,
    e1: true,
    e2: true,
    otpcode: "",
    passwordCheck: "",
    otpURL: "otp://",
    token: "",
    passwordRules: [(v) => !!v || "Code is required"],
    appData,
  }),
  methods: {
    resetPasswordClick: function () {
      this.resetOTP = true;
      this.messageText = this.$t("Reset OTP Code?");
    },
    resetPasswordSubmit: function () {
      console.log("resetPasswordSubmit..");
      let params = {
        loginToken: appData.loginToken,
        action: "5",
      };
      appUtils
        .get({
          url: "resetPasscode",
          params,
        })
        .then((response) => {
          console.log(response.data);

          if (response.data.status == 1 || response.data.status == 2) {
            appData.clearValidate();
            this.$router.push("/Splash");
            return;
          } else {
            this.resetPassword = false;
            this.setPageParams();
            return;
          }
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
    },
    submitSetPassword: function () {
      this.messageText = this.$t("Setting password");
      let params = {
        loginToken: appData.loginToken,
        passcode: this.password,
      };
      appUtils
        .get({
          url: "setPasscode",
          params,
        })
        .then((response) => {
          console.log(response.data);

          if (response.data.status == 1) {
            console.log("Password set!");
            appData.passwordValidated = true;
            LoginController.instance.nuboAuthProcess(this);
          } else if (response.data.status == 0) {
            this.messageText = this.$t("Invalid password");
            this.msgType = "error";
            console.log("Error");
          }
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
    },
    cancelOTP: function () {
      appData.isCancelOTP = true;
      appData.authUserPreference =
        LoginController.LoginConstants.AUTH_PREFERENCE_UNKNOWN;
      LoginController.instance.nuboAuthProcess(this);
    },
    scanComplete: function () {
      this.messageText = this.$t("Setting OTP key..");
      let params = {
        loginToken: appData.loginToken,
        OTPCode: this.token,
      };
      console.log(`Params: ${JSON.stringify(params, null, 2)}`);
      appUtils
        .get({
          url: "checkOtpAuth",
          params,
        })
        .then((response) => {
          console.log(response.data);

          if (response.data.status == 1) {
            console.log("OTP set!");
            appData.canSetOTPToken = false;
            this.setPageParams();
          } else if (response.data.status == 0) {
            this.messageText = this.$t("Error");
            this.msgType = "error";
            console.log("Error");
          }
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
    },
    submit: function () {
      let isValid = this.$refs.form.validate();
      //console.log(`isValid: ${isValid}`);
      if (!isValid) {
        return;
      }
      this.messageText = this.$t("Checking OTP Code..");
      let params = {
        loginToken: appData.loginToken,
        OTPCode: this.otpcode,
      };
      console.log(`Params: ${JSON.stringify(params, null, 2)}`);
      appUtils
        .get({
          url: "checkOtpAuth",
          params,
        })
        .then((response) => {
          console.log(response.data);
          this.setPageParams();
          if (response.data.status == 1) {
            console.log("OTP validated!");
            appData.biometricValidated = true;
            appData.authUserPreference =
              LoginController.LoginConstants.AUTH_PREFERENCE_OTP;
            appData.commit();
            LoginController.instance.nuboAuthProcess(this);
          } else if (response.data.status == 32) {
            this.alertText = this.$t("Invalid OTP Code");
            this.alertType = "error";
          } else {
            this.alertText = this.$t("Error: " + response.data.message);
            this.alertType = "error";
          }
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
    },
    setPageParams: function() {
      //this.resetOTP = appData.passcodeActivationRequired;
      if (appData.canSetOTPToken) {
        this.messageText = this.$t("Please scan the below QR code");

        if (!this.token) {
          var array = new Uint8Array(32);
          window.crypto.getRandomValues(array);

          this.token = `${base32.encode(array)}`;
        }
        this.otpURL = `otpauth://totp/nubo:${appData.email}?secret=${this.token}&issuer=Nubo`;
        console.log(`this.otpURL: ${this.otpURL}`);
      } else {
        this.messageText = this.$t("Please enter your one-time password found in the TOTP app in your mobile device.");
        this.passwordRules = [
          (v) => !!v || this.$t("OTP code is required"),
          (v) => /^[0-9]+$/.test(v) || this.$t("Please enter only digits"),
        ];
      }
    },
  },
  watch: {},
  created: function () {
    this.setPageParams();
    
    //this.$emit("updatePage", "Login");
  },
  mounted: function () {
    let otpField = this.$refs["otpField"];
    if (otpField) {
      otpField.$refs.input.focus();
      otpField.$refs.input.setAttribute("autocomplete", "none");
    }
    //this.$refs["form"].$refs.form.setAttribute("autocomplete", "false");
  },
};
</script>