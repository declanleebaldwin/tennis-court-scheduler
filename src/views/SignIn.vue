<template>
	<div class="container">
		<p class="has-text-grey margin-bottom-10">Welcome to Queens Club Gardens Tennis Scheduler, please sign in to book a tennis court.</p>
		<button class="button is-link" @click="signIn">Sign In</button>
	</div>
</template>

<script>
import firebase from "firebase";
import { mapState } from 'vuex';
export default {
	name: "SignIn",
	methods: {
		signIn() {
			let $this = this;
			var provider = new firebase.auth.GoogleAuthProvider();
			firebase
				.auth()
				.signInWithPopup(provider)
				.then(function(result) {
					console.log(result.user);
					// $this.token = result.credential.accessToken;
					$this.$store.commit("setUserData", {
						uid: result.user.uid,
						displayName: result.user.displayName,
						email: result.user.email
					});
					// check if user's email is a registered Queens Club Gardens member
					$this.$router.replace({ name: "Booking" });
				})
				.catch(function(error) {
					console.log(error);
				});
		}
	},
	computed: mapState([
        'user'
    ]),
};
</script>

<style lang="css">
.margin-bottom-10 {
	margin-bottom: 10px;
}
</style>
