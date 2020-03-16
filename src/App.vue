<template>
  <v-app id="app">
    <!-- <v-navigation-drawer
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
          </v-navigation-drawer> -->
    <router-view/>
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
    nodeColor() {
      return {
        background: '#bbe1fa',
        border: '#3282b8',
        hover: {
          background: '#a5d2eb',
          border: '#305e92',
        },
        highlight: {
          background: '#fa322f',
          border: '#2eb81e',
        },
      };
    },
    nodeOptions() {
      return {
        physics: false,
        shape: 'box',
        widthConstraint: 300,
        heightConstraint: 50,
        color: this.nodeColor,
        font: {
          size: 30,
        },
      };
    },
    completedNodeColor(){
      return {
        border: '#000000',
        background: '#000000',
        hover: {
          background: '#a5d2eb',
          border: '#305e92',
        },
        highlight: {
          background: '#fa322f',
          border: '#2eb81e',
        },
      };
    },
    edgeOptions() {
      return {
        arrows: 'to',
        color: {
          color: this.nodeColor.hover.background,
          highlight: this.nodeColor.highlight.border,
        },
      };
    },
  },

  created() {
    this.$store.dispatch("fetchUser").then(() => {
      console.log(this.user);
    });
    this.getVisData();
  },
  methods: {
    getVisData() {
      const nodes = graph.data.nodes.map((node) => ({
        ...node,
        ...this.nodeOptions,
      }));

      const edges = [];
      graph.data.edges.forEach((edge_, i) => {
        const id = `e_${String(i + 1).padStart(3, '0')}`;
        const edge = {
          id,
          ...edge_,
          ...this.edgeOptions,
        };

        edges.push(edge);
      });

      this.nodeSet = new vis.DataSet(nodes);
      this.edgeSet = new vis.DataSet(edges);

      this.$store.commit('setVisData', {nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges)})

      // return {
      //   nodes: new vis.DataSet(nodes),
      //   edges: new vis.DataSet(edges),
      // };
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
  height: 100%;
  background: #1b262c;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
