<template>
	<div class="container">
		<h2 class="title">{{ user.displayName }}</h2>
		<div class="address-container" v-if="hasRegisteredAddress && address">
			<p class="has-text-grey is-size-5 is-capitalized">
				Flat {{ address.flat }}, {{ address.building }} Mansions
			</p>
			<i class="material-icons edit-icon" title="Edit" @click="showModal = true">edit</i>
		</div>
		<div v-else>
			<p class="has-text-grey margin-bottom-10">Before you can book a court you need to register your address.</p>
			<button class="button is-info" @click="showModal = true">Register Address</button>
		</div>
		<AddressModal @getUsersAddress="getAddress" :address="address" :isModalDisplayed="showModal" @hideModal="showModal = false" />
	</div>
</template>
<script>
import db from "@/fb";
import { mapState } from "vuex";
import AddressModal from "@/components/AddressModal.vue";

export default {
	name: "MyAccount",
	components: {
		AddressModal
	},
	data() {
		return {
			address: null,
			showModal: false
		};
	},
	methods: {
		getAddress() {
			let $this = this;
			db.collection("addresses")
				.where("users", "array-contains", $this.user.uid)
				.onSnapshot(
					function(querySnapshot) {
						querySnapshot.forEach(function(address) {
							$this.address = {
								id: address.id,
								...address.data()
							};
						});
					},
					function(error) {
						$this.$store.commit("updateNotificationColour", "is-danger");
						$this.$store.commit("updateNotificationMessage", "Error getting address: ", error);
						$this.$store.commit("updateNotification", true);
					}
				);
		}
	},
	computed: mapState(["user", "hasRegisteredAddress"]),
	mounted() {
		this.getAddress();
	}
};
</script>
<style lang="css">
.address-container {
	display: flex;
	align-items: center;
}
.edit-icon {
	margin-left: 10px;
	cursor: pointer;
}
.edit-icon:hover {
	color: #48c774;
}
</style>
