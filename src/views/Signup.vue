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
             
                <span class="text-h5">
                {{ $t("Remote Desktop Signup") }}
                </span>
             
            </div>
            <div class="d-flex justify-center mb-6 text-subtitle-1"  >
              {{ messageText }}
            </div>
            <div>
              <v-form v-model="valid" ref="form" >
                
                <v-text-field 
                  :label="$t('First name')"
                  v-model="firstName"
                  :rules="reqRule"
                  required
                />
                <v-text-field 
                  :label="$t('Last name')"
                  v-model="lastName"
                  :rules="reqRule"
                  required
                />
                <v-text-field
                  
                  :label="$t('Enter your email address')"
                  v-model="email"
                  :rules="emailRules"
                  required
                ></v-text-field>
                
                
                <v-layout justify-space-between >
                  <v-btn
                    @click="submit"
                    color="primary"
                    :class="{
                      'blue darken-4 white--text': valid,
                      disabled: !valid,
                    }"
                    >{{ $t("Activate") }}</v-btn
                  >
                  <a href="#" @click="cancelClick">{{
                    $t("Cancel")
                  }}</a>
                </v-layout>
                
              </v-form>
              
            </div>
            <v-container v-if="appData.webCommon.edition == 'community'">  
              <v-divider class="ma-6"></v-divider>
              <div class="d-flex justify-center caption">
                Powered by: <a href="https://github.com/nubosoftware/linux-remote-desktop"> Linux Remote Desktop Open Source Project</a>
              </div>
            </v-container>
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
//import LoginController from "../modules/loginController"
import HmacSHA1 from 'crypto-js/hmac-sha1';
import Hex from 'crypto-js/enc-hex'


export default {
  name: "Signup",
  data: () => ({
    messageText: "",
    msgType: "info",
    valid: false,
    firstName: "",
    lastName: "",
    e1: true,
    e2: true,
    email: "",
    emailRules: [
      (v) => !!v || "Email is required",
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(v) ||
        "Email must be valid",
    ],
    reqRule: [
      (v) => !!v || "Required",
    ],
    activate_text: "",
    appData,
  }),
  methods: {
    cancelClick: function() {
      this.$router.push("/Splash");
    },
    submit: function () {
      let isValid = this.$refs.form.validate();
      console.log(`isValid: ${isValid}`);
      if (!isValid) {
        return;
      }
      console.log("submit");
      this.messageText = this.$t("Signup in progress..");
      this.msgType = "info";

      let plain = this.email + '_' + appData.deviceid;
      //et signature = CryptoJS.HmacSHA1(
      let signature = Hex.stringify(HmacSHA1(
        plain,
        "1981abe0d32d93967648319b013b03f05a119c9f619cc98f"
      ));
      console.log("signature=" + signature);

      let params = {
        deviceid: appData.deviceid,
        email: this.email,
        signature: signature,
        regid: "none",
        first: this.firstName,
        last: this.lastName,
        title: 'NA',
        deviceType: appData.deviceType,
        deviceName: appData.deviceName
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
              appData.firstname = this.firstName;
              appData.lastname = this.lastName;
              appData.validationWait = true;
              this.messageText = this.$t("A verification message has been sent to your inbox. Please click the link to gain access to your remote desktop.");
              appData.commit();
              this.$router.push("/Splash");
            } else {
              this.messageText = this.$t("Sign up error: ")+response.data.message;
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
    
  },
  created: function () {

    this.activate_text  = this.$t("Sign up to gain access to your remote desktop.");
    this.email = appData.email;
    this.firstName = appData.firstname;
    this.lastName = appData.lastname;
    this.messageText = this.activate_text;
    
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