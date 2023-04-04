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
                {{ $t("Workspace Hub") }}
              </v-banner>
            </div>
             <div class="d-flex justify-center mb-6 text-subtitle-1">
              {{ $t("Select workspace:") }}
            </div>
            <!--
            <v-card
              class="mx-auto"
              max-width="300"
            > -->
            <v-data-table
              color="bg"        
                :headers="headers"
                :items="items"      
                items-per-page="10000"          
                sort-by="title"
                
                :hide-default-footer="true"
                @click:row="clickItem"
                class="ma-4 bg"
              >
              <template v-slot:[`item.title`]="{ item }">
                <v-icon v-text="item.icon"></v-icon> 
                &nbsp;&nbsp;{{ item.title}}                  
              </template>
              <template v-slot:[`item.status`]="{ item }">
              <v-chip
                v-if="item.session || item.isOnline === true"
                class="ma-2"
                color="success"
                text-color="white"
              >
                {{$t("Online")}}
              </v-chip>
              <v-chip
                v-if="item.isOnline === false"
                class="ma-2"
                color="warning"
                text-color="white"
              >
                {{$t("Offline")}}
              </v-chip>             
            </template>
              <!--
              <template v-slot:[`item.icon`]="{ item }">
                <v-icon v-text="item.icon"></v-icon>                     
              </template>-->
            </v-data-table>
            <!--
            <v-list dense nav >
              <v-list-item
                v-for="item in items"
                :key="item.value"
                @click="clickItem(item)"
              >                  
                  <v-list-item-icon>                
                  <v-icon >{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>-->
            <!-- </v-card> -->
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
// import LoginController from "../modules/loginController";
// import VueQrcode from "vue-qrcode";
// //var base32 = require('base32');
// var base32 = require("thirty-two");
//import HelloWorld from "../components/HelloWorld.vue";
//import FloatingMenu from "../components/FloatingMenu.vue"

export default {
  name: "WorkspaceMenu",
  components: {    
    //FloatingMenu
  },
  data: () => ({
    resetOTP: false,
    messageText: "",
    msgType: "info",
    alertText: "",
    alertType: "error",
    valid: false,
    session: null,
    items: [{
      title: "Test",
      value : 1
    }],
    headers: [],
    appData,
  }),
  methods: {

    clickItem: async function (item) {
      console.log("clickItem:",item);
      if (item.isOnline === false) {
        return;
      }
      appData.workspaceItemCache = item;
      if (this.session && !item.session) {
        // To start the Remote Desktop session, the current running session will be canceled.       
        const response = await appUtils.post({
          url: "client/session/logout",
          params: {
            doNotRemoveLoginToken: true,
          },
        });
        console.log("session.logout: ",response.data);
      }
      this.$router.push(`${item.link}/${item.value}/${item.target}`);
    },
    
    reload: async function () {
      try {
        let params = {};
        const response = await appUtils.post({
          url: "client/session/list",
          params,
        });
        console.log(response.data);

        // Session is currently running...

        // To start the Remote Desktop session, the current running session will be canceled.
        // Do you want to continue?
        // Yes / No



        if (response.data.status == 1) {
          this.items = response.data.sessionTypes;
          this.session = response.data.session;
          for (const item of this.items) {
            if (!item.link) {
              item.link = "/Client";
            }
            if (!item.icon) {
              item.icon = "mdi-monitor-cellphone";
            }
          }

          console.log(this.items);
        } else {
          this.items = [];
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {},
  created: function () {
    this.headers = [      
      { text: this.$t("Worskspace"), value: "title" },   
      { text: this.$t("Status"), value: "status"}
    ];
    this.reload();
    
    //this.$emit("updatePage", "Login");
  },
  mounted: function () {
    
    //this.$refs["form"].$refs.form.setAttribute("autocomplete", "false");
  },
};
</script>