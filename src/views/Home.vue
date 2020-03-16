<template>
  <div class="full-height">
    <div class="container">
      <input style="color: white; border: 2px solid white;" type="text" v-model="question" @input="searchModulesForMatch()" @focus="onInputFocused()" @blur="onInputBlurred()">
      <button v-on:click="saveGraph()">Save</button>
      <v-btn class="ma-2 butn" outlined color="indigo" @click="$router.push('hideoutItemList')" >Item List</v-btn>
      <v-btn class="ma-2 butn" outlined color="indigo" @click="addModuleToTrackedMap()" >Track Selected Module</v-btn>
      <v-checkbox color="red darken-3" :disabled="selectedModuleId == ''" v-model="isModuleCompletedForCheckbox" :label="'Hideout Module Complete'"></v-checkbox>
      <tracked-modules-dialog></tracked-modules-dialog>
    </div>
 
    <span ref="vis">
      <!--<img src="../assets/logo.png">-->
      <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    </span>
  
  </div>
  
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
import * as vis from 'vis-network';
import graph from '../assets/graph';
import trackedModulesDialog from "../components/TrackedModulesDialog"
import graphService from "../store/graphService"


export default {
  name: 'Home',
  components: {
    trackedModulesDialog
  },
  data() {

    return {
      dialog:false,
      network: null,
      edges: new Map(),
      question: '',
      inputFocused: false,
      selectedModule: '',
      selectedModuleId: '',
      trackedModuels: new Map(), //TODO: Remove
      prevModulesForCurrentModule: [],
      nodeSet: new vis.DataSet(),
      edgeSet: new vis.DataSet(),
      isDisabled2: true
      // completedModules: new Map()
    };
  },
  // watch: {
  //   // whenever question changes, this function will run
    // question: function (searchText) {
    //   this.searchModulesForMatch(searchText);
    // }
  // },
  computed: {
    visData(){
      return this.$store.state.visData;
    },
    isDisabled(){
        debugger;
        return this.selectedModuleId == '';
    },
    trackedModules(){
      return this.$store.state.user.trackedModules;
    },
    completedModules(){
      return this.$store.state.user.hideoutModulesCompleted;
    },
    isModuleCompletedForCheckbox: {
      get: function(){
        if(this.selectedModuleId !== '' && this.completedModules)
          return this.completedModules.get(this.selectedModuleId) ? true: false;
        else
          return false;
      },
      set: function(isChecked){
        this.toggleCompletedModule();
      }
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

  },
  mounted() {
    this.getVisData();
    this.initVis();
    this.setSelectOnClickHandler();
    this.highlightCompletedModulesOnInit();
  },
  methods: {
    toggleCompletedModule(){
      debugger;
      if(!this.completedModules.get(this.selectedModuleId)){
        this.$store.dispatch('updateUserCompletedModules', {moduleId: this.selectedModuleId, isCompleted: true}).then(() => {
          this.highlightCompletedModule(this.selectedModuleId, true);
        });
      }else{
        this.$store.dispatch('updateUserCompletedModules', {moduleId: this.selectedModuleId, isCompleted: false});
        this.highlightCompletedModule(this.selectedModuleId, false);
      }
    },
    highlightCompletedModule(id, highlightTrue){ 
        var curNode = this.visData.nodes.get(id);
        if(this.completedModules.get(id)){
          if(highlightTrue){
            curNode.color = this.completedNodeColor;
          }else{
            curNode.color = this.nodeColor;
          }
        }
        this.visData.nodes.update(curNode);
    },
    highlightCompletedModulesOnInit(){
      this.completedModules.forEach((module, moduleId, array) => {
        this.highlightCompletedModule(moduleId, true);
      });
    },
    // Too Slow
    // toggleCompletedModule(){
    //   console.log("start");
    //   if(!this.completedModules.get(this.selectedModuleId))
    //     this.completedModules.set(this.selectedModuleId, true);
    //   else
    //     this.completedModules.delete(this.selectedModuleId);
    //   console.log("middle");
    //   this.highlightCompletedModules();
    //   console.log("end");
    // },
    // highlightCompletedModules(){ 
    //   this.nodeSet.forEach((node)=> {
    //     var clickedNode = node;
    //     if(this.completedModules.get(node.id)){
    //       clickedNode.color = {
    //         border: '#000000',
    //         background: '#000000',
    //         highlight: {
    //           border: '#2B7CE9',
    //           background: '#D2E5FF'
    //         }
    //       }
    //     }else{
    //       clickedNode.color = this.nodeColor;
    //     }
    //       this.nodeSet.update(clickedNode);
    //   });
    // },
    setSelectOnClickHandler() {
      this.network.on('deselectNode', (params) => {
        if(this.inputFocused){
          this.network.setSelection(params.previousSelection);
        }else{
          console.log('skipping');
        }
      });
      this.network.on('click', (params) => {
        debugger;
        if (params.nodes.length) {
          this.selectedModule = this.getModuleNameById(params.nodes[0]);
          this.selectedModuleId = params.nodes[0];
          this.selectAllChildren(params.nodes[0]);
        }else{
          this.selectedModule = '';
          this.selectedModuleId = '';
        }
      });
    },
    onInputFocused(){
      this.inputFocused = true;
      this.searchModulesForMatch();
    },
    onInputBlurred(){
      setTimeout(()=>{
        this.inputFocused = false;
      },200);
    },
    getModuleNameById(id){
      let moduleName = '';
      graph.data.nodes.forEach((module, index, array) => {
        if(module.id == id){
          moduleName = module.label;
        }
      });
      return moduleName;
    },
    addModuleToTrackedMap(){
      if(this.selectedModule != ''){
        // TODO: needed to put into object first, not individual. Investigate this
        this.$store.dispatch('updateUserTrackedModules', {name: this.selectedModule, modules: this.prevModulesForCurrentModule.map((id) => this.getModuleNameById(id))});
      }
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

      this.prevModulesForCurrentModule = Array.from(visited.nodes);

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
      // const data = {
      //   nodes: this.nodeSet,
      //   edges: this.edgeSet};
      const data = this.visData;
      debugger;
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

      this.nodeSet = new vis.DataSet(nodes);
      this.edgeSet = new vis.DataSet(edges)

      // return {
      //   nodes: new vis.DataSet(nodes),
      //   edges: new vis.DataSet(edges),
      // };
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

.butn{
  background-color: white;
  margin: 10px;
}

.container {
  display: flex; /* or inline-flex */

}

.popup-visible {
    position: absolute;
    z-index: 10;
    visibility: visible;
}
</style>
