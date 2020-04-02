<template>
	<div id="app">
		<section class="hero is-success">
			<div class="hero-head">
				<header class="navbar">
					<div class="container">
						<div class="navbar-brand">
							<span class="navbar-burger burger" data-target="navbarMenuHeroC">
								<span></span>
								<span></span>
								<span></span>
							</span>
						</div>
						<div v-if="user" id="navbarMenuHeroC" class="navbar-menu">
							<div class="navbar-end">
								<router-link id="navbar-make-a-booking" class="navbar-item" to="/admin"
									>Admin</router-link
								>
								<router-link id="navbar-make-a-booking" class="navbar-item" to="/booking"
									>Make a Booking</router-link
								>
								<router-link id="navbar-my-bookings" class="navbar-item" to="/my-bookings"
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
		<router-view />
	</div>
</template>
<script>
import firebase from "firebase";
import { mapState } from "vuex";

export default {
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
	computed: mapState(["user"])
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
</style>
