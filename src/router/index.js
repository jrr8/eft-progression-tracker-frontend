import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import LandingPage from '../views/LandingPage.vue';
import Features from '../views/Features.vue';
import HideoutItemList from '../views/HideoutItemList.vue'
import About from '../views/About.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/hideoutItemList',
    name: 'HideoutItemList',
    component: HideoutItemList
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});


export default router;
