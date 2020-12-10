<template>
    <div class="back viewport-height">
        <v-card class="wdth70p marg-auto">
            <v-card-title>
                <v-radio-group
					style="margin-right: 16px"
                    v-model="radios"
                    mandatory
                >
                    <v-radio
                        label="Table View"
                        value="tableView"
                    ></v-radio>
                    <v-radio
                        label="Grid View"
                        value="gridView"
                    ></v-radio>
                </v-radio-group>
                <div class="flex fd-col">
                    <v-checkbox style="margin: 0px" @click="eventGAToggleImage()" hide-details color="#baa661" v-model="hideImageColumn" :label="'Hide Image Column'"></v-checkbox>
                    <v-checkbox @click="eventGAToggleIncludeItemsInInventory()" hide-details color="#baa661" v-model="areItemsInInventoryIncluded" :label="'Include Inventory in Items Required'"></v-checkbox>
                </div>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
					@input="buildItemListForTable()"
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
        </v-card>
        <v-divider color="#3a0f0f"></v-divider>
            <v-card v-if="radios=='tableView'" class="wdth70p marg-auto hght100p">
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
        <div v-if="radios == 'gridView'" style="display: flex; flex-wrap: wrap; padding-top: 75px; height: 80%">
            <v-card 
                style="margin: 10px"
                v-for="item in itemList" :key="item.name" 
                max-width="150"
                width="150">
                {{item.name}}

                <v-img 
                    max-width="32"
                    max-height="32"
                    :src=item.imgUrl>
                </v-img>
                <div v-if="!areItemsInInventoryIncluded">
                    ({{item.itemsRequired.itemsOwned.toLocaleString()}}/{{item.itemsRequired.itemsRequired.toLocaleString()}})
                </div>
                <div  v-if="areItemsInInventoryIncluded">
                    (<span v-bind:class="{ 'colr-baa661': item.itemsInInventory.found > 0}">{{(item.itemsRequired.itemsOwned + item.itemsInInventory.found).toLocaleString()}}</span>/{{item.itemsRequired.itemsRequired.toLocaleString()}})
                </div>
                <div >
                    <v-btn :disabled="item.itemsInInventory.found < 1" class="mx-2 wdth20px hght20px" fab dark small color="#3a0f0f" @click="updateItemInInventory(item.href, -1, 0)">
                        <v-icon >mdi-minus</v-icon>
                    </v-btn>
                    {{item.itemsInInventory.found.toLocaleString()}}
                    <v-btn class="mx-2 wdth20px hght20px" fab dark small color="#3a0f0f" @click="updateItemInInventory(item.href, 1, 0)">
                        <v-icon x-small dark>mdi-plus</v-icon>
                    </v-btn>
                </div>
            </v-card>
        </div>
    </div> 
</template> 

<script>
import modules from '../assets/modules';
import items from '../assets/items';
import graph from '../assets/graph';
import graphService from '../store/graphService';
import itemService from '../store/ItemService'


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
			radios: null,
			headers: [
				{ text: 'Item Name', value: 'name' },
				{ text: 'Items Required', value: 'itemsRequired' },
				{ text: 'Items in Inventory', value: 'itemsInInventory' },
				{ text: 'Image', align: 'start', value: 'image',  sortable: false}
			],
			expandedHeaders: [
				{ text: 'Module Name', align: 'start', value: 'name'},
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
    	selectedTrackedModule(){
			// TODO: May need to move from watched, not sure track events that are not function calls
			this.$ga.event('select', 'trackedModuleSelected', 'clicked', 9);
    	}
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
			if (this.hideImageColumn) { 
				return this.headers.filter((header) => header.text !== 'Image'); 
			}

			return this.headers;
		},
	},
	created() {
		graphService.initVis();
	},
	mounted() {
		this.$ga.page('/hideout-items');
		//   TODO: This works for now, need to investigate why app.vue is not loading user before this page is loaded when reloading this page. (Maybe navigation gaurd)
		this.$store.dispatch('fetchUser').then(() => {
			this.buildItemListForTable();
			this.sortItemList();
		});
	},
  	methods: {
		eventGAToggleImage() {
			this.$ga.event('checkbox', 'toggleImageCheckbox', 'clicked', 5);
		},
    	eventGAToggleIncludeItemsInInventory() {
      		this.$ga.event('checkbox', 'toggleIncludeItemsInInventoryCheckbox', 'clicked', 6);
    	},
    	updateItemInInventory(itemHref, numFound, numFoundInRaid) {
     		this.$ga.event('button', 'updateItemInInventoryButton', 'clicked', 7);
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
		buildItemListForTable() {  
			let moduleNameList = [];

			if (this.selectedTrackedModule) {
				moduleNameList = Array.from(graphService.getAllChildrenNodesAndEdges(graphService.getModuleIdByName(this.selectedTrackedModule)).nodes).map((nodeId) => graphService.getModuleNameById(nodeId));
			} else {
				moduleNameList = Object.keys(modules);
			}

			this.itemMap = itemService.buildItemDataMapForTable(moduleNameList, this.completedModules);

			if (this.search) {
				this.itemMap.forEach((item, itemName, itemMap) => {
					if (!itemName.toUpperCase().includes(this.search.toUpperCase())) {
						itemMap.delete(itemName);
					}
				})
			}

			this.itemList = itemService.buildItemList(this.itemMap, this.itemsInInventory);
			
			if (this.expanded.length) {
				this.expandedItemInfo = [];
				this.buildDropDownData();
			}
		},
		buildDropDownData() {
			this.$ga.event('button', 'toggleItemDropDownList', 'clicked', 8);
			if (this.selectedTrackedModule) {
				const trackedModuleChildren = Array.from(graphService.getAllChildrenNodesAndEdges(graphService.getModuleIdByName(this.selectedTrackedModule)).nodes).map((nodeId) => graphService.getModuleNameById(nodeId));
				trackedModuleChildren.forEach((moduleName) => {
					this.addModuleToExpandedItemList(moduleName, this.expanded[0].href);
				});
			} else {
				for (const moduleName in modules) { 
					this.addModuleToExpandedItemList(moduleName, this.expanded[0].href); 
				}
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
						completed: this.completedModules.get(graphService.getModuleIdByName(moduleName)) != undefined,
					});
				}
			}
		},
		sortItemList() {
			// sort by name
			this.itemList.sort((a, b) => {
				var nameA = a.name.toUpperCase(); // ignore upper and lowercase
				var nameB = b.name.toUpperCase(); // ignore upper and lowercase
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}

				// names must be equal
				return 0;
			})
		}
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
