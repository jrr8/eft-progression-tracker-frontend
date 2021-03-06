<template>
  <v-app >
     <v-dialog
      v-model="dialog"
      max-width="450"
      persistent
    >
      <v-card>
        <v-card-title class="headline">Allow Google Analytics?</v-card-title>

        <v-card-text>
          By Agreeing, you will enable Google Analytics to monitor traffic on Tarkov Assistant. 
          All data collected is anonymous and is only seen and used by the developers of Tarkov Assistant, and will not be distributed in any way.
          This data is used to better understand which pages and features of the site users visit most to better improve Tarkov Assistant.
          You can enable or disable Google Analytics at any time through the About page.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="toggleDataTracking(true)"
          >
            Agree
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="toggleDataTracking(false)"
          >
            Disagree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="dataAnalyticsAlert"
      color='green'
    >
      {{ dataAnalyticsAlertText }}
      <v-btn
        color="Green"
        text
        @click="dataAnalyticsAlert = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  <div class="page-nav-drawer-icon">
    <img class="nav-drawer-icon" @click.stop="toggleIsNavDrawerActive()" src="./assets/nav-drawer-icon.png" height="35" width="35">
    <h1 class="neon">Tarkov Assistant</h1>
  </div>
    <v-navigation-drawer app
      src="./assets/nav-drawer-background.jpg"
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
        <v-list-item :to="{ name: 'Home' }" :class="[classForRoute('Home'), 'nav-item']" link>
          <v-list-item-title class="col-white" color:white router >Hideout Progression Tree</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'HideoutItemList' }" :class="[classForRoute('HideoutItemList'), 'nav-item']" link>
          <v-list-item-title class="col-white" >Item List</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'Help' }" :class="[classForRoute('Help'), 'nav-item']" link>
          <v-list-item-title class="col-white" >Help</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: 'About' }" :class="[classForRoute('About'), 'nav-item']" link>
          <v-list-item-title class="col-white" >About</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-container fluid id="p0px" >
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import * as vis from 'vis-network';
import graph from './assets/graph';
import graphService from './store/graphService';

export default {
  name: 'App',
  data() {
    return {
      dialog: false,
      dataAnalyticsAlertText: '',
      dataAnalyticsAlert: false
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isNavDrawerActive: {
      get() {
        return this.$store.state.isNavDrawerActive;
      },
      set(isActive) {
        this.$store.commit('setNavDrawerIsActive', { isNavDrawerActive: isActive });
      },
    },
  },

  created() {
    this.$store.dispatch('fetchUser').then((returnedUser) => {
      if (returnedUser.allowDataCollection === null || returnedUser.allowDataCollection === undefined)
        this.dialog = true;
    });
    this.$vuetify.theme.dark = true;

    graphService.initVis();
  },
  methods: {
    navToHome() {
      this.$router.push('/');
    },
    toggleIsNavDrawerActive() {
      this.$ga.event('navDrawer', 'clicked', 'toggleNavDrawer', 1);
      this.$store.commit('setNavDrawerIsActive', { isNavDrawerActive: !this.isNavDrawerActive });
    },
    classForRoute(routeName) {
      return this.$route.name === routeName ? 'page-active' : 'page-inactive';
    },
    toggleDataTracking(enabled) {
      this.$store.dispatch('updateDataTrackingPermission', { isEnabled: enabled }).then(() => {
        this.dialog = false;
        this.dataAnalyticsAlert = true;
        if(enabled){
          this.$ga.enable();
          this.dataAnalyticsAlertText = 'Google Analytics Enabled';

        } else {
          this.$ga.disable();
          this.dataAnalyticsAlertText = 'Google Analytics Disabled';
        }
      });
    }
  },
};
</script>

<style lang="less">
@background-image: url(./assets/escape-from-tarkov-logo-for-background.jpg);

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

.page-active {
  background: #3a0f0f;
  opacity: 1;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  color: white;
}

.page-inactive {
  background: #3a0f0f;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  opacity: 0.4;
  color: white;
}

.black-text {
  color: white;
}

.theme--dark.page-active.nav-item {
  &::before{
    opacity: 0;
  }
  &:hover::before{
    opacity: .1;
  }
}

.bkg-img {
  position: relative;

  &::before {
    @opaque: #ffffff0e;

    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(@opaque, @opaque), @background-image;
    background-position-x: center;
    background-size: cover;
    filter: blur(2px);
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
    0 0 5px rgb(133, 133, 133),
    0 0 10px rgb(133, 133, 133),
    0 0 20px rgb(133, 133, 133),
    0 0 40px #3a0f0f,
    0 0 80px #3a0f0f,
    0 0 90px #3a0f0f,
    0 0 100px #3a0f0f,
    0 0 150px #3a0f0f;
    font-size: 24px;
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
  display: flex;
  flex-direction: row;
}

.txt-white {
  color: white;
}

#p0px {
  padding: 0px;
}

.back {
  background-image: @background-image;
  background-size: cover;
}

.col-white {
  color: white;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #3a0f0f;
  border-radius: 10px;
  opacity: .5;
}

::-webkit-scrollbar-thumb:hover {
  background: #290b0b;
  opacity: 1;
}
</style>
