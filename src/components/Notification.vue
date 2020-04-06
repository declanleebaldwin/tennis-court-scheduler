<template>
	<transition name="fade">
		<section v-show="showNotification" class="notification-container">
			<div class="notification is-light" :class="notificationColour">
				<button @click="hideNotification" class="delete"></button>
				{{ notificationMessage }}
			</div>
		</section>
	</transition>
</template>

<script>
import { mapState } from "vuex";

export default {
	name: "Notification",
	methods: {
		hideNotification() {
			this.$store.commit("updateNotification", false);
		}
	},
	computed: mapState(["showNotification", "notificationMessage", "notificationColour"]),
	watch: {
		showNotification() {
			if (this.showNotification) {
				let $this = this;
				setTimeout(() => {
					$this.$store.commit("updateNotification", false);
				}, 2000);
			}
		}
	}
};
</script>
<style lang="css" scoped>
.notification-container {
	position: fixed;
	bottom: 5%;
	width: 100%;
	display: flex;
	justify-content: center;
}
.notification {
	width: 350px;
	text-align: center;
}
</style>
