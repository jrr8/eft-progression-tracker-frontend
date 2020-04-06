<template>
  <div>
    <v-btn class="ml25px mr10px" color="#1b262c" dark @click.stop="initModuleDataList()">
      <v-icon class="mr5px" light>list</v-icon>
      All Modules          
    </v-btn>
    <v-dialog :scrollable="true" v-model="dialog" max-width="500" :height="'height: 75%'">
      <v-card >
        <v-card-title>
          <v-text-field 
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            hide-details
            color="#e3d6ac"
          ></v-text-field>
        </v-card-title>
        <v-card-text class="hght-calc p0px">
          <v-data-table
            style="height:100%;"
            :height="'calc(100% - 59px)'"
            :search="search"
            :headers="headers"
            :items="moduleList"
            :items-per-page="100"
            class="elevation-1"
            fixed-header
          >
            <template v-slot:item.isCompleted="{ item }">
              <v-checkbox color="#e3d6ac" v-model="item.isCompleted" @change="toggleCompletedModule(item.name)"></v-checkbox>
            </template>

            <template v-slot:item.isTracked="{ item }">
              <v-checkbox color="#e3d6ac" v-model="item.isTracked" @change="toggleModuleToTrackedMap(item.name)"></v-checkbox>
            </template>
          
          </v-data-table>
        </v-card-text>
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
    toggleModuleToTrackedMap(moduleName){
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

.ml25px {
  margin-left: 25px;
}

.mr10px {
  margin-right: 10px;
}

.mr5px {
  margin-right: 5px;
}

.hght-calc {
  height: calc(100% - 74px);
}

.p0px {
  padding: 0px;
}


</style>
