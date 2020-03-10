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
                                                                      hideoutModulesCompleted: Array.from(new Map())}));
      }
      debugger;
      const user = userData ? JSON.parse(userData) : {};

      resolve(new User(user));
    });
  },
  updateUserTrackedModules(newModule) {
    return new Promise((resolve) => {
      debugger;
      const userData = localStorage.getItem(options.userKey);
      const user = userData ? JSON.parse(userData) : {};
      const trackedModules = new Map(user.trackedModules);

      trackedModules.set(newModule.name, newModule.modules);
      user.trackedModules = Array.from(trackedModules);
      localStorage.setItem(options.userKey,JSON.stringify(user));

      resolve(new User(user));
    });
  }
}
