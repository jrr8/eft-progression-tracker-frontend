<template>
    <div class="back viewport-height">
        <v-card style="width: 75%; margin: auto; height: 100%;">
            <v-card-title>
                <v-checkbox color="#baa661" v-model="hideImageColumn" :label="'Hide Image Column'"></v-checkbox>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    hide-details
                    color="#baa661"
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-select
                    v-model="selectedTrackedModule"
                    :items="trackedModulesDropdownList"
                    attach
                    label="Tracked Hideout Modules"
                    @change="buildItemListForTable()"
                    clearable
                    hide-details
                    color="#baa661"
                ></v-select>
            </v-card-title>
            <v-data-table
                style="height: calc(100% - 102px);"
                :height="'calc(100% - 59px)'"
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
                fixed-header
                must-sort
            >

                <template class="container" v-slot:item.itemsRequired="{ item }">
                    ({{item.itemsRequired.itemsOwned.toLocaleString()}}/{{item.itemsRequired.itemsRequired.toLocaleString()}})
                </template>

                <template class="container" v-slot:item.itemsInInventory="{ item }">
                    <v-btn class="mx-2 incAndDecButton" fab dark small color="#3a0f0f" @click="updateItemInInventory(item.href, -1, 0)">
                        <v-icon >mdi-minus</v-icon>
                    </v-btn>
                    {{item.itemsInInventory.found.toLocaleString()}}
                    <v-btn class="mx-2 incAndDecButton" fab dark small color="#3a0f0f" @click="updateItemInInventory(item.href, 1, 0)">
                        <v-icon x-small dark>mdi-plus</v-icon>
                    </v-btn>
                </template>

                <template v-slot:expanded-item="{ headers }">
                    <td :colspan="headers.length">
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                    <th style="text-align: center;">Module Name</th>
                                    <th style="text-align: center;">Items Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="module in expandedItemInfo" :key="module.name">
                                    <td v-bind:class="{ isModuleCompleted: module.completed }">{{ module.name }} {{module.completed ? ' (Completed)' : ''}}</td>
                                    <td v-bind:class="{ isModuleCompleted: module.completed }">{{ module.numRequired.toLocaleString() }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </td>
                </template>

                <template class="container" v-slot:item.image="{ item }">
                    <v-img :src="item.imgUrl" max-height="70px" contain></v-img>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>


<script>
import modules from '../assets/modules';
import items from '../assets/items';
import graph from '../assets/graph';
import graphService from '../store/graphService';


export default {
    name: 'HideoutItemList',
    components: {
    },
    data() {
        return {
            selectedTrackedModule: '',
            itemList: [],
            itemMap: new Map(),
            itemsOwned: new Map(),
            expandedItemInfo: [],
            expanded: [],
            search: '',
            hideImageColumn: false,
            headers: [
                { text: 'Item Name', value: 'name' },
                { text: 'Items Required', value: 'itemsRequired' },
                { text: 'Items in Inventory', value: 'itemsInInventory' },
                {
                text: 'Image',
                align: 'start',
                value: 'image',
                sortable: false,
                },
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
        //   TODO: This works for now, need to investigate why app.vue is not loading user before this page is loaded when reloading this page. (Maybe navigation gaurd)
        this.$store.dispatch("fetchUser").then(() => {
            this.buildItemListForTable();
        });

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
            this.buildItemDataMapForTable();
            this.buildItemList();
            if(this.expanded.length){
                this.expandedItemInfo = [];
                this.buildDropDownData();
            }
        },
        buildItemDataMapForTable() {
            this.itemMap = new Map();
            if(this.selectedTrackedModule){
                let trackedModuleChildren = Array.from(graphService.getAllChildrenNodesAndEdges(this.getModuleIdByName(this.selectedTrackedModule)).nodes).map((nodeId) => {return this.getModuleNameById(nodeId)});
                trackedModuleChildren.forEach((moduleName) => {
                    this.updateItemInItemMap(moduleName);
                });
            }else {
                for (let moduleName in modules) 
                    this.updateItemInItemMap(moduleName);
            }
        },
        /**
         * Updates the number of items required and owned for a module
         *
         * @param {string} moduleName   String representing the current module being evaluated 
         */
        updateItemInItemMap(moduleName){
            let items = modules[moduleName].itemsRequired;
            for(let itemName in items){ //Loops through all required items for given module
                if(!this.itemMap.get(itemName)){
                    if(!this.completedModules.get(this.getModuleIdByName(moduleName)))
                        this.itemMap.set(itemName, {itemsRequired: items[itemName], itemsOwned: 0});
                    else
                        this.itemMap.set(itemName, {itemsRequired: items[itemName], itemsOwned: items[itemName]});
                }
                else{
                    if(!this.completedModules.get(this.getModuleIdByName(moduleName)))
                        this.itemMap.set(itemName, {itemsRequired: this.itemMap.get(itemName).itemsRequired + items[itemName], itemsOwned: this.itemMap.get(itemName).itemsOwned});
                    else
                        this.itemMap.set(itemName, {itemsRequired: this.itemMap.get(itemName).itemsRequired + items[itemName], itemsOwned: this.itemMap.get(itemName).itemsOwned + items[itemName]});
                }
            }
        },
        buildItemList(itemMap){
            this.itemList = [];
            this.itemMap.forEach((value, key, map) => {
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
        buildDropDownData(){
            if(this.selectedTrackedModule){
                let trackedModuleChildren = Array.from(graphService.getAllChildrenNodesAndEdges(this.getModuleIdByName(this.selectedTrackedModule)).nodes).map((nodeId) => {return this.getModuleNameById(nodeId)});
                trackedModuleChildren.forEach((moduleName) => {
                    this.addModuleToExpandedItemList(moduleName, this.expanded[0].href);
                });
            } else {
                for (let moduleName in modules)
                    this.addModuleToExpandedItemList(moduleName, this.expanded[0].href);
            }
        },
        /**
         * Adds the module name, number of items required and if the module is completed to the expandedItemInfo list.
         * Note: Module will not be added if it does not contain the current item.
         *
         * @param {string} moduleName       String representing the current module being evaluated
         * @param {string} curRorItemName   String representing the name of the item for the current row being expanded  
         */
        addModuleToExpandedItemList(moduleName, curRowItemName){
            let items = modules[moduleName].itemsRequired;
            for(let itemName in items){
                if(curRowItemName == itemName){
                    this.expandedItemInfo.push({
                        name: moduleName,
                        numRequired: items[itemName],
                        completed: this.completedModules.get(this.getModuleIdByName(moduleName)) != undefined
                    });
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
    background-color: #baa661;
    color: black;
}

.incAndDecButton{
    width: 20px;
    height: 20px;
}

.back {
  background-image: url(https://cdn.wccftech.com/wp-content/uploads/2017/04/escape-from-tarkov-logo.jpg);
  background-size: cover;
}
</style>
