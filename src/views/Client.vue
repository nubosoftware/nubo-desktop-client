<template>
  <div id="display" class='overlay'>
    <v-dialog
      v-model="dialog"
      hide-overlay
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{loaddingText}}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="msgDialog"
      hide-overlay
      width="500"
    >
    <v-card>
    <v-alert :type="alertType"
    border="bottom"
      colored-border
      elevation="2"
      dismissible
      v-model="alert"
    >
          {{ messageText }}
    </v-alert>
    </v-card>
    </v-dialog>
  </div>
  
</template>

<style>
  .overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(51,51,51,0.7);
    z-index: 10;
    overflow: hidden; /* Hide scrollbars */
  }
  body, html {
    overflow: hidden; /* Hide scrollbars */
    overflow-y: hidden;
  }
  /* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge add Firefox */
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none; /* Firefox */
}
  </style>

<script>

import appData from '../modules/appData';
import appUtils from '../modules/appUtils';
import GuacClient from '../modules/guacClient.js';

let page = {
  name: 'Client',
  
  data: () => ({ 
    langs: ['iw', 'en'],
    msgDialog: false,
    messageText: "",
    alertType: "info",
    dialog: false,
    loaddingText: "",
    guac: null,
    alert: true,
    appData
  }),
  created: function () {
    if (!appData.authComplete) {
      this.$router.push("/Splash");
      return;
    }
    this.dialog = true;
    this.loaddingText = this.$t("Starting session...");
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let params = {
        loginToken: appData.loginToken,
        timeZone,
      };
      appUtils
        .get({
          url: "startsession",
          params,
        })
        .then((response) => {
          console.log(response.data);

          if (response.data.status == 1) {
            this.loaddingText = this.$t("Loading your remote desktop...");
            this.dialog = true;
            this.$forceUpdate();
            console.log("Session started!");
            let sessID = response.data.sessionid;
            var win = window,
            doc = document,
            docElem = doc.documentElement,
            body = doc.getElementsByTagName('body')[0],
            x = win.innerWidth || docElem.clientWidth || body.clientWidth,
            y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;

            console.log("x: "+x+", y: "+y);

            


            // Get display div from document
            var display = document.getElementById("display");

            const protocol = (location.protocol == "http:" ? "ws:" : "wss:");
            //const port = (location.port != "" ? `:${location.port}` : "");
            let wsURL;
            if (appData.production) {
              wsURL = `${protocol}//${location.host}/guacWebSocket`;
            } else {
              wsURL = "wss://il2.nubosoftware.com/guacWebSocket";
            }
           
            console.log(`wsURL: ${wsURL}, location.host: ${location.host}`);
            this.guac = new GuacClient(display,x,y,sessID,wsURL);
            
            this.guac.onstatechange = (state) => {
              console.log(`this.guac.onstatechange: ${state}`);
              if (state == 3) {
                this.dialog = false;
                this.$forceUpdate();
              } else if (state == 5) {
                this.dialog = false;
                this.msgDialog = true;
                this.messageText = this.$t("Remote desktop disconnected");
                this.alertType = "warning";
              }
            };

            this.guac.onerror = (error) => {
              console.log(`this.guac.onerror: ${error}`);
              this.dialog = false;
              this.msgDialog = true;
              this.messageText = this.$t("Remote desktop error",{msg: `${error}`});
              this.alertType = "warning";
            };

            const reportWindowSize = () => {
              let nx = win.innerWidth || docElem.clientWidth || body.clientWidth;
              let ny = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
              if (nx != x || ny != y) {
                console.log(`Resize event. x: ${nx}, y: ${ny}`);
                x = nx;
                y = ny;
                this.guac.reportWindowSize(x,y);
              }
              
            }
            window.addEventListener('resize', reportWindowSize);
          } else  {
            console.log("Error");
            this.dialog = false;
            //alert(response.data.message);
            this.msgDialog = true;
            this.messageText = this.$t("Start session error",{msg: response.data.message, code: response.data.status});
            this.alertType = "warning";

          }
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
  },
  methods: {

  },
  watch:{
    msgDialog:function(newValue, old){
      if(!newValue && old){
        // Closing
        this.$router.push("/Splash");
      }
    },
    alert: function(newValue, old){
      if(!newValue && old){
        this.msgDialog = false;
      }
    },
  },
  /*eslint no-unused-vars: ["error", {"args": "after-used"}]*/
  beforeRouteLeave (to, from, next) { 
    console.log(`Client beforeRouteLeave.`);
    if (this.guac) {
      this.guac.end();
    }
    next();
   }
}

export default page;
</script>
