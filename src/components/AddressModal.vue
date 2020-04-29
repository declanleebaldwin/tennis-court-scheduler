<template>
	<div class="modal" :class="{ 'is-active': isModalDisplayed }">
		<div class="modal-background"></div>
		<div class="modal-card">
			<header class="modal-card-head">
				<p v-if="address" class="modal-card-title">Edit Address</p>
				<p v-else class="modal-card-title">Register Address</p>
				<button class="delete" aria-label="close" @click="$emit('hideModal')"></button>
			</header>
			<section class="modal-card-body">
				<div class="columns">
					<div class="column is-one-third">
						<div class="field">
							<label class="label">Building</label>
							<div class="control">
								<div class="select" :class="{ 'is-danger': errors.building }">
									<select v-model="selectedBuildingName" @change="validateBuilding">
										<option v-for="(building, index) in buildings" :key="index">{{
											toUpper(building.name)
										}}</option>
									</select>
								</div>
							</div>
							<p v-show="errors.building" class="help is-danger">Please select a building</p>
						</div>
					</div>
					<div class="column" v-show="selectedBuildingName">
						<div class="field">
							<label class="label">Flat Number</label>
							<div class="control">
								<div class="select" :class="{ 'is-danger': errors.flat }">
									<select v-model="selectedFlat" @change="validateFlat">
										<option v-for="(flat, index) in flats" :key="index">{{ flat }}</option>
									</select>
								</div>
							</div>
							<p v-show="errors.flat" class="help is-danger">Please select a flat</p>
						</div>
					</div>
				</div>
			</section>
			<footer class="modal-card-foot">
				<button
					v-if="address"
					class="button is-success"
					@click="updateAddress"
					:class="{ 'is-loading': loading }"
				>
					Update
				</button>
				<button v-else class="button is-success" @click="registerAddress" :class="{ 'is-loading': loading }">
					Register
				</button>
				<button class="button" @click="showModal = false">Cancel</button>
			</footer>
		</div>
	</div>
</template>
<script>
import db from "@/fb";
import firebase from "firebase";
import { mapState } from "vuex";
export default {
	name: "AddressModal",
	props: ["isModalDisplayed"],
	data() {
		return {
			errors: {
				building: false,
				flat: false
			},
			loading: false,
			selectedBuildingName: null,
			buildings: [],
			flats: [],
			selectedFlat: null
		};
	},
	methods: {
		toUpper(string) {
			return string.charAt(0).toUpperCase() + string.substring(1);
		},
		validateBuilding() {
			if (!this.selectedBuildingName) {
				this.errors.building = true;
			} else {
				this.errors.building = false;
			}
		},
		validateFlat() {
			if (!this.selectedFlat) {
				this.errors.flat = true;
			} else {
				this.errors.flat = false;
			}
		},
		registerAddress() {
			this.validateBuilding();
			this.validateFlat();
			if (!this.errors.building && !this.errors.flat) {
				this.addNewAddress();
			}
			this.$router.push('booking');

		},
		updateAddress() {
			this.validateBuilding();
			this.validateFlat();
			if (!this.errors.building && !this.errors.flat) {
				this.removeOldAddress();
				this.addNewAddress();
			}
		},
		removeOldAddress() {
			let $this = this;
			let oldAddressRef = db.collection("addresses").doc(this.address.id);
			oldAddressRef.update({
				users: firebase.firestore.FieldValue.arrayRemove($this.user.uid)
			});
		},
		addNewAddress() {
			let $this = this;
			this.loading = true;
			var addressRef = db.collection("addresses");
			addressRef
				.where("building", "==", this.selectedBuildingName.toLowerCase())
				.where("flat", "==", parseInt(this.selectedFlat))
				.get()
				.then(function(querySnapshot) {
					querySnapshot.forEach(function(doc) {
						let newAddressRef = db.collection("addresses").doc(doc.id);
						newAddressRef
							.update({	
								users: firebase.firestore.FieldValue.arrayUnion($this.user.uid)
							})
							.then(() => {
								$this.$emit("hideModal");
								$this.loading = false;
								$this.$store.commit("updateNotificationColour", "is-info");
								$this.$store.commit("updateNotificationMessage", "Your address has been updated.");
								$this.$store.commit("updateNotification", true);
							});
					});
				})
				.catch(function(error) {
					$this.$emit("hideModal");
					$this.loading = false;
					$this.$store.commit("updateNotificationColour", "is-danger");
					$this.$store.commit("updateNotificationMessage", "Error getting documents: ", error);
					$this.$store.commit("updateNotification", true);
				});
		}
	},
	computed: mapState(["user", "address"]),
	watch: {
		selectedBuildingName(newBuildingName) {
			let $this = this;
			this.buildings.forEach(building => {
				if (building.name == newBuildingName.toLowerCase()) {
					$this.flats = building.flats;
				}
			});
		}
	},
	mounted() {
		let $this = this;
		db.collection("buildings")
			.get()
			.then(querySnapshot => {
				querySnapshot.forEach(building => {
					$this.buildings.push({
						...building.data()
					});
				});
			})
			.catch(function(error) {
				$this.$store.commit("updateNotificationColour", "is-danger");
				$this.$store.commit("updateNotificationMessage", "Error getting buildings: ", error);
				$this.$store.commit("updateNotification", true);
			});
	}
};
</script>
