<template>
	<div class="container">
		<h2 class="title">My Bookings</h2>
		<div v-if="bookings.length > 0">
			<p class="has-text-info margin-bottom-10">Your bookings for this week.</p>
			<div class="columns" v-for="booking in bookings" :key="booking.id">
				<div class="column is-half">
					<div class="card booking-container">
						<div class="card-content booking-datetime">
							{{ formattedDate(booking.date) }}, {{ formattedTime(booking.time) }}
						</div>
						<button
							class="button is-danger"
							:class="{ 'is-loading': loading }"
							@click="removeBooking(booking.id)"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
		<div v-else>
			<p class="has-text-info margin-bottom-10">You currently have no bookings for this week.</p>
		</div>
	</div>
</template>

<script>
import db from "@/fb";

export default {
	name: "MyBookings",
	data() {
		return {
			bookings: [],
			previousBookings: [],
			daysLong: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			months: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			],
			loading: false
		};
	},
	methods: {
		formattedTime(time) {
			return time < 10 ? "0" + time + ":00" : time + ":00";
		},
		formattedDate(bookingDateObject) {
			var bookingDate = new Date(bookingDateObject.seconds * 1000);
			var day = bookingDate.getDay();
			day = this.convertDayLong(day);
			var date = bookingDate.getDate();
			var month = bookingDate.getMonth() + 1;
			month = this.convertMonth(month);
			var year = bookingDate.getFullYear();
			return day + " " + (date <= 9 ? "0" + date : date) + " " + month + " " + year;
		},
		convertMonth(month) {
			return this.months[month - 1];
		},
		convertDayLong(day) {
			return this.daysLong[day];
		},
		removeBooking(bookingID) {
			this.loading = true;
			let $this = this;
			db.collection("bookings")
				.doc(bookingID)
				.delete()
				.then(function() {
					$this.loading = false;
					$this.getBookings();
					$this.$store.commit("updateNotificationColour", "is-info");
					$this.$store.commit("updateNotificationMessage", "Your booking has been cancelled.");
					$this.$store.commit("updateNotification", true);
				})
				.catch(function(error) {
					$this.loading = false;
					$this.$store.commit("updateNotificationColour", "is-danger");
					$this.$store.commit("updateNotificationMessage", "Error removing document: ", error);
					$this.$store.commit("updateNotification", true);
				});
		},
		getBookings() {
			let $this = this;
			db.collection("bookings")
				.where("uid", "==", $this.user.uid)
				.where("week", "==", $this.currentWeek)
				.where("year", "==", $this.currentYear)
				.onSnapshot(function(querySnapshot) {
					$this.bookings = [];
					querySnapshot.forEach(
						function(booking) {
							$this.bookings.push({
								id: booking.id,
								...booking.data()
							});
						},
						function(error) {
							$this.$store.commit("updateNotificationColour", "is-danger");
							$this.$store.commit("updateNotificationMessage", "Error getting documents: ", error);
							$this.$store.commit("updateNotification", true);
						}
					);
				});
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		},
		currentWeek() {
			let date = new Date();
			return date.getWeek();
		},
		currentYear() {
			let date = new Date();
			return date.getFullYear();
		}
	},
	mounted() {
		this.getBookings();
	}
};
</script>

<style lang="css" scoped>
.booking-container {
	display: flex;
	align-items: center;
}
.booking-datetime {
	flex-grow: 1;
}
.button {
	margin-right: 1.5rem;
}
</style>
