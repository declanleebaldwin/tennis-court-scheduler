<template>
    <div class="container">
        <div class="margin-bottom-50">
            <p class="has-text-grey margin-bottom-10">
                Bookings are released every Monday. Residents can book one hour slot per day.
            </p>
            <p class="has-text-info margin-bottom-10">Select a day</p>
            <div class="columns is-gapless is-mobile">
                <div
                    class="column"
                    v-for="(weekday, index) in weekdays"
                    :key="index"
                    @click="selectedDay = weekday"
                    :class="{ selected: isSelectedDay(weekday) }"
                >
                    <div class="calendarBoxDay has-text-grey">
                        <div>{{ convert(weekday.getDay()) }}</div>
                        <div class="is-size-3">{{ weekday.getDate() }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="margin-bottom-50">
            <p class="has-text-info margin-bottom-10">Select a time</p>
            <div class="columns is-gapless">
                <div class="column" v-for="(time, index) in times" :key="index">
                    <span class="has-text-grey-light">{{ time }}</span>
                    <div v-if="isAlreadyBooked(time)" class="alreadyBooked is-centered has-text-grey">
                        <span>Booked</span>
                    </div>
                    <div
                        v-else
                        class="calenderBoxTime is-centered has-text-grey"
                        @click="selectedTime = time"
                        :class="{ selected: isSelectedTime(time) }"
                    >
                        <span v-show="isSelectedTime(time)">Selected</span>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <p class="has-text-info is-size-4 margin-bottom-10">Booking Details</p>
            <p class="margin-bottom-5">Your chosen 1 hour slot is Sunday 29th March, 10:00</p>
            <button class="button is-success">Book Now</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
    data() {
        return {
            monday: null,
            weekdays: [],
            days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            times: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            selectedDay: new Date(),
            selectedTime: null,
            bookings: [
                {
                    person: {
                        id: 1,
                        name: "Declan Baldwin"
                    },
                    building: {
                        id: 1,
                        name: "Faraday"
                    },
                    flat: 6,
                    time: 13,
                    day: 1
                },
                {
                    person: {
                        id: 1,
                        name: "Declan Baldwin"
                    },
                    building: {
                        id: 1,
                        name: "Faraday"
                    },
                    flat: 6,
                    time: 10,
                    day: 3
                }
            ]
        };
    },
    methods: {
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
        convert(day) {
            return this.days[day];
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
          this.bookings.forEach(booking => {
            if (this.selectedDay.getDay() === booking.day && time === booking.time) {
                isAlreadyBooked = true
            }
          });
          return isAlreadyBooked;
        }
    },
    computed: {},
    created() {
        this.monday = this.getMonday();
        this.weekdays.push(this.monday);
        for (let i = 1; i < 7; i++) {
            this.weekdays.push(this.addDays(this.monday, i));
        }
    }
};
</script>
<style lang="css">
.is-centered {
    display: flex;
    align-items: center;
    justify-content: center;
}
.margin-bottom-50 {
    margin-bottom: 50px;
}
.margin-bottom-10 {
    margin-bottom: 10px;
}
.margin-bottom-5 {
    margin-bottom: 5px;
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
</style>
