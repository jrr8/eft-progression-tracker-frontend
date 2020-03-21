import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import LandingPage from '../views/LandingPage.vue';
import Features from '../views/Features.vue';
import HideoutItemList from '../views/HideoutItemList.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/features',
    name: 'Features',
    component: Features,
  },
  {
    path: '/home',
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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});


export default router;
