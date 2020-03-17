<template>
  <v-app >
    <v-navigation-drawer app
            permanent
            expand-on-hover
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
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-folder</v-icon>
                </v-list-item-icon>
                <v-list-item-title>My Files</v-list-item-title>
              </v-list-item>
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Shared with me</v-list-item-title>
              </v-list-item>
              <v-list-item link>
                <v-list-item-icon>
                  <v-icon>mdi-star</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Starred</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
    <v-content>

    <!-- Provides the application the proper gutter -->
    <v-container fluid fill-height>

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
  }),

  computed: {
    user() {
      return this.$store.state.user;
    },
  },

  created() {
    this.$store.dispatch("fetchUser").then(() => {
      console.log(this.user);
    });
  },
  methods: {
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
  height: 100%;
  background: #1b262c;
}

.container.container--fluid.fill-height > * {
  width: 100%;
  height: 100%;
}
</style>
