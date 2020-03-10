/**
 * Data model for User object
 */
export default class User {
  hideoutModulesCompleted;
  trackedModules;
  itemsOwned;

  constructor(data) {
    this.hideoutModulesCompleted = data.hideoutModulesCompleted;
    this.trackedModules = data.trackedModules;
    this.itemsOwned = data.itemsOwned;
  }
}
