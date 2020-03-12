<template>
    <div style="width: 75%; margin: auto; top:25%;">
        <v-card>
            <v-card-title>
                Items
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-select
                    v-model="selectedTrackedModule"
                    :items="trackedModulesDropdownList"
                    attach
                    chips
                    label="Tracked Hideout Modules"
                    @change="buildListData()"
                ></v-select>
            </v-card-title>

            <v-data-table
                :headers="headers"
                :items="itemList"
                :items-per-page="10"
                class="elevation-1"
                :search="search"
                item-key="name"
                show-expand
                :expanded.sync="expanded"
                :single-expand="true"
                :sort-desc="true"
            >
                <template class="container" v-slot:item.image="{ item }">
                    <img :src="item.imgUrl">
                </template>

                <template class="container" v-slot:item.itemsRequired="{ item }">
                    ({{item.itemsRequired.itemsOwned.toLocaleString()}}/{{item.itemsRequired.itemsRequired.toLocaleString()}})
                </template>

                 <template v-slot:expanded-item="{ headers }">
                    <td :colspan="headers.length">
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                    <th>Module Name</th>
                                    <th>Items Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="module in expandedItemInfo" :key="module.name">
                                    <td v-bind:class="{ isModuleCompleted: module.completed }">{{ module.name }}</td>
                                    <td v-bind:class="{ isModuleCompleted: module.completed }">{{ module.numRequired.toLocaleString() }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </td>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import modules from '../assets/modules';
import items from '../assets/items';
import graph from '../assets/graph';

// const itemList = [];
// const allItemsMap = new Map();

export default {
  name: 'HideoutItemList',
  components: {
  },
  data() {
    return {
        selectedTrackedModule: '',
        itemList: [],
        allItemsMap: new Map(),
        itemsOwned: new Map(),
        expandedItemInfo: [],
        expanded: [],
        search: '',
        headers: [
            {
                text: 'Image',
                align: 'start',
                value: 'image',
                sortable: false,
            },
            { text: 'Item Name', value: 'name' },
            { text: 'Items Required', value: 'itemsRequired' },
            { text: 'Items in Inventory', value: 'itemsInInventory' },
        ],
        expandedHeaders: [
            {
                text: 'Module Name',
                align: 'start',
                value: 'name',
            },
            { text: 'Numver Required', value: 'numRequired' },
        ],

    };
  },
  watch: {
    expanded: function (val) {
        if(this.expanded.length){
            this.expandedItemInfo = [];
            this.printRow();
        }
    }
  },
  computed: {
    completedModules(){
      return this.$store.state.user.hideoutModulesCompleted;
    },
    trackedModules(){
      return this.$store.state.user.trackedModules || new Map();
    },
    trackedModulesDropdownList(){
        return Array.from(this.trackedModules.keys());
    }
  },
  created() {
  },
  mounted() {
        this.createAllItemsMap();
        this.buildListData();
        // this.buildItemsOwnedData();
        // console.log(this.itemsOwned);
  },
  methods: {
    getModuleNameById(id){
      let moduleName = '';
      graph.data.nodes.forEach((module, index, array) => {
        if(module.id == id){
          moduleName = module.label;
        }
      });
      return moduleName;
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
    buildItemsOwnedData(){
        this.completedModules.forEach((value, moduleId, map) => {
                    debugger;
            const moduleName = this.getModuleNameById(moduleId);
            const moduleItems = modules[moduleName].itemsRequired;
            for(let itemName in items){
                if(!this.itemsOwned.get(itemName)){
                    this.itemsOwned.set(itemName, items[itemName]);
                }else{
                    this.itemsOwned.set(itemName, this.itemsOwned.get(itemName) + items[itemName]);
                }
            }   
        });
    },
    buildListData() {
        let itemMap = new Map();
        if(this.selectedTrackedModule != ''){
            for (let moduleName in modules) {
                if(this.trackedModules.get(this.selectedTrackedModule).includes(moduleName)){
                    let items = modules[moduleName].itemsRequired;
                    for(let itemName in items){
                        if(!itemMap.get(itemName)){
                            if(!this.completedModules.get(this.getModuleIdByName(moduleName)))
                                itemMap.set(itemName, {itemsRequired: items[itemName], itemsOwned: 0});
                            else
                                itemMap.set(itemName, {itemsRequired: items[itemName], itemsOwned: items[itemName]});
                        }
                        else{
                            if(!this.completedModules.get(this.getModuleIdByName(moduleName)))
                                itemMap.set(itemName, {itemsRequired: itemMap.get(itemName).itemsRequired + items[itemName], itemsOwned: itemMap.get(itemName).itemsOwned});
                            else
                                itemMap.set(itemName, {itemsRequired: itemMap.get(itemName).itemsRequired  + items[itemName], itemsOwned: itemMap.get(itemName).itemsOwned + items[itemName]});
                        }
                    }
                }
            }
        }else{
            for (let moduleName in modules) {
                let items = modules[moduleName].itemsRequired;
                for(let itemName in items){
                    if(!itemMap.get(itemName)){
                        if(!this.completedModules.get(this.getModuleIdByName(moduleName)))
                                itemMap.set(itemName, {itemsRequired: items[itemName], itemsOwned: 0});
                        else
                                itemMap.set(itemName, {itemsRequired: items[itemName], itemsOwned: items[itemName]});
                    }
                    else{
                        debugger;
                        if(!this.completedModules.get(this.getModuleIdByName(moduleName)))
                            itemMap.set(itemName, {itemsRequired: itemMap.get(itemName).itemsRequired  + items[itemName], itemsOwned: itemMap.get(itemName).itemsOwned});
                        else
                            itemMap.set(itemName, {itemsRequired: itemMap.get(itemName).itemsRequired  + items[itemName], itemsOwned: itemMap.get(itemName).itemsOwned + items[itemName]});
                    }
                }
            }
        }
        console.log(itemMap);
        this.itemList = [];
        itemMap.forEach((value, key, map) => {
            if(items.items[key]){
                this.itemList.push({
                        name: items.items[key].name,
                        itemsRequired: value,
                        itemsInInventory: 0,
                        imgUrl: items.items[key].imgUrl,
                        href: key
                    });
            }else
                this.itemList.push({
                        name: key,
                        itemsRequired: value,
                        itemsInInventory: 0,
                        imgUrl: '',
                        href: key
                    });
        });
    },
    createAllItemsMap(){
        for(let itemName in items.items) {
            this.allItemsMap.set(itemName, items.items[itemName])
        }
    },
    printRow(){
        if(this.selectedTrackedModule != ''){
            for (let moduleName in modules) {
                if(this.trackedModules.get(this.selectedTrackedModule).includes(moduleName)){
                    let items = modules[moduleName].itemsRequired;
                    for(let itemName in items){
                        if(this.expanded[0].href == itemName){
                            if(this.completedModules.get(this.getModuleIdByName(moduleName))){
                            this.expandedItemInfo.push({
                                name: moduleName,
                                numRequired: items[itemName],
                                completed: true
                            });
                        }else{
                                this.expandedItemInfo.push({
                                name: moduleName,
                                numRequired: items[itemName],
                                completed: false
                            });
                        }
                        }
                    }
                }
            }
        }else{
            for (let moduleName in modules) {
                let items = modules[moduleName].itemsRequired;
                for(let itemName in items){
                    if(this.expanded[0].href == itemName){
                        if(this.completedModules.get(this.getModuleIdByName(moduleName))){
                            this.expandedItemInfo.push({
                                name: moduleName,
                                numRequired: items[itemName],
                                completed: true
                            });
                        }else{
                                this.expandedItemInfo.push({
                                name: moduleName,
                                numRequired: items[itemName],
                                completed: false
                            });
                        }
                    }
                }
            }
        }
    }
  }
};
</script>


<style scoped lang="less">
.container {
    width: 200px;
    height: 120px;
}

/* resize images */
.container img {
    width: 100%;
    height: auto;
}

.isModuleCompleted{
    background-color: grey;
}
</style>
