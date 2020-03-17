<template>
    <div style="width: 75%; margin: auto; top:25%;">
                        <v-checkbox color="red darken-3" v-model="hideImageColumn" :label="'Hide Image Column'"></v-checkbox>
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
                    label="Tracked Hideout Modules"
                    @change="buildItemListForTable()"
                    clearable
                ></v-select>


            <v-data-table
                :headers="computedHeaders"
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
                    <v-img :src="item.imgUrl" aspect-ratio="1.7" contain></v-img>
                </template>

                <template class="container" v-slot:item.itemsRequired="{ item }">
                    ({{item.itemsRequired.itemsOwned.toLocaleString()}}/{{item.itemsRequired.itemsRequired.toLocaleString()}})
                </template>

                <template class="container" v-slot:item.itemsInInventory="{ item }">
                    <v-btn  class="mx-2 incAndDecButton" fab dark small color="pink" @click="updateItemInInventory(item.href, -1, 0)">
                        <v-icon dark>mdi-minus</v-icon>
                    </v-btn>
                    {{item.itemsInInventory.found.toLocaleString()}}
                    <v-btn class="mx-2 incAndDecButton" fab dark small color="pink" @click="updateItemInInventory(item.href, 1, 0)">
                        <v-icon x-small dark>mdi-plus</v-icon>
                    </v-btn>
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
    </div>
</template>


<script>
import modules from '../assets/modules';
import items from '../assets/items';
import graph from '../assets/graph';


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
        hideImageColumn: false,
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
            this.buildDropDownData();
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
    },
    itemsInInventory(){
        return this.$store.state.user.itemsInInventory;
    },
    computedHeaders () {
      if(this.hideImageColumn)
        return this.headers.filter(header => header.text !== "Image");
    
        return this.headers;
    }
  },
  created() {
  },
  mounted() {
        this.createAllItemsMap();
        this.buildItemListForTable();
  },
  methods: {
    updateItemInInventory(itemHref, numFound, numFoundInRaid){
        let data = {
            foundInc: numFound,
            foundInRaidInc: numFoundInRaid 
        };
        this.$store.dispatch('updateUserItemsInInventory', {itemName:itemHref, itemData: data}).then(() => {
             for (var i in this.itemList){
                if(this.itemList[i].href == itemHref){
                    this.itemList[i].itemsInInventory = {found: this.itemList[i].itemsInInventory.found + data.foundInc,
                                        foundInRaid: this.itemList[i].itemsInInventory.foundInRaid + data.foundInRaidInc
                                        }
                }
            }
        });
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
    buildItemListForTable(){
        const itemMap = this.buildItemDataMapForTable();
        this.buildItemList(itemMap);
    },
    buildItemDataMapForTable() {
        debugger;
        let itemMap = new Map();
        for (let moduleName in modules) { //Loops through all modules
            let items = modules[moduleName].itemsRequired;
            if(this.selectedTrackedModule){ //Module is selected in the tracked dropdown
                if(this.trackedModules.get(this.selectedTrackedModule).includes(moduleName)){
                    for(let itemName in items){ //Loops through all required items for given module
                        if(!itemMap.get(itemName)){ // Item is not in map, add new item
                            if(!this.completedModules.get(this.getModuleIdByName(moduleName))) // Module is not completed, contribute no items
                                itemMap.set(itemName, {itemsRequired: items[itemName], itemsOwned: 0});
                            else
                                itemMap.set(itemName, {itemsRequired: items[itemName], itemsOwned: items[itemName]});
                        }
                        else{ // Item already in map, add required items to existing item
                            if(!this.completedModules.get(this.getModuleIdByName(moduleName)))
                                itemMap.set(itemName, {itemsRequired: itemMap.get(itemName).itemsRequired + items[itemName], itemsOwned: itemMap.get(itemName).itemsOwned});
                            else
                                itemMap.set(itemName, {itemsRequired: itemMap.get(itemName).itemsRequired  + items[itemName], itemsOwned: itemMap.get(itemName).itemsOwned + items[itemName]});
                        }
                    }
                }
            }else{ //No module is selected in the tracked dropdown
                for(let itemName in items){ //Loops through all required items for given module
                    if(!itemMap.get(itemName)){
                        if(!this.completedModules.get(this.getModuleIdByName(moduleName)))
                                itemMap.set(itemName, {itemsRequired: items[itemName], itemsOwned: 0});
                        else
                                itemMap.set(itemName, {itemsRequired: items[itemName], itemsOwned: items[itemName]});
                    }
                    else{
                        if(!this.completedModules.get(this.getModuleIdByName(moduleName)))
                            itemMap.set(itemName, {itemsRequired: itemMap.get(itemName).itemsRequired  + items[itemName], itemsOwned: itemMap.get(itemName).itemsOwned});
                        else
                            itemMap.set(itemName, {itemsRequired: itemMap.get(itemName).itemsRequired  + items[itemName], itemsOwned: itemMap.get(itemName).itemsOwned + items[itemName]});
                    }
                }
            }
        }
        return itemMap;
    },
    buildItemList(itemMap){
       this.itemList = [];
        itemMap.forEach((value, key, map) => {
            if(items.items[key]){
                if(this.itemsInInventory.get(key)){
                    this.itemList.push({
                        name: items.items[key].name,
                        itemsRequired: value,
                        itemsInInventory: {found: this.itemsInInventory.get(key).found, foundInRaid: this.itemsInInventory.get(key).foundInRaid},
                        imgUrl: items.items[key].imgUrl,
                        href: key
                    });
                }
                else{
                    this.itemList.push({
                        name: items.items[key].name,
                        itemsRequired: value,
                        itemsInInventory: {found: 0, foundInRaid: 0},
                        imgUrl: items.items[key].imgUrl,
                        href: key
                    });
                } 
            }else
                if(this.itemsInInventory.get(key)){
                    this.itemList.push({
                        name: key,
                        itemsRequired: value,
                        itemsInInventory: {found: this.itemsInInventory.get(key).found, foundInRaid: this.itemsInInventory.get(key).foundInRaid},
                        imgUrl: '',
                        href: key
                    });
                }
                else{
                    this.itemList.push({
                        name: key,
                        itemsRequired: value,
                        itemsInInventory: {found: 0, foundInRaid: 0},
                        imgUrl: '',
                        href: key
                    });
                } 
        });
    },
    createAllItemsMap(){
        for(let itemName in items.items) {
            this.allItemsMap.set(itemName, items.items[itemName])
        }
    },
    buildDropDownData(){
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

.incAndDecButton{
    width: 20px;
    height: 20px;
}
</style>
