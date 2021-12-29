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
                :src="
                  appData.webCommon.logoURL
                    ? appData.webCommon.logoURL
                    : require('../assets/logo.png')
                "
              ></v-img>
            </v-toolbar>
            <div class="d-flex justify-center mb-6">
              <span class="text-h5">
                {{ $t("Remote Desktop Signup") }}
              </span>
            </div>
            <div class="d-flex justify-center mb-6 text-subtitle-1">
              {{ messageText }}
            </div>

            <v-container v-if="appData.webCommon.edition == 'community'">
              <v-divider class="ma-6"></v-divider>
              <div class="d-flex justify-center caption">
                Powered by:
                <a href="https://github.com/nubosoftware/linux-remote-desktop">
                  Linux Remote Desktop Open Source Project</a
                >
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

export default {
  name: "ActivationLink",
  data: () => ({
    messageText: "",
    status: 0,
    activationType: "NA",
    appData,
  }),
  methods: {},
  watch: {},
  created: function () {
    this.status = this.$route.params.status;
    this.activationType = this.$route.params.activationType;
    if (this.activationType == "ResetPassword") {
      if (this.status == 0) {
        this.messageText = this.$t("Reset password confirmed.");
      } else {
        this.messageText = this.$t("Reset password request has expired.");
      }
    } else if (this.activationType == "UnlockPassword") {
      if (this.status == 1) {
        this.messageText = this.$t("Password unlocked.");
      } else {
        this.messageText = this.$t("Password unlock request has expired.");
      }
    } else {
      if (this.status == 0) {
        this.messageText = this.$t("Remote desktop access confirmed.");
      } else {
        this.messageText = this.$t("Remote desktop approval has expired.");
      }
    }
  },
};
</script>