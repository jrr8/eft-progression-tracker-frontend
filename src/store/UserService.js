/**
 * Service for user lookups
 */
import User from "../models/User";

const options = {
  get userKey() { return 'user'; },
};

export default {
  fetchUser() {
    return new Promise((resolve) => {
      const userData = localStorage.getItem(options.userKey);
      if(!userData){
        localStorage.setItem(options.userKey,JSON.stringify({trackedModules: Array.from(new Map()),
                                                              itemsOwned: Array.from(new Map()),
                                                              hideoutModulesCompleted: Array.from(new Map()),
                                                              itemsInInventory: Array.from(new Map())}));
      }
      debugger;
      const user = userData ? JSON.parse(userData) : {};

      resolve(new User(user));
    });
  },
  updateUserItemsInInventory(item){
    return new Promise((resolve) => {
      debugger;
      const userData = localStorage.getItem(options.userKey);
      const user = userData ? JSON.parse(userData) : {};
      const itemsInInventory = new Map(user.itemsInInventory);

      if(itemsInInventory.get(item.itemName)){
        let itemData = {
          found: itemsInInventory.get(item.itemName).found + item.itemData.foundInc,
          foundInRaid: itemsInInventory.get(item.itemName).foundInRaid + item.itemData.foundInRaidInc
        };
        itemsInInventory.set(item.itemName, itemData);
      } else{
        let itemData = {
          found: item.itemData.foundInc,
          foundInRaid: item.itemData.foundInRaidInc
        };
        itemsInInventory.set(item.itemName, itemData);
      }
      user.itemsInInventory = Array.from(itemsInInventory);
      localStorage.setItem(options.userKey,JSON.stringify(user));

      resolve(new User(user));
    });
  },
  updateUserTrackedModules(newModule) {
    return new Promise((resolve) => {
      const userData = localStorage.getItem(options.userKey);
      const user = userData ? JSON.parse(userData) : {};
      const trackedModules = new Map(user.trackedModules);

      trackedModules.set(newModule.name, newModule.modules);
      user.trackedModules = Array.from(trackedModules);
      localStorage.setItem(options.userKey,JSON.stringify(user));

      resolve(new User(user));
    });
  },
  updateUserCompletedModules(newModule) {
    return new Promise((resolve) => {
      const userData = localStorage.getItem(options.userKey);
      const user = userData ? JSON.parse(userData) : {};
      const hideoutModulesCompleted = new Map(user.hideoutModulesCompleted);

      if(newModule.isCompleted)
        hideoutModulesCompleted.set(newModule.moduleId, true);
      else
        hideoutModulesCompleted.delete(newModule.moduleId);

      user.hideoutModulesCompleted = Array.from(hideoutModulesCompleted);
      localStorage.setItem(options.userKey,JSON.stringify(user));

      resolve(new User(user));
    });
  }
}
