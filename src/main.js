import App from './components/App'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store';
import router from './router'

const app = new Vue({
  router,
  store,
  methods: {},
  data: {
    dataUser: { UserRole: 4, Id: 1 },
    links: [
      { url: '/login', title: 'Вход', visible: [4] },
      { url: '/user', title: 'Пользователи', visible: [1] },
      { url: `/profile`, title: 'Профиль', visible: [2] },
      { url: '/order/all', title: 'Все заказы', visible: [1] },
      { url: '/order/actual', title: 'Актуальные заказы', visible: [1, 2] },
      { url: '/order/user', title: 'Мои заказы', visible: [2] },
      { url: '/order/customer', title: 'Мои заказы', visible: [3] },
      { url: '/logout', title: 'Выйти', visible: [1, 2, 3] }
    ]
  },
  created() {
    this.$root.$on('orders-list', res => { router.push({ name: 'orders-list' }) })
    this.$root.$on('orders-list-actual', res => { router.push({ name: 'orders-list-actual' }) })
    this.$root.$on('orders-list-customer', res => { router.push({ name: 'orders-list-customer' }) })
    this.$root.$on('orders-list-user', res => { router.push({ name: 'orders-list-user' }) })

    this.$root.$on('order-info', (res) => { router.push({ name: 'order-info', params: { id: res.id } }) })
    this.$root.$on('order-edit', (res) => { router.push({ name: 'order-edit', params: { id: res.id } }) })
    this.$root.$on('order-drive', (res) => { router.push({ name: 'order-drive', params: { id: res.id } }) })
    this.$root.$on('order-work', (res) => { router.push({ name: 'order-work', params: { id: res.id } }) })
    this.$root.$on('order-final', (res) => { router.push({ name: 'order-final', params: { id: res.id } }) })

    this.$root.$on('users-list', res => { router.push({ name: 'users-list' }) })
    this.$root.$on('user-edit', res => { router.push({ name: 'user-edit', params: { id: res.id } }) })
    this.$root.$on('user-new', res => { router.push({ name: 'user-edit', params: { id: 'new' } }) })
    this.$root.$on('user-pass', res => { router.push({ name: 'user-pass', params: { id: res.id } }) })
    this.$root.$on('index', res => { router.push({ name: 'login' }) })

    this.$store.commit('init');
  },
  el: '#app',
  template: '<App/>',
  components: { App },
  mounted() {
    $.post(`http://books-proger.esy.es/url.php`, function(url) {
      urlServer = url;
    })//*/
  }
})