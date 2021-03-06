<template>
	<div class="container">
		<h2 class="title">Make a Booking</h2>
		<div class="margin-bottom-50">
			<p class="has-text-grey margin-bottom-10">
				Bookings are released every Monday.<br />
				Each flat can book a one hour time slot in the week (Mon - Fri), and another one hour time slot at the
				weekend (Sat - Sun).
			</p>
			<p class="has-text-info margin-bottom-10">Select a day</p>
			<div class="columns is-gapless">
				<div
					class="column"
					v-for="(weekday, index) in weekdays"
					:key="index"
					@click="selectDay(weekday)"
					:class="{ selected: isSelectedDay(weekday) }"
				>
					<div v-if="isDayInPast(weekday)" class="calendarBoxDayDisabled has-text-grey">
						<div>{{ convertDayShort(weekday.getDay()) }}</div>
						<div class="is-size-3">{{ weekday.getDate() }}</div>
					</div>
					<div v-else class="calendarBoxDay has-text-grey">
						<div>{{ convertDayShort(weekday.getDay()) }}</div>
						<div class="is-size-3">{{ weekday.getDate() }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="margin-bottom-50">
			<p ref="select-time" class="has-text-info margin-bottom-10">Select a time</p>
			<div class="columns is-gapless">
				<div class="column" v-for="(time, index) in times" :key="index">
					<span class="has-text-grey-light">{{ time }}</span>
					<div v-if="isAlreadyBooked(time)" class="alreadyBooked is-centered has-text-grey">
						<span>Booked</span>
					</div>
					<div
						v-else
						class="calenderBoxTime is-centered has-text-grey"
						@click="selectTime(time)"
						:class="{ selected: isSelectedTime(time) }"
					>
						<span v-show="isSelectedTime(time)">Selected</span>
					</div>
				</div>
			</div>
		</div>
		<transition name="fade">
			<div v-show="selectedTime !== null && !hasFlatAlreadyMadeBooking">
				<p class="has-text-info is-size-4 margin-bottom-10">Booking Details</p>
				<p class="has-text-grey margin-bottom-5">
					Your chosen 1 hour slot is {{ formattedDate }}, {{ formattedSelectedTime }}
				</p>
				<button class="button is-success" :class="{ 'is-loading': loading }" @click="bookTimeSlot">
					Book Now
				</button>
			</div>
		</transition>
		<transition name="fade">
			<div v-show="selectedTime != null && hasFlatAlreadyMadeBooking">
				<p class="has-text-info is-size-4 margin-bottom-10">Booking Details</p>
				<p class="has-text-grey margin-bottom-5">
					{{ flatHasAlreadyMadeABookingMessage }}
				</p>
			</div>
		</transition>
	</div>
</template>

<script>
import db from "@/fb";
export default {
	name: "Booking",
	data() {
		return {
			monday: null,
			weekdays: [],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
				"December",
			],
			times: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
			selectedDay: new Date(),
			selectedTime: null,
			bookings: [],
			loading: false,
		};
	},
	methods: {
		scrollMeTo(refName) {
			var element = this.$refs[refName];
			element.scrollIntoView({ behavior: "smooth" });
		},
		getMonday() {
			let date = new Date();
			var day = new Date().getDay() || 7;
			if (day !== 1) date.setHours(-24 * (day - 1));
			return date;
		},
		addDays(date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		},
		convertDayShort(day) {
			return this.daysShort[day];
		},
		convertDayLong(day) {
			return this.daysLong[day];
		},
		convertMonth(month) {
			return this.months[month - 1];
		},
		selectDay(weekday) {
			if (this.isDayInPast(weekday)) return;
			this.scrollMeTo("select-time");
			this.selectedTime = null;
			this.selectedDay = weekday;
		},
		selectTime(time) {
			this.selectedTime = time;
			window.scrollTo({
				top: document.body.scrollHeight,
				left: 0,
				behavior: "smooth",
			});
		},
		isSelectedDay(weekday) {
			if (
				weekday.getFullYear() == this.selectedDay.getFullYear() &&
				weekday.getMonth() === this.selectedDay.getMonth() &&
				weekday.getDay() === this.selectedDay.getDay()
			) {
				return true;
			} else {
				return false;
			}
		},
		isSelectedTime(time) {
			if (time == this.selectedTime) {
				return true;
			} else {
				return false;
			}
		},
		isAlreadyBooked(time) {
			let isAlreadyBooked = false;
			this.bookings.forEach((booking) => {
				if (this.selectedDay.getDay() === booking.day && time === booking.time) {
					isAlreadyBooked = true;
				}
			});
			return isAlreadyBooked;
		},
		bookTimeSlot() {
			this.loading = true;
			let $this = this;
			let timeSlot = {
				day: $this.selectedDay.getDay(),
				time: $this.selectedTime,
				uid: $this.user.uid,
				week: $this.selectedDay.getWeek(),
				year: $this.selectedDay.getFullYear(),
				date: $this.selectedDateTime,
				addressid: $this.address.id,
			};
			db.collection("bookings")
				.add(timeSlot)
				.then(function() {
					$this.$store.commit("updateNotificationColour", "is-info");
					$this.$store.commit("updateNotificationMessage", "Your booking has been successful");
					$this.$store.commit("updateNotification", true);
					$this.selectedTime = null;
					$this.selectedDay = new Date();
					$this.loading = false;
					$this.$router.push('my-bookings');
				})
				.catch(function(error) {
					$this.loading = false;
					$this.$store.commit("updateNotificationColour", "is-danger");
					$this.$store.commit("updateNotificationMessage", "Error adding document: ", error);
					$this.$store.commit("updateNotification", true);
				});
		},
		isDayInPast(weekday) {
			let today = new Date();
			if (today.getDate() > weekday.getDate() && today.getMonth() == weekday.getMonth()) {
				return true;
			} else {
				return false;
			}
		},
	},
	computed: {
		formattedSelectedTime() {
			return this.selectedTime < 10 ? "0" + this.selectedTime + ":00" : this.selectedTime + ":00";
		},
		formattedDate() {
			var day = this.selectedDay.getDay();
			day = this.convertDayLong(day);
			var date = this.selectedDay.getDate();
			var month = this.selectedDay.getMonth() + 1;
			month = this.convertMonth(month);
			var year = this.selectedDay.getFullYear();
			return day + " " + (date <= 9 ? "0" + date : date) + " " + month + " " + year;
		},
		currentWeek() {
			let date = new Date();
			return date.getWeek();
		},
		currentYear() {
			let date = new Date();
			return date.getFullYear();
		},
		user() {
			return this.$store.getters.user;
		},
		address() {
			return this.$store.getters.address;
		},
		selectedDateTime() {
			if (this.selectedTime) {
				let date = new Date(
					this.selectedDay.getFullYear(),
					this.selectedDay.getMonth(),
					this.selectedDay.getDate(),
					this.selectedTime
				);
				return date;
			} else {
				return null;
			}
		},
		hasFlatAlreadyMadeBooking() {
			if (!this.selectedDay) return false;
			let $this = this;
			let hasFlatAlreadyMadeBooking = false;
			if (this.selectedDay.getDay() == 0 || this.selectedDay.getDay() == 6) {
				// check if flat has any bookings on saturday or sunday
				$this.bookings.forEach((booking) => {
					if ($this.address.id == booking.addressid && (booking.day == 6 || booking.day == 0)) {
						hasFlatAlreadyMadeBooking = true;
					}
				});
			} else {
				// check if flat has any bookings on a weekday
				$this.bookings.forEach((booking) => {
					if ($this.address.id == booking.addressid && booking.day < 6 && booking.day > 0) {
						hasFlatAlreadyMadeBooking = true;
					}
				});
			}
			return hasFlatAlreadyMadeBooking;
		},
		flatHasAlreadyMadeABookingMessage() {
			if (this.selectedDay.getDay() == 0 || this.selectedDay.getDay() == 6) {
				return "Your flat has already made a booking in the Saturday to Sunday slot, please try a different one.";
			} else {
				return "Your flat has already made a booking in the Monday to Friday slot, please try a different one.";
			}
		},
	},
	mounted() {
		let $this = this;
		db.collection("bookings")
			.where("week", "==", $this.currentWeek)
			.where("year", "==", $this.currentYear)
			.onSnapshot(function(querySnapshot) {
				querySnapshot.forEach(
					function(booking) {
						$this.bookings.push({
							id: booking.id,
							...booking.data(),
						});
					},
					function(error) {
						$this.$store.commit("updateNotificationColour", "is-danger");
						$this.$store.commit("updateNotificationMessage", "Error getting documents: ", error);
						$this.$store.commit("updateNotification", true);
					}
				);
			});
	},
	created() {
		this.monday = this.getMonday();
		this.weekdays.push(this.monday);
		for (let i = 1; i < 7; i++) {
			this.weekdays.push(this.addDays(this.monday, i));
		}
	},
};
</script>
<style lang="css">
.is-centered {
	display: flex;
	align-items: center;
	justify-content: center;
}
.selected {
	background: #d0f4ff;
}
.alreadyBooked {
	background: rgb(235, 235, 235);
	border: 1px solid lightgrey;
	min-height: 80px;
}
.calendarBoxDay {
	border: 1px solid lightgrey;
	padding: 10px;
	cursor: pointer;
}
.calendarBoxDay:hover,
.calenderBoxTime:hover {
	background: #d0f4ff;
}
.calenderBoxTime {
	border: 1px solid lightgrey;
	min-height: 80px;
	cursor: pointer;
}
.calendarBoxDayDisabled {
	border: 1px solid lightgrey;
	padding: 10px;
	background: rgb(235, 235, 235);
}
</style>
