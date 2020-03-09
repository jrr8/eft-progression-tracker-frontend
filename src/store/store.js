import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // put variables and collections here
        trackedModules: new Map()
    },
    mutations: {
        // put sychronous functions for changing state e.g. add, edit, delete
        addTrackedModule(state, payload){
            console.log(payload.name);
            console.log(payload.modules);
            state.trackedModules.set(payload.name, payload.modules);
            console.log("comitting");
        }
    },
    actions: {
        // put asynchronous functions that can call one or more mutation functions
    }
})