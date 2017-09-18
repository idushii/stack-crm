import Vue from 'vue'
import Router from 'vue-router'
import nav from '../components/nav.vue'
import App from '../components/App.vue'
import login from '../pages/login.vue'
import login_customer from '../pages/login_customer.vue'
import orders_list from '../pages/orders-list.vue'
import order from '../pages/order-edit.vue'
import order_info from '../pages/order-info.vue'
import final from '../pages/order-final.vue'
import drive from '../pages/order-drive.vue'
import work from '../pages/order-work.vue'
import users_list from '../pages/users-list.vue'
import user_edit from '../pages/user-edit.vue'
import user_pass from '../pages/user-pass.vue'
import logout from '../pages/logout.vue' //*/

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/login/user' },
    { path: '/app', component: App},
    {
      path: '/login/user',
      components: {
        default: login,
        nav: nav
      }
    },
    {
      path: '/login',
      name: 'login',
      components: {
        default: login_customer,
        nav: nav
      }
    },
    {
      path: '/order/all',
      name: 'orders-list',
      components: {
        default: orders_list,
        nav: nav
      }
    },
    {
      path: '/order/actual',
      name: 'orders-list-actual',
      components: {
        default: orders_list,
        nav: nav
      },
      props: { default: { status: 'actual' }, nav: true }
    },
    {
      path: '/order/user',
      name: 'orders-list-user',
      components: {
        default: orders_list,
        nav: nav
      },
      props: { default: { status: 'user' }, nav: true }
    },
    {
      path: '/order/customer',
      name: 'orders-list-customer',
      components: {
        default: orders_list,
        nav: nav
      },
      props: { default: { status: 'customer' }, nav: true }
    },
    {
      path: '/order/:id',
      name: 'order-edit',
      components: {
        default: order,
        nav: nav
      },
      props: { default: true, nav: true }
    },
    {
      path: '/order/final/:id',
      name: 'order-final',
      components: {
        default: final,
        nav: nav
      },
      props: { default: true, nav: true }
    },
    {
      path: '/order/drive/:id',
      name: 'order-drive',
      components: {
        default: drive,
        nav: nav
      },
      props: { default: true, nav: true }
    },
    {
      path: '/order/work/:id',
      name: 'order-work',
      components: {
        default: work,
        nav: nav
      },
      props: { default: true, nav: true }
    },
    {
      path: '/order/info/:id',
      name: 'order-info',
      components: {
        default: order_info,
        nav: nav
      },
      props: { default: true, nav: true }
    },
    {
      path: '/user',
      name: 'users-list',
      components: {
        default: users_list,
        nav: nav
      },
      props: { default: true, nav: true }
    },
    {
      path: '/user/:id',
      name: 'user-edit',
      components: {
        default: user_edit,
        nav: nav
      },
      props: { default: true, nav: true }
    },
    {
      path: '/user/:id/pass',
      name: 'user-pass',
      components: {
        default: user_pass,
        nav: nav
      },
      props: { default: true, nav: true }
    },
    {
      path: '/profile',
      name: 'profile',
      components: {
        default: user_edit,
        nav: nav
      },
      props: { default: true, nav: true }
    },
    {
      path: '/logout',
      name: 'logout',
      components: {
        default: logout,
        nav: nav
      },
      props: { default: true, nav: true }
    }
  ]
});