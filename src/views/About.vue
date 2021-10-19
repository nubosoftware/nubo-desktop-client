<template>
  <v-container fluid fill-height class="bg">
    <v-layout flex align-center justify-center color="bg">
      <v-flex xs12 sm4 elevation-0 color="bg">
        <v-card color="bg">
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
              {{ $t("About") }} {{ appData.appName }}
            </v-banner>
          </div>

          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="item in items" :key="item.name" class="bg">
                  <td>{{ item.name }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-row justify="center">
            <v-btn class="ma-4" color="primary" @click="back()">{{
              $t("Back")
            }}</v-btn>
            <v-btn class="ma-4" color="warning" v-if="appData.email"  @click="logout()">{{
              $t("Logout user")
            }}</v-btn>
            <v-btn class="ma-4" color="error" @click="dialog = true">{{
              $t("Delete all user data")
            }}</v-btn>
          </v-row>
        </v-card>
      </v-flex></v-layout
    >
    <v-snackbar v-model="snackbarSave" :timeout="2000">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="info" text v-bind="attrs" @click="snackbarSave = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="dialog" persistent max-width="290" overlay-color="bg">
      <v-card>
        <v-card-title>
          {{ $t("Delete all user data") }}
        </v-card-title>
        <v-card-text>
          {{
            $t("Are you sure you want to delete all user data from this client?")
          }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" @click="dialog = false"> Cancel </v-btn>
          <v-btn color="primary" @click="deleteOK"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import appData from "../modules/appData";
import appUtils from "../modules/appUtils";
import Bowser from "bowser";

export default {
  name: "Home",
  data: () => ({
    langs: ["iw", "en"],
    items: [],
    dialog: false,
    snackbarSave: false,
    snackbarText: "",
    appData,
  }),
  methods: {
    deleteOK: function () {
      this.dialog = false;
      appData.deleteAll();
      this.$router.push("/Splash");
    },
    back: function () {
      this.$router.push("/Splash");
    },
    logout: function () {
      //var url = mgmtURL + "logoutUser?loginToken=" + encodeURIComponent(loginToken);
      console.log("Loggout user..");
      let params = {
        loginToken: appData.loginToken,
      };
      appUtils
        .get({
          url: "logoutUser",
          params,
        })
        .then((response) => {
          console.log(response.data);
          appData.clearValidate();
          this.$router.push("/Splash");
          return;
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
        this.snackbarText = this.$t("Logout command has been sent");
        this.snackbarSave = true;
    },
  },
  created: function () {
    let bowser = Bowser.parse(navigator.userAgent);
    this.items = [
      {
        name: this.$t("App name"),
        value: appData.appName,
      },
      {
        name: this.$t("App version"),
        value: appData.appVersion,
      },
      {
        name: this.$t("User ID"),
        value: appData.email,
      },
      {
        name: this.$t("Device ID"),
        value: appData.deviceid,
      },
      {
        name: this.$t("Browser"),
        value: `${bowser.browser.name} ${bowser.browser.version}`,
      },
      {
        name: this.$t("Operating System"),
        value: `${bowser.os.name} ${bowser.os.version}`,
      },
    ];
  },
};
</script>
