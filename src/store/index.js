import Vue from 'vue'
import Vuex from '../../static/vuex.js';
import cookie from '../../static/js/cookie.js'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: {}
  },
  mutations: {
    login(state, login) {
      var now = new Date();
      var time = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      state.login = login;
      state.login.time = time;
      localStorage.setItem('login', JSON.stringify(state.login))
    },
    init(state) {
      console.log('state init')
      let dataLogin = localStorage.getItem('login')
      state.login = (dataLogin == undefined) ? { UserRole: 4 } : JSON.parse(dataLogin);
      window.dataUser = state.login
      console.log(dataLogin)
    },
    logout(state) {
      state.login = { UserRole: 4 }
      localStorage.setItem('login', JSON.stringify(state.login))
    }
  }
})