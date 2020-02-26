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
// import HelloWorld from '@/components/HelloWorld.vue';
import * as vis from 'vis-network';
import graph from '../assets/graph';

let prevModulesForCurrentModule = [];

export default {
  name: 'Home',
  components: {
    //    HelloWorld,
  },
  data() {
    return {
      network: null,
    };
  },
  computed: {
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
    edgeOptions() {
      return {
        arrows: 'to',
      };
    },
  },
  created() {

  },
  mounted() {
    this.initVis();
    this.setSelectOnClickHandler();
  },
  methods: {
    setSelectOnClickHandler() {
      this.network.on('click', (params) => {
        if (params.nodes.length) {
          this.selectAllChildren(params.nodes[0]);
        }
      });
    },
    selectAllChildren(node) {
      const visited = new Set();
      const stack = [node];

      while (stack.length) {
        const current = stack.pop();
        visited.add(current);

        this.network.getConnectedNodes(current, 'from').forEach((child) => {
          stack.push(child);
        });
      }

      this.network.selectNodes(Array.from(visited));
    },
    saveGraph() {
      this.download(
        JSON.stringify(this.network.getPositions()),
        'graph.json',
        'application/json',
      );
    },
    download(content, fileName, contentType) {
      const a = document.createElement('a');
      const file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    },
    getScale() {
      // TODO: Set dynmaically based on screen size
      return 0.3;
    },
    initVis() {
      const container = this.$refs.vis;
      const data = this.getVisData();
      const options = {
        edges: {
          smooth: {
            type: 'cubicBezier',
            forceDirection: 'horizontal',
            roundness: 1,
          },
        },
        interaction: {
          hover: true,
        },
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
          y: 300,
        },
      });
    },
    getVisData() {
      const nodes = graph.data.nodes.map((node) => ({
        ...node,
        ...this.nodeOptions,
      }));

      const edges = graph.data.edges.map((edge) => ({
        ...edge,
        ...this.edgeOptions,
      }));

      return {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges),
      };
    },
  },
};
</script>


<style scoped lang="less">
.full-height {
  height: 100%;
}
</style>
