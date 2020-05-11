<template>
	<div class="container">
		<p class="has-text-grey margin-bottom-10">
			Welcome to Queens Club Gardens Tennis Scheduler, please sign in to book a tennis court.
		</p>
		<button class="button is-link" :class="{ 'is-loading': loading }" @click="signIn">Sign In</button>
	</div>
</template>

<script>
import firebase from "firebase";
import { mapState } from "vuex";
export default {
	name: "SignIn",
	data() {
		return {
			loading: false
		};
	},
	methods: {
		signIn() {
			this.loading = true;
			let $this = this;
			var provider = new firebase.auth.GoogleAuthProvider();
			firebase
				.auth()
				.signInWithPopup(provider)
				.then(function(result) {
					$this.loading = false;
					$this.$store.commit("setUserData", {
						uid: result.user.uid,
						displayName: result.user.displayName,
						email: result.user.email
					});
					// check if user's email is a registered Queens Club Gardens member
					$this.$router.push('my-account');
				})
				.catch(function(error) {
					$this.loading = false;
					$this.$store.commit("updateNotificationColour", "is-danger");
					$this.$store.commit("updateNotificationMessage", "Error Signing In: ", error);
					$this.$store.commit("updateNotification", true);
				});
		}
	},
	computed: mapState(["user"])
};
</script>

<style lang="css">
.margin-bottom-10 {
	margin-bottom: 10px;
}
</style>
