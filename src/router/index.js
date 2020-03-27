import Vue from "vue";
import VueRouter from "vue-router";
import SignIn from "../views/SignIn.vue";
import firebase from "firebase";
import store from "../store";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "SignIn",
		component: SignIn
	},
	{
		path: "/booking",
		name: "Booking",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/Booking.vue"),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/my-bookings",
		name: "MyBookings",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/MyBookings.vue"),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/my-account",
		name: "MyAccount",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/MyAccount.vue"),
		meta: {
			requiresAuth: true
		}
	}
];

const router = new VueRouter({
	routes
});

router.beforeEach(async (to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	let user = await firebase.getCurrentUser();
	if (requiresAuth && !user) {
		next("/");
	} else {
		if (to.name !== "SignIn") {
			store.commit("setUserData", {
				uid: user.uid,
				displayName: user.displayName,
				email: user.email
			});
		}
		next();
	}
});

export default router;
