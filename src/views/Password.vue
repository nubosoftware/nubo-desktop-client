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
            <div>
              <v-form v-model="valid" ref="form">
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
                ></v-text-field>
                <v-layout justify-space-between v-if="!resetPassword">
                  <v-btn
                    @click="submit"
                    color="primary"
                    :class="{
                      'blue darken-4 white--text': valid,
                      disabled: !valid,
                    }"
                    >{{ $t("Login") }}</v-btn
                  >
                  <!--<a href="#" @click="resetPasswordClick">{{
                    $t("Sign Up")
                  }}</a>-->
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
    msgType: "info",
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

          if (response.data.status == 1) {
            console.log("Password checked!");
            appData.passwordValidated = true;
            LoginController.instance.nuboAuthProcess(this);
          } else if (response.data.status == 0) {
            this.messageText = this.$t("Incorrect password");
            this.msgType = "error";
            console.log("Error");
          }
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
    },
  },
  watch: {},
  created: function () {
    this.passwordRules = [(v) => !!v || this.$t("Password is required")];
    this.checkPasswordRules = [
      (v) => !!v || this.$t("Password is required"),
      (v) => v === this.password || "Passwords do not match",
    ];

    //this.$emit("updatePage", "Login");
  },
};
</script>