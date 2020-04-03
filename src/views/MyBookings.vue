<template>
	<div class="container">
		<h2 class="title">My Bookings</h2>
		<div>
			<p class="has-text-info margin-bottom-10">Please find below your bookings for this week</p>
			<div class="columns" v-for="booking in bookings" :key="booking.id">
				<div class="column is-half" >
					<div class="card booking-container">
						<div class="card-content booking-datetime">{{ formattedDate(booking.date) }}, {{ formattedTime(booking.time) }}</div>
						<button class="button is-danger">Cancel</button>
					</div>
				</div>
			</div>
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
			]
		};
	},
	methods: {
		formattedTime(time) {
			return time < 10 ? "0" + time + ":00" : time + ":00";
		},
		formattedDate(bookingDateMilliSeconds) {
			var bookingDate = new Date(bookingDateMilliSeconds);
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
		}
	},
	computed: {
		user() {
			return this.$store.getters.user;
		}
	},
	mounted() {
		let $this = this;
		db.collection("bookings")
			.where("uid", "==", $this.user.uid)
			.onSnapshot(function(querySnapshot) {
				querySnapshot.forEach(
					function(booking) {
						$this.bookings.push({
							id: booking.id,
							...booking.data()
						});
					},
					function(error) {
						console.log("Error getting documents: ", error);
					}
				);
			});
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
