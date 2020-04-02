<template>
	<div class="container">
		<h2 class="title">{{ user.displayName }}</h2>
		<div class="address-container" v-if="address">
			<p class="has-text-grey is-size-5 is-capitalized">
				Flat {{ address.flat }}, {{ address.building }} Mansions
			</p>
			<i class="material-icons edit-icon" title="Edit" @click="showModal = true">edit</i>
		</div>
		<div class="modal" :class="{ 'is-active': showModal }">
			<div class="modal-background"></div>
			<div class="modal-card">
				<header class="modal-card-head">
					<p class="modal-card-title">Edit Address</p>
					<button class="delete" aria-label="close" @click="showModal = false"></button>
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
					<button class="button is-success" @click="updateAddress" :class="{ 'is-loading': loading }">
						Update
					</button>
					<button class="button" @click="showModal = false">Cancel</button>
				</footer>
			</div>
		</div>
	</div>
</template>
<script>
import db from "@/fb";
import firebase from "firebase";
import { mapState } from "vuex";

export default {
	name: "MyAccount",
	data() {
		return {
			buildings: [],
			flats: [],
			address: null,
			selectedBuildingName: null,
			selectedFlat: null,
			showModal: false,
			errors: {
				building: false,
				flat: false
			},
			loading: false
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
								$this.showModal = false;
								$this.loading = false;
							});
					});
				})
				.catch(function(error) {
					console.log("Error getting documents: ", error);
				});
		}
	},
	computed: mapState(["user"]),
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
		db.collection("addresses")
			.where("users", "array-contains", $this.user.uid)
			.onSnapshot(function(querySnapshot) {
				querySnapshot.forEach(function(address) {
					$this.address = {
						id: address.id,
						...address.data()
					};
				}, function(error) {
                    console.log("Error getting documents: ", error)
                });
            })
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
				console.log("Error getting documents: ", error);
			});
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
