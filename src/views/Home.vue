<template>
  <div class="full-height">
    <button v-on:click="saveGraph()">Save</button>
    <div class="full-height" ref="vis">
      <!--<img src="../assets/logo.png">-->
      <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue';
import * as vis from "vis-network";
import mockGraph from "../assets/graph";
import mockCytoGraph from "../assets/graph.cytoscape";
import positions from "../assets/final_graph_nodes_positions";

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
    saveGraph() {
      this.download(
        JSON.stringify(this.network.getPositions()),
        "graph.json",
        "application/json"
      )
    },
    download(content, fileName, contentType) {
      let a = document.createElement("a");
      let file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    },
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
//        layout: {
//          hierarchical: {
//            direction: "RL"
//          }
//        }
      };

      this.network = new vis.Network(container, data, options);
      this.network.moveTo({
        scale: 0.3,
        position: {
          x: 650,
          y: 300
        }
      })
    },
    getVisData() {
      const nodes = mockCytoGraph.elements.nodes.map(node => {
        return {
          label: node.data.name,
          id: node.data.id,
          x: 1.1 * positions[node.data.id].x,
          y: positions[node.data.id].y,
          physics: false,
          shape: "box",
          widthConstraint: 300,
          heightConstraint: 50,
          font: {
            size: 30
          }
        }
      });

      const edges = mockCytoGraph.elements.edges.map(edge => {
        return {
          from: edge.data.source,
          to: edge.data.target,
          arrows: "to"
        }
      });

      return {
        nodes: new vis.DataSet(nodes),
//          new vis.DataSet(
//          mockGraph.vertices.map(vertex => {
//            if (vertex.level === undefined) {
//              vertex.level = 5;
//            }
//
//            return {
//              label: vertex.name,
//              id: vertex.name,
//              level: vertex.level
//            }
//          })
        edges: new vis.DataSet(edges)
//        new vis.DataSet(
//          mockGraph.edges.map(edge => ({ from: edge.source, to: edge.target }))
//        )
      }
    }
  }
};
</script>


<style scoped lang="less">
.full-height {
  height: 100%;
}
</style>
