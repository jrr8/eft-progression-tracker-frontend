<template>
  <v-app >
    <v-navigation-drawer app
            permanent
            expand-on-hover
            src="https://www.jbklutse.com/wp-content/uploads/2019/03/Escape-from-Tarkov.jpg"
          >
            <v-list>
              <v-list-item class="px-2">
                <v-list-item-avatar>
                  <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
                </v-list-item-avatar>
              </v-list-item>

              <v-list-item link>
                <v-list-item-content>
                  <v-list-item-title class="title">Sandra Adams</v-list-item-title>
                  <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

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
    }
  },

  created() {
    this.$store.dispatch("fetchUser").then(() => {
      console.log(this.user);
    });
  },
  methods: {
    navToHome(){
      console.log("nav to home clicked");
      this.$router.push('/');
    }
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

.container.container--fluid {
  height: 100%;

  > * {
    height: 100%;
  }
}

.active {
  background: #3a0f0f;
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
</style>
