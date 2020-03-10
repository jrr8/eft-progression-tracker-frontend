/**
 * Data model for User object
 */
export default class User {
  hideoutModulesCompleted;
  trackedModules;
  itemsOwned;

  constructor(data) {
    if(Array.isArray(data.hideoutModulesCompleted)){
      this.hideoutModulesCompleted = new Map(data.hideoutModulesCompleted);
    }else{
      this.hideoutModulesCompleted = data.hideoutModulesCompleted;
    }

    if(Array.isArray(data.trackedModules)){
      this.trackedModules = new Map(data.trackedModules);
    }else{
      this.trackedModules = data.trackedModules;
    }

    if(Array.isArray(data.itemsOwned)){
      this.itemsOwned = new Map(data.itemsOwned);
    }else{
      this.itemsOwned = data.itemsOwned;
    }
  }
}
