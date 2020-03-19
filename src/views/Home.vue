<template>
  <div class="d-flex-col">
    <div class="container">
      <input style="color: white; border: 2px solid white;" type="text" v-model="question" @input="searchModulesForMatch()" @focus="onInputFocused()" @blur="onInputBlurred()">
      <button v-on:click="saveGraph()">Save</button>
      <v-btn class="ma-2 butn" outlined color="indigo" @click="$router.push('hideoutItemList')" >Item List</v-btn>
      <v-btn class="ma-2 butn" outlined color="indigo" @click="addModuleToTrackedMap()" >Track Selected Module</v-btn>
      <v-checkbox color="red darken-3" :disabled="graphService.selectedModuleId == ''" v-model="isModuleCompletedForCheckbox" :label="'Hideout Module Complete'"></v-checkbox>
      <tracked-modules-dialog></tracked-modules-dialog>
    </div>

    <span ref="vis" class="flex-grow"></span>
  </div>

</template>

<script>
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
      edges: new Map(),
      question: '',
      inputFocused: false,
      graphService,
    };
  },
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
        if(this.graphService.selectedModuleId !== '' && this.completedModules)
          return this.completedModules.get(this.graphService.selectedModuleId) ? true: false;
        else
          return false;
      },
      set: function(isChecked){
        this.toggleCompletedModule();
      }
    },
  },
  created() {

  },
  mounted() {
    graphService.initVis(this.$refs.vis);
    this.network = graphService.getNetwork();
    graphService.highlightCompletedModulesOnInit(this.completedModules);
  },
  methods: {
    toggleCompletedModule(){
      if(!this.completedModules.get(this.graphService.selectedModuleId)){
        this.$store.dispatch('updateUserCompletedModules', {moduleId: this.graphService.selectedModuleId, isCompleted: true}).then(() => {
          graphService.highlightCompletedModule(this.graphService.selectedModuleId, true, this.completedModules);
        });
      }else{
        this.$store.dispatch('updateUserCompletedModules', {moduleId: this.graphService.selectedModuleId, isCompleted: false}).then(() =>{
        graphService.highlightCompletedModule(this.graphService.selectedModuleId, false, this.completedModules);
        });
      }
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
    addModuleToTrackedMap(){
      if(this.graphService.selectedModule != ''){
        // TODO: needed to put into object first, not individual. Investigate this
        console.log("in method");
        console.log(graphService.getVisData().nodes.get('109').label);
        this.$store.dispatch('updateUserTrackedModules', {name: this.graphService.selectedModule, modules: this.graphService.prevModulesForCurrentModule.map((id) => graphService.getVisData().nodes.get(id).label)});
      }
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
</script>


<style scoped lang="less">
.d-flex-col {
  display: flex;
  flex-direction: column;
}

.flex-grow {
  flex-grow: 1;
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
