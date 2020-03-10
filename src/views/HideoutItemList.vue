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
                    {{item.itemsRequired.toLocaleString()}}
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
                                    <td>{{ module.name }}</td>
                                    <td>{{ module.numRequired.toLocaleString() }}</td>
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
  },
  methods: {
    buildListData() {
        let itemMap = new Map();
        if(this.selectedTrackedModule != ''){
            for (let moduleName in modules) {
                if(this.trackedModules.get(this.selectedTrackedModule).includes(moduleName)){
                    let items = modules[moduleName].itemsRequired;
                    for(let itemName in items){
                        if(!itemMap.get(itemName)){
                            itemMap.set(itemName, items[itemName]);
                        }
                        else{
                            itemMap.set(itemName, itemMap.get(itemName) + items[itemName]);
                        }
                    }
                }
            }
        }else{
            for (let moduleName in modules) {
                let items = modules[moduleName].itemsRequired;
                for(let itemName in items){
                    if(!itemMap.get(itemName)){
                        itemMap.set(itemName, items[itemName]);
                    }
                    else{
                        itemMap.set(itemName, itemMap.get(itemName) + items[itemName]);
                    }
                }
            }
        }
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
                            this.expandedItemInfo.push({
                                name: moduleName,
                                numRequired: items[itemName]
                            })
                        }
                    }
                }
            }
        }else{
            for (let moduleName in modules) {
                let items = modules[moduleName].itemsRequired;
                for(let itemName in items){
                    if(this.expanded[0].href == itemName){
                        this.expandedItemInfo.push({
                            name: moduleName,
                            numRequired: items[itemName]
                        })
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
</style>
