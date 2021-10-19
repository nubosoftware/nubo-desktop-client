<template>
  <v-app id="inspire" color="bg" >
    <v-main >
      <!--  -->
      <router-view @updatePage="updatePage" ></router-view>
    </v-main>
    <floating-menu></floating-menu>
  </v-app>
</template>
<style scoped>

</style>

<script>
import appData from "./modules/appData";
//import appUtils from "./modules/appUtils";
import FloatingMenu from "./components/FloatingMenu.vue"


export default {
  data: () => ({
    drawer: true,
    moduleName: "Nubo Desktop Client",
    menuItems: [],
    appData,
  }),
  components: {
    FloatingMenu
  },
  methods: {
    updatePage: function () {
      
    },
  
    //checkLoginLoop: function(prevLoginToken){
      //console.log("checkLoginLoop: "+prevLoginToken);
      //let thisPage = this;
      /*
      setTimeout(function(){
      
        if (appData.adminLoginToken && appData.adminLoginToken != "" && appData.adminLoginToken == prevLoginToken) {
          appUtils
            .get({
              url: "api/validateLogin",
            })
            .then((response) => {
              
              if (response.data.status == 1) {
                //console.log("Login is valid...");
                thisPage.checkLoginLoop(prevLoginToken);
              } else {
                console.log("Login Error");
                console.log(response.data);
                appData.adminLoginToken = "";
                appData.isAuthenticated = false;
                thisPage.$router.push("/Login");
              }
            }).catch((error) => {
              console.log("Login Error");
              console.log(error);
              appData.adminLoginToken = "";
              appData.isAuthenticated = false;
              thisPage.$router.push("/Login");
            })
        }
      },10000);*/
    //},
    

  },
  created: function () {
    console.log(`this.appData.isAuthenticated: ${this.appData.isAuthenticated}`);
    /*
    if (appData.adminLoginToken && appData.adminLoginToken != "" && appData.isAuthenticated) {
      this.checkLoginLoop(appData.adminLoginToken);
    }*/
  },
};
</script>
