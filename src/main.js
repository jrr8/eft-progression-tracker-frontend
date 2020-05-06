import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store/store';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import VueAnalytics from 'vue-analytics';

Vue.config.productionTip = false;

Vue.use(VueAnalytics, {
  id: 'UA-164018594-1',
  router
})

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
