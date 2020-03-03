<template>
  <div style="display:flex" class="full-height">
     <v-navigation-drawer
          permanent
          expand-on-hover
          style="position: absolute;"
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
  <div>
    <input style="color: white; border: 2px solid white;" type="text" v-model="question" @input="searchModulesForMatch()" @focus="onInputFocused()" @blur="onInputBlurred()">
        <!-- <input style="color: white; border: 2px solid white;"  type="text" v-model="question" @change="searchModulesForMatch()"> -->
    <button v-on:click="saveGraph()">Save</button>
    <span class="full-height" ref="vis">
      <!--<img src="../assets/logo.png">-->
      <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    </span>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import * as vis from 'vis-network';
import graph from '../assets/graph';

const prevModulesForCurrentModule = [];

export default {
  name: 'Home',
  components: {
    //    HelloWorld,
  },
  data() {
    
    return {
      network: null,
      edges: new Map(),
      question: '',
      inputFocused: false
    };
  },
  // watch: {
  //   // whenever question changes, this function will run
    // question: function (searchText) {
    //   this.searchModulesForMatch(searchText);
    // }
  // },
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
        color: {
          color: this.nodeColor.hover.background,
          highlight: this.nodeColor.highlight.border,
        },
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
      this.network.on('deselectNode', (params) => {
        if(this.inputFocused){
          this.network.setSelection(params.previousSelection);
        }else{
          console.log('skipping');
        }
      });
      this.network.on('click', (params) => {
        if (params.nodes.length) {
          this.selectAllChildren(params.nodes[0]);
        }
      });
    },
    onInputFocused(){
      this.inputFocused = true;
      this.setSelectOnClickHandler();
    },
    onInputBlurred(){
      setTimeout(()=>{
        this.inputFocused = false;
      },200);
    },
    selectAllChildren(node) {
      const visited = {
        nodes: new Set(),
        edges: new Set(),
      };
      const stack = [node];

      while (stack.length) {
        const current = stack.pop();
        visited.nodes.add(current);

        this.network.getConnectedNodes(current, 'from').forEach((child) => {
          stack.push(child);
        });

        this.network.getConnectedEdges(current).forEach((edgeId) => {
          const edge = this.edges.get(edgeId);
          if (edge.to === current) {
            visited.edges.add(edgeId);
          }
        });
      }

      this.network.setSelection({
        nodes: Array.from(visited.nodes),
        edges: Array.from(visited.edges),
      });
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
          selectConnectedEdges: false,
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

      const edges = [];
      graph.data.edges.forEach((edge_, i) => {
        const id = `e_${String(i + 1).padStart(3, '0')}`;
        const edge = {
          id,
          ...edge_,
          ...this.edgeOptions,
        };

        edges.push(edge);
        this.edges.set(id, edge);
      });

      return {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges),
      };
    },
    searchModulesForMatch(){
      const vm = this;
      let matchingModules = [];
      graph.data.nodes.forEach(item => {
        if(vm.question && item.label.toLowerCase().includes(vm.question.toLowerCase())){
          matchingModules.push(item.id);
        }
      });
      vm.network.selectNodes(matchingModules, false);
    },
  },
};
</script>


<style scoped lang="less">
.full-height {
  height: 100%;
  position: relative;
}

.items{
  display: flex;

}

.myitem{
  display: flex;
}
</style>
