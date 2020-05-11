<template>
	<div class="modal" :class="{ 'is-active': isModalDisplayed }">
		<div class="modal-background"></div>
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">Remove Account</p>
				<button class="delete" aria-label="close" @click="hideModal"></button>
			</header>
			<section class="modal-card-body">
				<div class="columns">
					<div class="column">
						<p>Are you sure you want to remove your account, all your bookings will be lost.</p>
					</div>
				</div>
			</section>
			<footer class="modal-card-foot">
				<button class="button is-danger" @click="removeAccount" :class="{ 'is-loading': loading }">
					Remove Account
				</button>
				<button class="button" @click="hideModal">Cancel</button>
			</footer>
		</div>
	</div>
</template>
<script>
import db from "@/fb";
import firebase from "firebase";
import { mapState } from "vuex";
import axios from "axios";

export default {
	name: "RemoveAccountModal",
	props: ["isModalDisplayed"],
	data() {
		return {
			loading: false,
			token: null,
		};
	},
	methods: {
		hideModal() {
			this.$emit("hideRemoveAccountModal");
		},
		async removeAccount() {
			this.loading = true;
			try {
				// await this.removeAddress();
				// await this.removeBookings();
				let config = {
					headers: { authorization: "Bearer " + this.token },
				};
				await axios.post(
					"https://us-central1-tennis-court-scheduler.cloudfunctions.net/app/deleteUser",
					this.user,
					config
				);
				this.loading = false;
				this.hideModal();
				this.signOut()
			} catch (error) {
				console.log(error);
				this.loading = false;
				this.$store.commit("updateNotificationColour", "is-danger");
				this.$store.commit("updateNotificationMessage", "Error removing account: ", error);
				this.$store.commit("updateNotification", true);
			}
		},
		removeAddress() {
			let $this = this;
			let oldAddressRef = db.collection("addresses").doc(this.address.id);
			return new Promise((resolve, reject) => {
				oldAddressRef
					.update({
						users: firebase.firestore.FieldValue.arrayRemove($this.user.uid),
					})
					.then(() => {
						resolve();
					})
					.catch(() => {
						console.log("remove address error");
						reject();
					});
			});
		},
		removeBookings() {
			let $this = this;
			return new Promise((resolve, reject) => {
				db.collection("bookings")
					.where("uid", "==", $this.user.uid)
					.get()
					.then(function(querySnapshot) {
						querySnapshot.forEach(function(doc) {
							doc.ref.delete().then(() => resolve());
						});
					})
					.catch(() => {
						console.log("remove bookings error");
						reject();
					});
			});
		},
		signOut() {
			let $this = this;
			firebase
				.auth()
				.signOut()
				.then(() => {
					$this.$store.commit("setUserData", null);
					$this.$router.replace({ name: "SignIn" });
				})
		},
	},
	computed: mapState(["user", "address"]),
	mounted() {
		let $this = this;
		firebase
			.auth()
			.currentUser.getIdToken(/* forceRefresh */ true)
			.then(function(idToken) {
				$this.token = idToken;
			})
			.catch(function(error) {
				console.log(error);
			});
	},
};
</script>
