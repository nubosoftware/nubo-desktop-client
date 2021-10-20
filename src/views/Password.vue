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
            <div class="d-flex justify-center mb-6 text-subtitle-1">
              {{ messageText }}
            </div>
            <div v-if="alertText != ''">
              <v-alert :type="alertType">
                {{ alertText }}
              </v-alert>
            </div>
            <div>
              <v-form v-model="valid" ref="form"
                autocomplete="off"
              >
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
                  autocomplete="chrome-off"
                  ref="passwordField"
                ></v-text-field>
                <v-text-field
                  v-if="!resetPassword && setPassword"
                  :label="$t('Re-enter your password')"
                  v-model="passwordCheck"
                  min="8"
                  :append-icon="e2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :append-icon-cb="() => (e2 = !e2)"
                  @click:append="() => (e2 = !e2)"
                  :type="e2 ? 'password' : 'text'"
                  :rules="checkPasswordRules"
                  counter
                  required
                  autocomplete="chrome-off"
                ></v-text-field>
                <div v-if="!resetPassword && setPassword">
                  Required:<br/>
{{$t("Minimum characters",{minChars: appData.passcodeminchars})}}<br/>
<span v-if="appData.passcodetype == 1">
{{$t("- Both upper-case and lower-case letters.")}}<br/>
{{$t("- One or more numerical digits.")}} <br/>
{{$t("- One or more special characters.")}}<br/>
</span>
<br/>

                </div>
                <v-layout justify-space-between v-if="!resetPassword">
                  <v-btn
                    @click="submit"
                    color="primary"
                    :class="{
                      'blue darken-4 white--text': valid,
                      disabled: !valid,
                    }"
                    >{{ (!setPassword ? $t("Login") : $t("Set Password")) }}</v-btn
                  >
                  <a 
                  v-if="!resetPassword && !setPassword"
                  href="#/Password" 
                  @click="resetPasswordClick">{{
                    $t("Forgot Password?")
                  }}</a>
                </v-layout>
                
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
                    @click="resetPasswordCancel"
                    >{{ $t("Cancel") }}</v-btn
                  >
                </v-layout>
              </v-form>
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
import LoginController from '../modules/loginController';
//import LoginController from "../modules/loginController"

export default {
  name: "Password",
  data: () => ({
    resetPassword: false,
    setPassword: false,
    messageText: "",
    alertText: "",
    alertType: "error",
    valid: false,
    e1: true,
    e2: true,
    password: "",
    passwordCheck: "",
    passwordRules: [(v) => !!v || "Password is required"],
    checkPasswordRules: [(v) => !!v || "Password is required"],
    appData,
  }),
  methods: {
    resetPasswordClick: function () {
      this.resetPassword = true;
      this.messageText = this.$t("Are you sure you want to reset your password?");
    },
    resetPasswordCancel: function() {
      this.resetPassword = false;
      appData.isCancelPassword = true;
      appData.authUserPreference = LoginController.LoginConstants.AUTH_PREFERENCE_UNKNOWN;
      appData.commit();
      LoginController.instance.nuboAuthProcess(this);
    },
    resetPasswordSubmit: function () {
      console.log("resetPasswordSubmit..");
      let params = {
        loginToken: appData.loginToken,
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
            appData.authUserPreference = LoginController.LoginConstants.AUTH_PREFERENCE_PASSWORD;
            appData.commit();
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
    submitSetPassword: function() {
      this.alertText = this.$t("Setting password");
      this.alertType = "info";
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
          this.alertText = "";
          if (response.data.status == 1) {
            console.log("Password set!");
            appData.passwordValidated = true;
            LoginController.instance.nuboAuthProcess(this);
          } else if (response.data.status == 0) {
            this.alertText = this.$t("Error");
            this.alertType = "error";
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
      if (this.setPassword) {
        this.submitSetPassword();
        return;
      }
      this.alertText = this.$t("Checking login information");
      this.alertType = "info";
      //var url = mgmtURL + "checkPasscode?loginToken=" + encodeURIComponent(loginToken) + "&passcode=" + encodeURIComponent(enterPasscode);
      let params = {
        loginToken: appData.loginToken,
        passcode: this.password,
      };
      appUtils
        .get({
          url: "checkPasscode",
          params,
        })
        .then((response) => {
          console.log(response.data);
          this.alertText = "";
          if (response.data.status == 1) {
            console.log("Password checked!");
            appData.passwordValidated = true;
            appData.authUserPreference = LoginController.LoginConstants.AUTH_PREFERENCE_PASSWORD;
            appData.commit();
            LoginController.instance.nuboAuthProcess(this);
          } else if (response.data.status == 0) {
            this.alertText = this.$t("Incorrect password");
            this.alertType = "error";
            console.log("Error");
          } else {
            // this is other error - most probably password locked. Go again to validate
            this.$router.push("/Splash");
          }
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
    },
    setPageParams() {
      this.setPassword = appData.passcodeActivationRequired;
      if (this.setPassword) {
        this.messageText = this.$t('Create your password.');
        this.passwordRules = [
          (v) => !!v || this.$t("Password is required"),
          (v) => v.length >= appData.passcodeminchars || this.$t("Minimum characters",{minChars: appData.passcodeminchars}),
          (v) => {
            if (appData.passcodetype == 1) {
              let upper =  /[A-Z]+/.test(v);
              let lower =  /[a-z]+/.test(v);
              if (!upper || !lower) {
                return this.$t("Required: both upper-case and lower-case letters");
              }
              if (!/[0-9]+/.test(v)) {
                return this.$t("Required: one or more numerical digits.");
              }
              if (!/[$&+,:;=\\?@#|/'<>.^*_~{}()%!-]/.test(v)) {
                return this.$t("Required: one or more special characters.");
              }
              return true;
            } else {
              return true;
            }
          }
        ];
      } else {
        this.messageText = this.$t('Enter your password.');
        this.passwordRules = [(v) => !!v || this.$t("Password is required")];
      }

      
      this.checkPasswordRules = [
        (v) => !!v || this.$t("Password is required"),
        (v) => v === this.password || this.$t("Passwords do not match."),
      ];
    }
  },
  watch: {},
  created: function () {
    this.setPageParams();
    

    //this.$emit("updatePage", "Login");
  },
  mounted: function () {
    this.$refs["passwordField"].$refs.input.focus();
    this.$refs["passwordField"].$refs.input.setAttribute("autocomplete","none");
    this.$refs["form"].$refs.form.setAttribute("autocomplete","false");
    
  }
};
</script>