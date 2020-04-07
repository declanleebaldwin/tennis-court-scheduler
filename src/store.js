import Vue from "vue";
import Vuex from "vuex";
import db from "@/fb";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
	strict: debug,
	state: {
		user: null,
		hasRegisteredAddress: false,
		showNotification: false,
		notificationMessage: "",
		notificationColour: "",
		showNavBar: false
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
		updateNotification(state, bool) {
			state.showNotification = bool;
		},
		updateNotificationMessage(state, message) {
			state.notificationMessage = message;
		},
		updateNotificationColour(state, colour) {
			state.notificationColour = colour;
		},
		updateHasRegisteredAddress(state, bool) {
			state.hasRegisteredAddress = bool;
		},
		updateShowNavbar(state, bool) {
			state.showNavBar = bool
		}
	},
	actions: {
		checkIfUserHasAddresssAsync({ commit, state }) {
			return new Promise((resolve, reject) => {
				db.collection("addresses")
					.where("users", "array-contains", state.user.uid)
					.get()
					.then(function(querySnapshot) {
						let addresses = [];
						querySnapshot.forEach(function(doc) {
							addresses.push(doc.data());	
						});
						if(addresses.length > 0) {
							commit("updateHasRegisteredAddress", true);
						} else {
							commit("updateHasRegisteredAddress", false);
						}
						resolve()
					})
					.catch(function(error) {
						console.log("Error getting documents: ", error);
						reject();
					});
			});

		}
	}
});
