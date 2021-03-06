import Vue from 'vue';
import Vuex from 'vuex';
import UserService from './UserService';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // put variables and collections here
    // TODO: I think tackedModules should not be in state is they
    //       are stored under the user. Do we want a getter for
    //       trackedModules that return state.user.trackedModules?
    // trackedModules: new Map(),
    user: { },
    visData: { },
    isNavDrawerActive: false,
  },
  mutations: {
    // put sychronous functions for changing state e.g. add, edit, delete
    addTrackedModule(state, payload) {
      if (!state.user.trackedModules) {
        state.user.trackedModules = new Map();
      }

      state.user.trackedModules.set(payload.name, payload.modules);
    },

    setUser(state, payload) {
      state.user = payload.user;
    },

    setVisData(state, payload) {
      state.visData = payload;
    },

    setNavDrawerIsActive(state, payload) {
      state.isNavDrawerActive = payload.isNavDrawerActive;
    },

  },
  actions: {
    // put asynchronous functions that can call one or more mutation functions
    fetchUser({ commit }) {
      return new Promise((resolve, reject) => {
        return UserService.fetchUser().then((user) => {
          commit('setUser', { user });
          resolve(user);
        });
      });
    },
    updateUserTrackedModules({ commit }, payload) {
      UserService.updateUserTrackedModules(payload).then((user) => {
        commit('setUser', { user });
      });
    },
    updateUserCompletedModules({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UserService.updateUserCompletedModules(payload).then((user) => {
          commit('setUser', { user });
        });
        resolve();
      });
    },
    updateUserItemsInInventory({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UserService.updateUserItemsInInventory(payload).then((user) => {
          commit('setUser', { user });
        });
        resolve();
      });
    },
    updateDataTrackingPermission({ commit }, payload) {
      return new Promise((resolve, reject) => {
        UserService.updateDataTrackingPermission(payload).then((user) => {
          commit('setUser', { user });
        });
        resolve();
      });
    },
  },
});
