<template>
  <div>
    <v-btn class="module-list-btn" color="#1b262c" dark @click.stop="initModuleDataList()">
      <v-icon class="module-list-icon" light>list</v-icon>
      All Modules          
    </v-btn>
    <v-dialog v-model="dialog" max-width="500">
      <v-card >
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :search="search"
          :headers="headers"
          :items="moduleList"
          :items-per-page="100"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item.isCompleted="{ item }">
            <v-checkbox v-model="item.isCompleted" @change="toggleCompletedModule(item.name)"></v-checkbox>
          </template>

          <template v-slot:item.isTracked="{ item }">
            <v-checkbox v-model="item.isTracked" @change="toggleModuleToTrackedMap(item.name)"></v-checkbox>
          </template>
        
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import modules from '../assets/modules';
import graph from '../assets/graph';
import graphService from "../store/graphService"

export default {
  name: 'TrackedModulesDialog',
  components: {
  },
  data() {
    return {
      dialog: false,
      moduleList: [],
      search: '',
      headers: [
        {
            text: 'Module Name',
            align: 'start',
            value: 'name',
            sortable: true,
        },
        { text: 'Completed', value: 'isCompleted' },
        { text: 'Tracked', value: 'isTracked' }
      ],
    };
  },
  computed: {
    completedModules(){
      return this.$store.state.user.hideoutModulesCompleted;
    },
    trackedModules(){
      return this.$store.state.user.trackedModules;
    },
  },
  // watch: {
  //   completedModules: function () { //  TODO: May need to change
  //     console.log("watched");
  //     this.buildModuleDataList();
  //   }
  // },
  created() {

  },
  mounted() {

  },
  methods: {
    initModuleDataList(){
      // TODO: Loading indicator??
      this.dialog = true;
      this.$store.dispatch("fetchUser").then(() => {
        this.buildModuleDataList();
      });
    },
    // buildModuleDataList(){
    //   for(module in modules){
    //     if(this.completedModules.get(this.getModuleIdByName(module))){
    //       this.moduleList.push({
    //         name: module,
    //         isCompleted: true
    //       });
    //     }else{
    //       this.moduleList.push({
    //         name: module,
    //         isCompleted: false
    //       });
    //     }
    //   };
    // },
    toggleModuleToTrackedMap(moduleName){
      console.log(moduleName);
      if(!this.trackedModules.get(moduleName)){
        this.$store.dispatch('updateUserTrackedModules', {name: moduleName, isTracked: true});
      } else {
        this.$store.dispatch('updateUserTrackedModules', {name: moduleName, isTracked: false});
      }
    },
    buildModuleDataList(){
      this.moduleList = [];
      for(module in modules){
        this.moduleList.push({
          name: module,
          isCompleted: this.completedModules.get(this.getModuleIdByName(module)) != undefined,
          isTracked: this.trackedModules.get(module) != undefined
        });
      };
      console.log(this.moduleList);
    },
    toggleCompletedModule(moduleName){
      if(!this.completedModules.get(this.getModuleIdByName(moduleName))){
        this.$store.dispatch('updateUserCompletedModules', {moduleId: this.getModuleIdByName(moduleName), isCompleted: true}).then(() => {
          graphService.highlightCompletedModule(this.getModuleIdByName(moduleName), true, this.completedModules);
        });
      }else{
        this.$store.dispatch('updateUserCompletedModules', {moduleId: this.getModuleIdByName(moduleName), isCompleted: false}).then(() => {
          graphService.highlightCompletedModule(this.getModuleIdByName(moduleName), false, this.completedModules);
        });
      }
    },
    getModuleIdByName(moduleName){
      let moduleId = '';
      graph.data.nodes.forEach((module, index, array) => {
        if(module.label == moduleName){
          moduleId = module.id;
        }
      });
      return moduleId;
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
  }  
};
</script>


<style scoped lang="less">

//TODO: Behaves differently for Chrome and Firefox
.module-list-btn {
  margin-left: 25px;
  margin-right: 10px;
}

.module-list-icon {
  margin-right: 5px;
}
</style>
