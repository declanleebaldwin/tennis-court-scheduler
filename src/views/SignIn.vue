<template>
	<div class="container">
		<button class="button is-link" @click="signIn">Sign In</button>
	</div>
</template>

<script>
import firebase from "firebase";

export default {
	name: "SignIn",
	methods: {
		signIn() {
			let $this = this;
			var provider = new firebase.auth.GoogleAuthProvider();
			if (!this.authenticated) {
				firebase
					.auth()
					.signInWithPopup(provider)
					.then(function() {
						// $this.token = result.credential.accessToken;
						// $this.user = result.user;
						$this.$router.replace({ name: "Booking" });
					})
					.catch(function(error) {
						console.log(error);
					});
			}
		}
	},
};
</script>
