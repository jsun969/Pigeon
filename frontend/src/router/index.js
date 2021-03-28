import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import History from '../views/History.vue';
import Add from '../views/Add.vue';
import Setting from '../views/Setting.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/history',
    name: 'History',
    component: History,
  },
  {
    path: '/add',
    name: 'Add',
    component: Add,
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/History.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
