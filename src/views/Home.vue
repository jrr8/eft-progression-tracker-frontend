<template>
  <div class="d-flex-col">
    <div class="user-interaction-header">

        <input class="search-input" type="text" v-model="question" @input="graphService.searchModulesForMatch(question)" @focus="onInputFocused()" @blur="onInputBlurred()">
      <!-- <button v-on:click="saveGraph()">Save</button> -->
      <!-- <v-btn class="ma-2 butn" outlined color="indigo" @click="$router.push('hideoutItemList')" >Item List</v-btn>
      <v-btn class="ma-2 butn" outlined color="indigo" @click="addModuleToTrackedMap()" >Track Selected Module</v-btn> -->
      <div class="checkbox-container">
        <v-checkbox hide-details class="checkbox" color="red darken-3" :disabled="graphService.selectedModuleId == ''" v-model="isModuleCompletedForCheckbox" :label="'Hideout Module Completed'"></v-checkbox>
        <v-checkbox hide-details class="checkbox" color="red darken-3" :disabled="graphService.selectedModuleId == ''" v-model="isModuleTrackedForCheckbox" :label="'Hideout Module Tracked'"></v-checkbox>
      </div>
      <!-- <v-btn  @click.stop="toggleIsNavDrawerActive()"> -->
        
      <!-- </v-btn> -->
      <tracked-modules-dialog></tracked-modules-dialog>
    </div>

    <span ref="vis" class="flex-grow no-focus"></span>
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
    isNavDrawerActive(){
      return this.$store.state.isNavDrawerActive;
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
    isModuleTrackedForCheckbox: {
      get: function(){
        if(this.graphService.selectedModuleId !== '' && this.trackedModules)
          return this.trackedModules.get(this.graphService.selectedModule) ? true: false;
        else
          return false;
      },
      set: function(isChecked){
        this.toggleModuleToTrackedMap();
      }
    },
  },
  created() {

  },
  mounted() {
    //   TODO: This works for now, need to investigate why app.vue is not loading user before this page is loaded when reloading this page. (Maybe navigation gaurd) 
    //  TODO: Move to created
    this.$store.dispatch("fetchUser").then(() => {
      graphService.initVis(this.$refs.vis);
      this.network = graphService.getNetwork();
      graphService.highlightCompletedModulesOnInit(this.completedModules);
    });
  },
  methods: {
    toggleIsNavDrawerActive(){
      console.log("here");
      this.$store.commit('setNavDrawerIsActive', {isNavDrawerActive: !this.isNavDrawerActive});
    },
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
      graphService.searchModulesForMatch(this.question);
    },
    onInputBlurred(){
      setTimeout(()=>{
        this.inputFocused = false;
      },200);
    },
    toggleModuleToTrackedMap(){
      if(this.graphService.selectedModule != '' && !this.trackedModules.get(this.graphService.selectedModule)){
        this.$store.dispatch('updateUserTrackedModules', {name: this.graphService.selectedModule, modules: this.graphService.prevModulesForCurrentModule.map((id) => graphService.getVisData().nodes.get(id).label), isTracked: true});
      } else {
        this.$store.dispatch('updateUserTrackedModules', {name: this.graphService.selectedModule, modules: this.graphService.prevModulesForCurrentModule.map((id) => graphService.getVisData().nodes.get(id).label), isTracked: false});
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

.user-interaction-header {
  //  TODO: Add padding
  display: flex; /* or inline-flex */
  background: #3a0f0f; 
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  align-items: center;
}

.checkbox-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.checkbox {
  margin: 0px;
}

.search-input {
  color: white; border: 2px solid white;
}

.search-input-container {
  height: 100%;
}

.search-input {
  color: white; 
  border: 2px solid white;
  margin: 10px;
}

.popup-visible {
    position: absolute;
    z-index: 10;
    visibility: visible;
}
</style>
