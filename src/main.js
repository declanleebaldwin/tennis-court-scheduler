import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./../node_modules/bulma/css/bulma.css";
import store from "./store";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@/fb";

Vue.config.productionTip = false;

Date.prototype.getWeek = function() {
	var date = new Date(this.getTime());
	date.setHours(0, 0, 0, 0);
	// Thursday in current week decides the year.
	date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
	// January 4 is always in week 1.
	var week1 = new Date(date.getFullYear(), 0, 4);
	// Adjust to Thursday in week 1 and count number of weeks from date to week1.
	return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
};

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount("#app");
