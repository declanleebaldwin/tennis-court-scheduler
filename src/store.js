import Vue from "vue";
import Vuex from "vuex";
import db from "@/fb";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
	strict: debug,
	state: {
		user: null,
		address: null,
		showNotification: false,
		notificationMessage: "",
		notificationColour: "",
		showNavBar: false,
	},
	getters: {
		user(state) {
			return state.user;
		},
		address(state) {
			return state.address;
		}
	},
	mutations: {
		setUserData(state, user) {
			state.user = user;
		},
		setAddress(state, address) {
			state.address = address;
		},
		updateNotification(state, bool) {
			state.showNotification = bool;
		},
		updateNotificationMessage(state, message) {
			state.notificationMessage = message;
		},
		updateNotificationColour(state, colour) {
			state.notificationColour = colour;
		},
		updateShowNavbar(state, bool) {
			state.showNavBar = bool;
		},
	},
	actions: {
		getUsersAddressAsync({ commit, state }) {
			if (!state.user) return;
			return new Promise((resolve, reject) => {
				db.collection("addresses")
					.where("users", "array-contains", state.user.uid)
					.get()
					.then(function(querySnapshot) {
						let addresses = [];
						querySnapshot.forEach(function(doc) {
							addresses.push({ ...doc.data(), id: doc.id });
						});
						if (addresses.length > 0) {
							commit("setAddress", addresses[0]);
						} else {
							commit("setAddress", null);
						}
						resolve();
					})
					.catch(function() {
						reject();
					});
			});
		},
	},
});
