import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
})

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        dark_mode: true,
        access_token: undefined,
    },
    mutations: {
        enableDarkMode(state, enable) {
            state.dark_mode = enable
        },
        setToken(state, access_token) {
            state.access_token = access_token
        },
    },
    actions: {},
    modules: {},
    plugins: [vuexLocal.plugin],
})
