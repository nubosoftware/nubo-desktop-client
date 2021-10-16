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
  }
  </style>

<script>

import appData from '../modules/appData';
import appUtils from '../modules/appUtils';
import GuacClient from '../modules/guacClient.js';

let page = {
  name: 'Client',
  dialog: false,
  loaddingText: "",
  guac: null,
  data: () => ({ 
    langs: ['iw', 'en'],
    appData
  }),
  created: function () {
    if (!appData.authComplete) {
      this.$router.push("/Splash");
      return;
    }
    this.dialog = true;
    this.loaddingText = this.$t("Starting session...");
    //
    let params = {
        loginToken: appData.loginToken,
      };
      appUtils
        .get({
          url: "startsession",
          params,
        })
        .then((response) => {
          console.log(response.data);

          if (response.data.status == 1) {
            this.loaddingText = this.$t("Loading desktop...");
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
            //let guac = 
            this.guac = new GuacClient(display,x,y,sessID,"ws://localhost/guacWebSocket");
            
            this.guac.onstatechange = (state) => {
              console.log(`this.guac.onstatechange: ${state}`);
              if (state == 3) {
                this.dialog = false;
                this.$forceUpdate();
              }
            };
          } else  {
            console.log("Error");
            this.dialog = false;
            alert(response.data.message);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
  },
  methods: {

  }
}

export default page;
</script>
