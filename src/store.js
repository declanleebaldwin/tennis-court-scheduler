import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
	strict: debug,
	state: {
		user: null
	},
	getters: {
		user(state) {
			return state.user;
		}
	},
	mutations: {
		setUserData(state, user) {
			state.user = user;
		},
	},
	actions: {}
});
