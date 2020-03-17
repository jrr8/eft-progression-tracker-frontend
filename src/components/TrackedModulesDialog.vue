<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Show List of all Modules</v-btn>
      </template>
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

          <template v-slot:item.isTracked="{ item }">
            <v-checkbox v-model="item.isTracked" @change="toggleCompletedModule(item.name)"></v-checkbox>
          </template>
        
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-row>
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
        { text: 'Tracked?', value: 'isTracked' },
      ],
    };
  },
  computed: {
    completedModules(){
      console.log("computed");
      return this.$store.state.user.hideoutModulesCompleted;
    },
  },
  created() {

  },
  mounted() {
    this.buildModuleDataList();
  },
  methods: {
    buildModuleDataList(){
      for(module in modules){
        if(this.completedModules.get(this.getModuleIdByName(module))){
          this.moduleList.push({
            name: module,
            isTracked: true
          });
        }else{
          this.moduleList.push({
            name: module,
            isTracked: false
          });
        }
      }
    },
    toggleCompletedModule(moduleName){
      debugger;
      console.log(this.getModuleIdByName(moduleName));
      if(!this.completedModules.get(this.getModuleIdByName(moduleName))){
        this.$store.dispatch('updateUserCompletedModules', {moduleId: this.getModuleIdByName(moduleName), isCompleted: true}).then(() => {
          graphService.highlightCompletedModule(this.getModuleIdByName(moduleName), true, this.completedModules);
        });
      }else{
        this.$store.dispatch('updateUserCompletedModules', {moduleId: this.getModuleIdByName(moduleName), isCompleted: false}).then(() => {
          console.log("deleted");
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
</style>
