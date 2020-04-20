<template>
    <div class="back viewport-height">
        <v-card class="wdth70p marg-auto hght100p">
            <v-card-title>
                <div class="flex fd-col">
                    <v-checkbox hide-details color="#baa661" v-model="hideImageColumn" :label="'Hide Image Column'"></v-checkbox>
                    <v-checkbox hide-details color="#baa661" v-model="areItemsInInventoryIncluded" :label="'Include Inventory in Items Required'"></v-checkbox>
                </div>
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
            <v-divider color="#3a0f0f"></v-divider>
            <v-data-table
                :height="'calc(100% - 59px)'"
                :headers="computedHeaders"
                :items="itemList"
                :items-per-page="10"
                class="elevation-1 hght-calc"
                :search="search"
                item-key="name"
                show-expand
                :expanded.sync="expanded"
                :single-expand="true"
                :sort-desc="true"
                fixed-header
                must-sort
            >

                <template class="wdth200px hght120px" v-slot:item.itemsRequired="{ item }">
                    <div v-if="!areItemsInInventoryIncluded">
                        ({{item.itemsRequired.itemsOwned.toLocaleString()}}/{{item.itemsRequired.itemsRequired.toLocaleString()}})
                    </div>
                    <div  v-if="areItemsInInventoryIncluded">
                        (<span v-bind:class="{ 'colr-baa661': item.itemsInInventory.found > 0}">{{(item.itemsRequired.itemsOwned + item.itemsInInventory.found).toLocaleString()}}</span>/{{item.itemsRequired.itemsRequired.toLocaleString()}})
                    </div>
                </template>

                <template class="wdth200px hght120px" v-slot:item.itemsInInventory="{ item }">
                    <v-btn :disabled="item.itemsInInventory.found < 1" class="mx-2 wdth20px hght20px" fab dark small color="#3a0f0f" @click="updateItemInInventory(item.href, -1, 0)">
                        <v-icon >mdi-minus</v-icon>
                    </v-btn>
                    {{item.itemsInInventory.found.toLocaleString()}}
                    <v-btn class="mx-2 wdth20px hght20px" fab dark small color="#3a0f0f" @click="updateItemInInventory(item.href, 1, 0)">
                        <v-icon x-small dark>mdi-plus</v-icon>
                    </v-btn>
                </template>

                <template v-slot:expanded-item="{ headers }">
                    <td :colspan="headers.length">
                        <v-simple-table class="dropdown-table">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                    <th class="ta-left">Module Name</th>
                                    <th class="ta-left">Completed</th>
                                    <th class="ta-right">Items Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="module in expandedItemInfo" :key="module.name">
                                    <td class="ta-left wdth30p">{{ module.name }}</td>
                                    <td class="ta-left pl34px">
                                        <v-icon v-if="module.completed" class="mr5px colr-green" green>check_circle_outline</v-icon>
                                        <v-icon v-if="!module.completed" class="mr5px colr-white" green>check_circle_outline</v-icon>
                                    </td>
                                    <td class="ta-right">{{ module.numRequired.toLocaleString()}}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </td>
                </template>

                <template class="wdth200px" v-slot:item.image="{ item }">
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
      areItemsInInventoryIncluded: false,
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
    expanded() {
      if (this.expanded.length) {
        this.expandedItemInfo = [];
        this.buildDropDownData();
      }
    },
  },
  computed: {
    completedModules() {
      return this.$store.state.user.hideoutModulesCompleted;
    },
    trackedModules() {
      return this.$store.state.user.trackedModules || new Map();
    },
    trackedModulesDropdownList() {
      return Array.from(this.trackedModules.keys());
    },
    itemsInInventory() {
      return this.$store.state.user.itemsInInventory;
    },
    computedHeaders() {
      if (this.hideImageColumn) { return this.headers.filter((header) => header.text !== 'Image'); }

      return this.headers;
    },
  },
  created() {
    graphService.initVis();
  },
  mounted() {
    //   TODO: This works for now, need to investigate why app.vue is not loading user before this page is loaded when reloading this page. (Maybe navigation gaurd)
    this.$store.dispatch('fetchUser').then(() => {
      this.buildItemListForTable();
    });
  },
  methods: {
    updateItemInInventory(itemHref, numFound, numFoundInRaid) {
      const data = {
        foundInc: numFound,
        foundInRaidInc: numFoundInRaid,
      };
      this.$store.dispatch('updateUserItemsInInventory', { itemName: itemHref, itemData: data }).then(() => {
        for (const i in this.itemList) {
          if (this.itemList[i].href == itemHref) {
            this.itemList[i].itemsInInventory = {
              found: this.itemList[i].itemsInInventory.found + data.foundInc,
              foundInRaid: this.itemList[i].itemsInInventory.foundInRaid + data.foundInRaidInc,
            };
          }
        }
      });
    },
    getModuleNameById(id) {
      const foundModule = graph.data.nodes.find((module) => module.id === id);
      return foundModule.label;
    },
    getModuleIdByName(moduleName) {
      const foundModule = graph.data.nodes.find((module) => module.label === moduleName);
      return foundModule.id;
    },
    buildItemListForTable() {
      this.buildItemDataMapForTable();
      this.buildItemList();
      if (this.expanded.length) {
        this.expandedItemInfo = [];
        this.buildDropDownData();
      }
    },
    buildItemDataMapForTable() {
      this.itemMap = new Map();
      if (this.selectedTrackedModule) {
        const trackedModuleChildren = Array.from(graphService.getAllChildrenNodesAndEdges(this.getModuleIdByName(this.selectedTrackedModule)).nodes).map((nodeId) => this.getModuleNameById(nodeId));
        trackedModuleChildren.forEach((moduleName) => {
          this.updateItemInItemMap(moduleName);
        });
      } else {
        for (const moduleName in modules) { this.updateItemInItemMap(moduleName); }
      }
    },
    /**
         * Updates the number of items required and owned for a module
         *
         * @param {string} moduleName   String representing the current module being evaluated
         */
    updateItemInItemMap(moduleName) {
      const items = modules[moduleName].itemsRequired;
      for (const itemName in items) { // Loops through all required items for given module
        if (!this.itemMap.get(itemName)) {
          if (!this.completedModules.get(this.getModuleIdByName(moduleName))) { this.itemMap.set(itemName, { itemsRequired: items[itemName], itemsOwned: 0 }); } else { this.itemMap.set(itemName, { itemsRequired: items[itemName], itemsOwned: items[itemName] }); }
        } else if (!this.completedModules.get(this.getModuleIdByName(moduleName))) { this.itemMap.set(itemName, { itemsRequired: this.itemMap.get(itemName).itemsRequired + items[itemName], itemsOwned: this.itemMap.get(itemName).itemsOwned }); } else { this.itemMap.set(itemName, { itemsRequired: this.itemMap.get(itemName).itemsRequired + items[itemName], itemsOwned: this.itemMap.get(itemName).itemsOwned + items[itemName] }); }
      }
    },
    buildItemList() {
      this.itemList = [];
      this.itemMap.forEach((value, key) => {
        if (items.items[key]) {
          if (this.itemsInInventory.get(key)) {
            this.itemList.push({
              name: items.items[key].name,
              itemsRequired: value,
              itemsInInventory: { found: this.itemsInInventory.get(key).found, foundInRaid: this.itemsInInventory.get(key).foundInRaid },
              imgUrl: items.items[key].imgUrl,
              href: key,
            });
          } else {
            this.itemList.push({
              name: items.items[key].name,
              itemsRequired: value,
              itemsInInventory: { found: 0, foundInRaid: 0 },
              imgUrl: items.items[key].imgUrl,
              href: key,
            });
          }
        } else
        if (this.itemsInInventory.get(key)) {
          this.itemList.push({
            name: key,
            itemsRequired: value,
            itemsInInventory: { found: this.itemsInInventory.get(key).found, foundInRaid: this.itemsInInventory.get(key).foundInRaid },
            imgUrl: '',
            href: key,
          });
        } else {
          this.itemList.push({
            name: key,
            itemsRequired: value,
            itemsInInventory: { found: 0, foundInRaid: 0 },
            imgUrl: '',
            href: key,
          });
        }
      });
    },
    buildDropDownData() {
      if (this.selectedTrackedModule) {
        const trackedModuleChildren = Array.from(graphService.getAllChildrenNodesAndEdges(this.getModuleIdByName(this.selectedTrackedModule)).nodes).map((nodeId) => this.getModuleNameById(nodeId));
        trackedModuleChildren.forEach((moduleName) => {
          this.addModuleToExpandedItemList(moduleName, this.expanded[0].href);
        });
      } else {
        for (const moduleName in modules) { this.addModuleToExpandedItemList(moduleName, this.expanded[0].href); }
      }
    },
    /**
         * Adds the module name, number of items required and if the module is completed to the expandedItemInfo list.
         * Note: Module will not be added if it does not contain the current item.
         *
         * @param {string} moduleName       String representing the current module being evaluated
         * @param {string} curRorItemName   String representing the name of the item for the current row being expanded
         */
    addModuleToExpandedItemList(moduleName, curRowItemName) {
      const items = modules[moduleName].itemsRequired;
      for (const itemName in items) {
        if (curRowItemName === itemName) {
          this.expandedItemInfo.push({
            name: moduleName,
            numRequired: items[itemName],
            completed: this.completedModules.get(this.getModuleIdByName(moduleName)) != undefined,
          });
        }
      }
    },
  },
};
</script>


<style scoped lang="less">
.wdth200px {
    width: 200px;
}

.hght120px {
    height: 120px;
}

.container img {
    width: 100%;
    height: auto;
}

.isModuleCompleted{
    background-color: #baa661;
    color: black;
}

.wdth20px {
    width: 20px;
}

.hght20px {
    height: 20px;
}

.wdth70p {
    width: 70%;
}

.marg-auto {
    margin: auto;
}

.ml48px {

}

.dropdown-table {
    margin-left: 48px;
    margin-right: 40%;
}

.hght100p {
    height: 100%;
}

.flex {
    display: flex;
}

.fd-col {
    flex-direction: column;
}


.ta-center {
    text-align: center !important;
}

.ta-left {
    text-align: left;
}

.ta-right {
    text-align: right !important;
}

.hght-calc {
    height: calc(100% - 121px);
}

.steez {
    width: 35%;
}

.colr-green {
    color: green;
}

.colr-white {
    color: white;
    opacity: .1;
}

.colr-baa661 {
    color: #baa661;
}

.wdth30p {
    width: 30%;
}

.pl34px {
    padding-left: 34px;
}

.pt5px {
    padding-top: 5px;
}

.pb5px {
    padding-bottom: 5px;
}

</style>
