<template>
  <v-app >
    <img class="page-nav-drawer-icon" @click.stop="toggleIsNavDrawerActive()" src="./assets/nav-drawer-icon.png" height="35" width="35">
    <v-navigation-drawer app
            src="https://www.jbklutse.com/wp-content/uploads/2019/03/Escape-from-Tarkov.jpg"
            v-model="isNavDrawerActive"
            temporary
          >

            <div class="nav-bar-header">
              <img class="nav-drawer-icon" @click.stop="toggleIsNavDrawerActive()" src="./assets/nav-drawer-icon.png" height="35" width="35">
              <h1 class="neon">Tarkov Assistant</h1>
            </div>

            <v-divider></v-divider>

            <v-list
              nav
              dense
            >
              <v-list-item :to="'/'" :class="[computedPage == '/' ? activeClass : 'inactive', 'nav-item']" link>
                <!-- <v-list-item-icon>
                  <v-icon>fas fa-list</v-icon>
                </v-list-item-icon> -->
                <v-list-item-title style="color: white;" color:white router >Home</v-list-item-title>
              </v-list-item>
              <v-list-item :to="'hideoutItemList'" :class="[computedPage.includes('hideoutItemList') ? activeClass : 'inactive', 'nav-item']" link>
                <!-- <v-list-item-icon>
                  <v-icon>fas fa-list</v-icon>
                </v-list-item-icon> -->
                <v-list-item-title style="color: white;">Item List</v-list-item-title>
              </v-list-item>
              <v-list-item :to="'home'" :class="[computedPage.includes('home') ? activeClass : 'inactive', 'nav-item']" link>
                <!-- <v-list-item-icon>
                  <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-icon> -->
                <v-list-item-title style="color: white;">Hideout Module Graph</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
    <v-content>

    <!-- Provides the application the proper gutter -->
    <v-container fluid style="padding: 0px;">

      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>

    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import graph from './assets/graph';
import * as vis from 'vis-network';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    activeClass: 'active'
  }),

  computed: {
    user() {
      return this.$store.state.user;
    },
    computedPage(){
      console.log(this.$route.path);
      return this.$route.path;
    },
    isNavDrawerActive: {
      get: function(){
        return this.$store.state.isNavDrawerActive;
      },
      set: function(isActive){
        console.log(isActive);
        this.$store.commit('setNavDrawerIsActive', {isNavDrawerActive: isActive});
      }
    },
  },

  created() {
    this.$store.dispatch("fetchUser").then(() => {
      console.log(this.user);
    });
    this.$vuetify.theme.dark = true;
  },
  methods: {
    navToHome(){
      console.log("nav to home clicked");
      this.$router.push('/');
    },
    toggleIsNavDrawerActive(){
      console.log("here");
      this.$store.commit('setNavDrawerIsActive', {isNavDrawerActive: !this.isNavDrawerActive});
    },
  }
};
</script>

<style lang="less">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #1b262c;
}

.no-focus {
  &:focus {
    outline: none;
  }

  *:focus {
    outline: none;
  }
}

.viewport-height {
  height: 100vh;
}

.active {
  background: #3a0f0f;
  opacity: 1;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  color: white;
}

.inactive {
  background: #3a0f0f;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  opacity: 0.4;
  color: white;
}

.black-text {
  color: white;
}

.theme--dark.active.nav-item {
  &::before{
    opacity: 0;
  }
  &:hover::before{
    opacity: .1;
  }
}

.nav-bar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75px;
}

.neon {
  color: #fff;
  text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #fff,
    0 0 40px #3a0f0f,
    0 0 80px #3a0f0f,
    0 0 90px #3a0f0f,
    0 0 100px #3a0f0f,
    0 0 150px #3a0f0f;
}

.nav-drawer-icon {
  margin-right: 10px;
  cursor: pointer;
}

.nav-drawer-icon:hover {
  background-color: #3a0f0f;
}

.page-nav-drawer-icon {
  position: absolute;
  left: 10px;
  top: 20px;
  cursor: pointer;
  z-index: 1;
}
</style>

