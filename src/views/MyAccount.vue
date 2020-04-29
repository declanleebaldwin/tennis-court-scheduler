<template>
	<div class="container">
		<h2 class="title">{{ user.displayName }}</h2>
		<div v-if="address">
			<div class="address-container margin-bottom-10" >
				<p class="has-text-grey is-size-5 is-capitalized">
					Flat {{ address.flat }}, {{ address.building }} Mansions
				</p>
				<i class="material-icons edit-icon" title="Edit" @click="showModal = true">edit</i>
			</div>
			<button class="button is-primary" @click="$router.push('booking')">Make a Booking</button>
		</div>
		<div v-else>
			<p class="has-text-grey margin-bottom-10">Before you can book a court you need to register your address.</p>
			<button class="button is-info" @click="showModal = true">Register Address</button>
		</div>
		<AddressModal :isModalDisplayed="showModal" @hideModal="showModal = false" />
	</div>
</template>
<script>
import { mapState } from "vuex";
import AddressModal from "@/components/AddressModal.vue";

export default {
	name: "MyAccount",
	components: {
		AddressModal
	},
	data() {
		return {
			showModal: false
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
