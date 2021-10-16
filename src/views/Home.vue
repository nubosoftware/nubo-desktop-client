<template>
  <v-card color="bg">
    <v-card-title>
      {{ $t("Dashboard") }}
    </v-card-title>
    <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" sm="7" md="4">
                  <v-card color="bg">
                    <v-card-title>{{$t("Users")}}</v-card-title>
                    <v-card-subtitle>{{dashboard.onlineUsers}} {{$t("users are online")}}</v-card-subtitle>
                    <pie-chart :chart-data="onlineUsers"></pie-chart>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="7" md="4" v-if="appData.checkPermission('@/','r')" >
                  <v-card color="bg">
                    <v-card-title>{{$t("Platforms")}}</v-card-title>
                    <v-card-subtitle>{{dashboard.runningPlatforms}} {{$t("platforms are up")}}</v-card-subtitle>
                    <pie-chart :chart-data="platforms"></pie-chart>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="7" md="4">
                  <v-card color="bg">
                    <v-card-title>{{$t("Devices")}}</v-card-title>
                    <v-card-subtitle>{{dashboard.onlineDevices}} {{$t("devices are online")}}</v-card-subtitle>
                    <pie-chart :chart-data="onlineDevices"></pie-chart>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="7" md="4" v-if="appData.checkPermission('@/','r')" >
                  <v-card color="bg">
                    <v-card-title>{{$t("Storage")}}</v-card-title>
                    <v-card-subtitle>{{$t("Using")}} {{dashboard.totalUsedSpaceMB / 1000}} GB out of {{dashboard.totalSpaceMB}} GB</v-card-subtitle>
                    <pie-chart :chart-data="storage"></pie-chart>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="7" md="4">
                  <v-card color="bg">
                    <v-card-title>{{$t("Device Types")}}</v-card-title>
                    <pie-chart :chart-data="deviceTypes"></pie-chart>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="7" md="4">
                  <v-card color="bg">
                    <v-card-title>{{$t("Sessions")}}</v-card-title>
                    <v-card-subtitle>{{$t("Online sessions over time")}}</v-card-subtitle>
                    <line-chart :chart-data="lastSessions" :options="lastSessionsOptions" ></line-chart>
                  </v-card>
                </v-col>
              </v-row>
              
            </v-container>
          </v-form>
        <v-snackbar v-model="snackbarSave" :timeout="2000">
          {{ snackbarText }}

          <template v-slot:action="{ attrs }">
            <v-btn color="info" text v-bind="attrs" @click="snackbarSave = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
  </v-card>
</template>

<script>
import appData from "../modules/appData";
//import appUtils from "../modules/appUtils";

//const moment = require("moment");

export default {
  name: 'Home',
  components: {
     
    },
  data: () => ({
    dashboard: {},
    datacollection: null,
    snackbarSave: false,
    snackbarText: "",
    lastSessionsOptions: {},
    onlineUsers: {},
    platforms: {},
    onlineDevices: {},
    storage: {},
    deviceTypes: {},
    lastSessions: {},
    appData
  }),
  methods: {
    fillData () {
      
      
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    refresh: function() {
      /*appUtils
        .get({
          url: "api/dashboard"
        })
        .then(response => {
          //console.log(response.data);
          if (response.data.status == 1) {
            console.log(`status: ${response.data.status}`);
            this.dashboard = response.data;
            this.fillData ();
            
          } else {
            console.log(`status: ${response.data.status}`);
            this.$router.push("/Login");
          }
        })
        .catch(error => {
          console.log(error);
          this.$router.push("/Login");
        });*/
    },
  },
  created: function() {
    
    this.refresh();
  }
}
</script>
