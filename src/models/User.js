/**
 * Data model for User object
 */
export default class User {
  hideoutModulesCompleted;
  trackedModules;
  itemsOwned;
  itemsInInventory;

  constructor(data) {
    const getMapFromMapOrArray = (property) => {
      const mapOrArray = data[property];
      this[property] = Array.isArray(mapOrArray) ? new Map(mapOrArray) : mapOrArray;
    }

    ['hideoutModulesCompleted', 'trackedModules',
      'itemsOwned', 'itemsInInventory'].forEach(getMapFromMapOrArray)
  }
}
