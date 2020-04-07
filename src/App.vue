<template>
	<div id="app">
		<section class="hero is-success">
			<div class="hero-head">
				<header class="navbar">
					<div class="container">
						<div class="navbar-brand">
							<span
								class="navbar-burger burger"
								:class="{ 'is-active': isActive }"
								data-target="navbarMenuHeroC"
								@click="isActive = !isActive"
							>
								<span></span>
								<span></span>
								<span></span>
							</span>
						</div>
						<div v-if="user" id="navbarMenuHeroC" class="navbar-menu" :class="{ 'is-active': isActive }">
							<div class="navbar-end">
								<!-- <router-link v-show="hasRegisteredAddress" id="navbar-make-a-booking" class="navbar-item" to="/admin"
									>Admin</router-link
								> -->
								<router-link
									v-show="hasRegisteredAddress"
									id="navbar-make-a-booking"
									class="navbar-item"
									to="/booking"
									>Make a Booking</router-link
								>
								<router-link
									v-show="hasRegisteredAddress"
									id="navbar-my-bookings"
									class="navbar-item"
									to="/my-bookings"
									>My Bookings</router-link
								>
								<router-link id="navbar-my-account" class="navbar-item" to="/my-account"
									><i class="material-icons account">account_circle</i
									>{{ user.displayName }}</router-link
								>
								<a class="navbar-item" @click="signOut">Sign Out</a>
							</div>
						</div>
					</div>
				</header>
			</div>
			<div class="hero-body">
				<div class="container">
					<h1 class="title">
						Tennis Court Scheduler
					</h1>
					<h2 class="subtitle">
						Queens Club Gardens
					</h2>
				</div>
			</div>
		</section>
		<div class="section">
			<router-view />
		</div>
		<Notification />
	</div>
</template>
<script>
import firebase from "firebase";
import { mapState } from "vuex";
import Notification from "@/components/Notification.vue";
export default {
	components: {
		Notification
	},
	data() {
		return {
			isActive: false
		};
	},
	methods: {
		signOut() {
			let $this = this;
			firebase
				.auth()
				.signOut()
				.then(function() {
					$this.$store.commit("setUserData", null);
					$this.$router.replace({ name: "SignIn" });
				})
				.catch(function(error) {
					console.log(error);
				});
		}
	},
	computed: mapState(["user", "hasRegisteredAddress"])
};
</script>
<style lang="css">
.hero {
	margin-bottom: 50px;
}
#navbar-make-a-booking:focus,
#navbar-my-bookings:focus,
#navbar-my-account:focus,
.router-link-exact-active {
	background-color: #3abb67;
	color: #fff;
}
.account {
	margin-right: 5px;
	position: relative;
	top: 2px;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
.margin-bottom-50 {
	margin-bottom: 50px;
}
.margin-bottom-10 {
	margin-bottom: 10px;
}
.margin-bottom-5 {
	margin-bottom: 5px;
}

@media only screen and (max-width: 1025px) {
	.account {
		top: 6px;
	}
}
</style>
