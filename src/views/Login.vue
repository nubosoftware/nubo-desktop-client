<template>
  <v-container fluid fill-height class="bg">
    <v-layout flex align-center justify-center color="bg">
      <v-flex xs12 sm4 elevation-6 color="bg">
        <v-card color="bg">
          <v-card-text class="pt-4">
            <div v-if="messageText != ''">
              <v-alert :type="msgType">
                {{ messageText }}
              </v-alert>
            </div>
            <div >
              <v-form v-model="valid" ref="form" v-if="!validationWait">
                <v-text-field
                 v-if="!setPassword"
                  :label="$t('Enter your email address')"
                  v-model="email"
                  :rules="emailRules"
                  required
                ></v-text-field>
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
                <v-layout justify-space-between  v-if="!resetPassword">
                  <v-btn
                    @click="submit"
                    :class="{
                      'blue darken-4 white--text': valid,
                      disabled: !valid,
                    }"
                    >{{ $t("login") }}</v-btn
                  >
                  <a href="#" @click="resetPasswordClick">{{ $t("Forgot Password") }}</a>
                </v-layout>
                <v-layout v-if="resetPassword">
                  <v-btn
                    class="ma-4"
                    color="primary"
                    @click="resetPasswordSubmit"
                    >{{ $t("Reset Password") }}</v-btn>
                   <v-btn
                    class="ma-4"
                    color="warning"
                    @click="resetPassword = false"
                    >{{ $t("Cancel") }}</v-btn>
                </v-layout>
              </v-form>
              <v-layout v-else justify-space-between>
                  <v-btn
                    @click="validationWait=false"
                    color="warning"
                    >{{ $t("Cancel") }}</v-btn
                  >
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

.loginOverlay {
  background: rgba(33, 150, 243, 0.3);
}

.photoCredit {
  position: absolute;
  bottom: 15px;
  right: 15px;
}
</style>

 <script>
import appData from "../modules/appData";
import appUtils from "../modules/appUtils";

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
    appData,
  }),
  methods: {
    checkValidationLoop: function(){
      let thisPage = this;
      setTimeout(function(){
        if (thisPage.validationWait) {
          appUtils
            .post({
              url: "api/auth/validate",
              data: {
                email: thisPage.email,
                deviceid: appData.deviceid,
                activationkey: appData.activationkey,
              },
            })
            .then((response) => {
              console.log(response.data);
              if (response.data.status == 200 || response.data.status == 202) {
                console.log("Pending...");
                if (thisPage.validationWait) {
                  thisPage.checkValidationLoop();
                }
              } else if (response.data.status == 201) {
                console.log("Validatd!");
                if (response.data.resetpasscode != 1) {
                  thisPage.validationWait = false;
                  thisPage.messageText = thisPage.$t("Validated!");
                  thisPage.submit();
                } else {
                    console.log("Reset passcode");
                    thisPage.messageText = thisPage.$t("Please select new password");
                    thisPage.password = "";
                    thisPage.passwordCheck = "";
                    thisPage.validationWait = false;
                    thisPage.setPassword = true;
                }
              } else {
                console.log("Error");
                thisPage.validationWait = false;
                thisPage.messageText = thisPage.$t("Log in to the Admin Control Panel")
              }
            }).catch((error) => {
              console.log(error);
              if (thisPage.validationWait) {
                  thisPage.checkValidationLoop();
              }
            })
        }
      },1000);
    },
    resetPasswordClick: function() {
      this.resetPassword = true;
      this.messageText = this.$t("Reset password");
    },
    resetPasswordSubmit: function() {
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
            this.messageText = this.$t("A verification messaage has been sent to your email address. Please click the verification link in that email.");
            this.checkValidationLoop();
          } else {
            this.messageText = this.$t(
              "Reset password error"
            );
            this.msgType = "error";
            console.log("Error");
            
          }
        }).catch((error) => console.log(error));
    },
    submit: function () {
      //if (this.$refs.form.validate()) {
        console.log("submit");
        this.messageText = this.$t("Checking login information");
        this.msgType = "info";

        let data = {
                userName: this.email,
                password: this.password,
                deviceid: appData.deviceid,
                deviceName: appData.deviceName,
                activationkey: appData.activationkey,
                selectedDomain: appData.mainDomain
        };
        if (this.setPassword) {
          data.setPassword = this.passwordCheck;
        }
        setTimeout(() => {
          appUtils
            .post({
              url: "api/auth",
              data,
            })
            .then((response) => {
              console.log(response.data);
              this.setPassword = false;
              if (response.data.status == 200) {
                appData.activationkey = response.data.activationkey;
                appData.email = this.email;
                this.validationWait = true;
                this.messageText = this.$t("A verification messaage has been sent to your email address. Please click the verification link in that email.");
                this.checkValidationLoop();
                
              } else if (response.data.status != 1) {
                this.messageText = this.$t(
                  "Incorrect email address or password"
                );
                this.msgType = "error";
                console.log("Error");
              } else {
                this.messageText = this.$t("Login successful");
                this.msgType = "success";
                appData.isAuthenticated = true;
                appData.adminLoginToken = response.data.loginToken;
                appData.mainDomain = response.data.mainDomain;
                appData.firstname = response.data.firstname;
                appData.lastname = response.data.lastname;
                appData.imageurl = response.data.imageurl;
                appData.email = this.email;
                appData.resetOrgs(response.data.orgs);
                
                appData.siteAdmin = response.data.siteAdmin;
                appData.siteAdminDomain = response.data.siteAdminDomain;
                try {
                  appData.permissions =  JSON.parse(response.data.permissions);
                } catch (err) {
                  console.log("Error parse permissions",err);
                  appData.permissions = {};
                }
                console.log(
                  "appData.permissions: " + JSON.stringify(appData.permissions, null, 2)
                );
                appData.orgname =
                  response.data.orgname && response.data.orgname != ""
                    ? response.data.orgname
                    : response.data.mainDomain;
                appData.commit();
                this.$emit("checkLoginLoop", response.data.loginToken);
                this.$emit("updatePermissions");
                this.$router.push("/");
              }
            })
            .catch((error) => console.log(error))
            .finally(() => (this.loading = false));
        }, 100);
      /*} else {
        console.log("Submit. form is not valid..");
      }*/
    },
  },
  watch: {
    "validationWait": function(newVal) {
      console.log(`validationWait: ${newVal}`);
      appData.validationWait = newVal;

    }
  },
  created: function () {
    this.validationWait = appData.validationWait;
    this.email = appData.email;
    if (this.validationWait) {
      this.messageText = this.$t("A verification messaage has been sent to your email address. Please click the verification link in that email.");
      this.checkValidationLoop();
    } else {
      this.messageText = this.$t("Log in to the Admin Control Panel");
    }
    this.passwordRules = [(v) => !!v || this.$t("Password is required")];
    this.checkPasswordRules = [
      (v) => !!v || this.$t("Password is required"),
      (v) => v === this.password || "Passwords do not match"
    ];
    this.emailRules = [
      (v) => !!v || this.$t("Email is required"),
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(v) ||
        this.$t("Email must be valid"),
    ];
    this.$emit("updatePage", "Login");
  },
};
</script>