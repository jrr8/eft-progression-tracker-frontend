import Vue from 'vue'
import Vuex from 'vuex'
import UserService from "./UserService"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // put variables and collections here
        // TODO: I think tackedModules should not be in state is they
        //       are stored under the user. Do we want a getter for
        //       trackedModules that return state.user.trackedModules?
        // trackedModules: new Map(),
        user: { },
    },
    mutations: {
        // put sychronous functions for changing state e.g. add, edit, delete
        addTrackedModule(state, payload){
            if (!state.user.trackedModules) {
              state.user.trackedModules = new Map();
            }

            state.user.trackedModules.set(payload.name, payload.modules);
        },

        setUser(state, payload) {
            state.user = payload.user;
        }

    },
    actions: {
        // put asynchronous functions that can call one or more mutation functions
        fetchUser({ commit }) {
            UserService.fetchUser().then(user => {
            commit("setUser", { user })
            });
        },
        updateUserTrackedModules({ commit }, payload) {
            debugger;
            UserService.updateUserTrackedModules(payload).then(user => {
              commit("setUser", { user })
            })
      },
    }
})
