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
import graph from "../assets/graph";
import positions from "../assets/final_graph_nodes_positions";

let prevModulesForCurrentModule = [];

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
  computed: {
    nodeColor() {
      return {
        background: "#bbe1fa",
        border: "#3282b8",
        hover: {
          background: "#a5d2eb",
          border: "#305e92"
        },
        highlight: {
          background: "#bff3fa",
          border: "#4099b8"
        }
      }
    },
    nodeOptions() {
      return {
        physics: false,
        shape: "box",
        widthConstraint: 300,
        heightConstraint: 50,
        color: this.nodeColor,
        font: {
          size: 30
        }
      }
    },
    edgeOptions() {
      return {
        arrows: "to"
      }
    }
  },
  created() {

  },
  mounted() {
    this.initVis();
    // console.log(this.network);
    // console.log(prevModulesForCurrentModule);
    // this.getPrevModule("108");
    // console.log(prevModulesForCurrentModule);
    // this.network.selectNodes(prevModulesForCurrentModule);
    // this.changeColorsOfSelectedNodes();

    this.network.on("click", params => {
      if (params.nodes.length > 0) {
        console.log(params.nodes[0]);
        this.getAllPrevModules(params.nodes[0]);
      }
    });
  },
  methods: {
    changeColorsOfSelectedNodes(){
      for (let index = 0; index < prevModulesForCurrentModule.length; index++){
        var clickedNode = this.network.get(prevModulesForCurrentModule[index]);
        clickedNode.color = {
          border: '#000000',
          background: '#000000',
          highlight: {
            border: '#2B7CE9',
            background: '#D2E5FF'
          }
        }
        this.network.update(clickedNode);
      }
    },
    getAllPrevModules(id){
        prevModulesForCurrentModule = [];
        this.getPrevModule(id);
        this.network.selectNodes(prevModulesForCurrentModule);

    },
    getPrevModule(id){
      prevModulesForCurrentModule.push(id);
      // console.log('id: ' + id);
      let prevModules = this.network.getConnectedNodes(id, 'from');
      // console.log(prevModules);

      if(prevModules.length){
        for (let index = 0; index < prevModules.length; index++) { 
          this.getPrevModule(prevModules[index]); 
        }
      }
      else{
        return;
      }
    },
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
    getScale() {
      // TODO: Set dynmaically based on screen size
      return 0.3
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
        interaction: {
          hover: true
        }
      };

      this.network = new vis.Network(container, data, options);
      // this.network.on("click", function(params) {
      //   if (params.edges.length > 0) {
      //     console.log(params.nodes[0]);
      //     this.getPrevModule("103");
      //   }
      // });
      this.network.moveTo({
        scale: this.getScale(),
        position: {
          x: 650,
          y: 300
        }
      })
    },
    getVisData() {
      const nodes = graph.data.nodes.map(node => ({
        ...node,
        ...this.nodeOptions
      }));

      const edges = graph.data.edges.map(edge => ({
        ...edge,
        ...this.edgeOptions
      }))

      return {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
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
