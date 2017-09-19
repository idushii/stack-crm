<template>
  <div id="login" class="row">
    <div class="col m6 offset-m3 s12">
      <div class="card">
        <div class="card-content">
          <span class="card-title">Вход на сайт для мастеров</span>
            <div class="input-field">
              <label for="islogin">Логин</label>
              <input placeholder="" id="islogin" type="text" v-model="Login" @keyup.enter="loginSend">
            </div>
            <div class="input-field">
              <label for="is_pwd">Пароль</label>
              <input placeholder="" id="is_pwd" type="password" v-model="Pass" @keyup.enter="loginSend">
            </div>
        </div>
        <div class="card-action">
          <button class="btn" @click="loginSend">Войти</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        Login: '',
        Pass: ''
      }
    },
    methods: {
      loginSend() {
        let this_ = this;
        $.post(`${urlServer}/user/login`, {
          Login: this.Login,
          Pass: this.Pass
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast('Успешный вход', 1000);
            Materialize.toast('Последний вход: ' + this.$store.state.login.time, 1000);
            this.$store.commit('login', json)
            this_.$parent.dataUser = json;
            window.dataUser = json;
            if (json.UserRole == 1) {
              this.$root.$emit('users-list', json);
            }
            if (json.UserRole == 2) {
              this.$root.$emit('orders-list-actual', json);
            }
            /*if (json.UserRole == 3) {
              this.$root.$emit('orders-list-customer', json);
            }//*/
          } else {
            Materialize.toast(json.message, 5000)
            this.Pass = ''
          }
        }).fail((err) => {
          Materialize.toast('Ошибка соединения.', 5000)
        })
      }
    },
    mounted() {
      console.log('mounted');
      try {
        Materialize.updateTextFields();
      } catch (err) {}
      let login = this.$store.state.login;
      if (login) {
        this.Login = login.UserLogin;
        this.Pass = '';
      }
    }
  }
</script>

<style>
  .card-action {
    padding-top: 16px;
  }
</style>