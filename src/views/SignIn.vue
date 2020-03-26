<template>
	<div class="container">
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
					// $this.token = result.credential.accessToken;
					$this.$store.commit("setUserData", {
						displayName: result.user.displayName,
						email: result.user.email
					});

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
