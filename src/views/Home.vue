<template>
  <div class="home" ref="vis">
    <!--<img src="../assets/logo.png">-->
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue';
import * as vis from "vis-network";
import mockGraph from "../assets/graph";

export default {
  name: 'Home',
  components: {
//    HelloWorld,
  },
  data() {
    return {
      network: null
    }
  },
  created() {

  },
  mounted() {
    this.initVis();
  },
  methods: {
    initVis() {
      const container = this.$refs.vis;
      const data = this.getVisData();
      const options = {
        edges: {
          smooth: {
            type: "cubicBezier",
            forceDirection: "horizontal",
            roundness: 1
          }
        },
        layout: {
          hierarchical: {
            direction: "RL"
          }
        }
      };

      this.network = new vis.Network(container, data, options);
    },
    getVisData() {
      return {
        nodes: new vis.DataSet(
          mockGraph.vertices.map(vertex => ({ label: vertex.name, id: vertex.name }))
        ),
        edges: new vis.DataSet(
          mockGraph.edges.map(edge => ({ from: edge.source, to: edge.target }))
        )
      }
    }
  }
};
</script>


<style scoped lang="less">
  .home {
    width: 100%;
    height: 600px;
  }
</style>
