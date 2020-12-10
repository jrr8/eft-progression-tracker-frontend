import items from "../assets/items"
import modules from "../assets/modules"
import graph from "../assets/graph"

export default {

    getRequiredItemsForHideoutModule(moduleName) {
        const moduleItems = modules[moduleName].itemsRequired;
        let requiredItems = {};

        for (const itemName in moduleItems) {
            requiredItems[itemName] = items.items[itemName];
            requiredItems[itemName].numRequired = moduleItems[itemName];
        }   
        
        return requiredItems;
    },
    buildItemDataMapForTable(moduleNameList, completedModules) {
        let itemMap = new Map();

        moduleNameList.forEach((moduleName) => {
            this.updateItemInItemMap(moduleName, itemMap, completedModules);
        });

        return itemMap;
    },	
    /**
     * Updates the number of items required and owned for a module
     *
     * @param {string} moduleName   String representing the current module being evaluated
     */
    updateItemInItemMap(moduleName, itemMap, completedModules) {
        const items = modules[moduleName].itemsRequired;

        for (const itemName in items) { // Loops through all required items for given module
            if (!itemMap.get(itemName)) {
                if (!completedModules.get(this.getModuleIdByName(moduleName))) { 
                    itemMap.set(itemName, { itemsRequired: items[itemName], 
                                            itemsOwned: 0 }); 
                } else { 
                    itemMap.set(itemName, { itemsRequired: items[itemName], 
                                            itemsOwned: items[itemName] }); 
                }
            } else if (!completedModules.get(this.getModuleIdByName(moduleName))) { 
                itemMap.set(itemName, { itemsRequired: itemMap.get(itemName).itemsRequired + items[itemName], 
                                        itemsOwned: itemMap.get(itemName).itemsOwned }); 
            } else { 
                itemMap.set(itemName, { itemsRequired: itemMap.get(itemName).itemsRequired + items[itemName], 
                                        itemsOwned: itemMap.get(itemName).itemsOwned + items[itemName] }); 
            }
        }		
    },
    buildItemList(itemMap, itemsInInventory) {
        let itemList = [];
        itemMap.forEach((value, key) => {
            if (items.items[key]) {
                if (itemsInInventory.get(key)) {
                    itemList.push({
                        name: items.items[key].name,
                        itemsRequired: value,
                        itemsInInventory: { found: itemsInInventory.get(key).found, foundInRaid: itemsInInventory.get(key).foundInRaid },
                        imgUrl: items.items[key].imgUrl,
                        href: key,
                    });
                } else {
                    itemList.push({
                        name: items.items[key].name,
                        itemsRequired: value,
                        itemsInInventory: { found: 0, foundInRaid: 0 },
                        imgUrl: items.items[key].imgUrl,
                        href: key,
                    });
                }
            } else
            if (itemsInInventory.get(key)) {
                itemList.push({
                    name: key,
                    itemsRequired: value,
                    itemsInInventory: { found: itemsInInventory.get(key).found, foundInRaid: itemsInInventory.get(key).foundInRaid },
                    imgUrl: '',
                    href: key,
                });
            } else {
                itemList.push({
                    name: key,
                    itemsRequired: value,
                    itemsInInventory: { found: 0, foundInRaid: 0 },
                    imgUrl: '',
                    href: key,
                });
            }
        });

        return itemList;
    },
    getModuleNameById(id) {
        const foundModule = graph.data.nodes.find((module) => module.id === id);
        return foundModule.label;
    },
    getModuleIdByName(moduleName) {
        const foundModule = graph.data.nodes.find((module) => module.label === moduleName);
        return foundModule.id;
    },
}