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
