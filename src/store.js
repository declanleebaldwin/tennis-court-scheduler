import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
	strict: debug,
	state: {
		user: {
			loggedIn: false,
			data: null
		}
	},
	getters: {
		user(state) {
			return state.user;
		}
	},
	mutations: {
		setLoggedIn(state, value) {
			state.user.loggedIn = value;
		},
		setUserData(state, data) {
			state.user.data = data;
		}
	},
	actions: {}
});
