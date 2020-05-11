<template>
	<div class="container">
		<h2 class="title">{{ user.displayName }}</h2>
		<div v-if="address">
			<div class="address-container margin-bottom-10" >
				<p class="has-text-grey is-size-5 is-capitalized">
					Flat {{ address.flat }}, {{ address.building }} Mansions
				</p>
				<!-- <i class="material-icons edit-icon" title="Edit" @click="showModal = true">edit</i> -->
			</div>
			<button class="button is-success margin-right-25" @click="$router.push('booking')">Make a Booking</button>
			<button class="button is-danger" @click="showRemoveAccountModal = true">Remove Account</button>
		</div>
		<div v-else>
			<p class="has-text-grey margin-bottom-10">Before you can book a court you need to register your address.</p>
			<button class="button is-info" @click="showAddressModal = true">Register Address</button>
		</div>
		<AddressModal :isModalDisplayed="showAddressModal" @hideAddressModal="showAddressModal = false" />
		<RemoveAccountModal :isModalDisplayed="showRemoveAccountModal" @hideRemoveAccountModal="showRemoveAccountModal = false" />
	</div>
</template>
<script>
import { mapState } from "vuex";
import AddressModal from "@/components/AddressModal.vue";
import RemoveAccountModal from "@/components/RemoveAccountModal.vue";

export default {
	name: "MyAccount",
	components: {
		AddressModal,
		RemoveAccountModal
	},
	data() {
		return {
			showAddressModal: false,
			showRemoveAccountModal: false
		};
	},
	computed: mapState(["user", "address"]),
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
