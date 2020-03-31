import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './../node_modules/bulma/css/bulma.css';
import store from "./store"
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import "@/fb";

Vue.config.productionTip = false


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')


