<template>
  <div id="login_customer" class="row">
    <div class="col m6 offset-m3 s12">
      <div class="card">
        <div class="card-content">
          <div class="row">
            <div class="col s12">
              <div class="card-title"> Вход на сайт для клиента </div>
            </div>
            <div class="col 10 s9">
              <div class="input-field">
                <label for="islogin">Телефон</label>
                <input placeholder="" id="islogin" type="text" v-model="Phone">
              </div>
            </div>
            <div class="col m2 s3">
              <button class="waves-effect waves-teal btn-flat" @click="sendSMS"><i class="fa fa-key" aria-hidden="true"></i></button>
            </div>
            <div class="col 10 s9">
              <div class="input-field">
              <label for="isPass">Пароль</label>
              <input placeholder="" id="isPass" type="text" v-model="Pass">
              </div>
            </div>
            <div class="col m2 s3">
              <button class="waves-effect waves-teal btn" @click="login"><i class="fa fa-sign-in" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login_customer',
    data() {
      return {
        Phone: '79133813105',
        Pass: '111111',
        isFormPass: false
      }
    },
    methods: {
      sendSMS() {
        $.post(`${urlServer}/customer/sendPass/`, {
          Phone: this.Phone
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast(json.message, 1000);
            this.isFormPass = true;
          } else {
            Materialize.toast(json.message, 5000)
            this.Pass = ''
          }
        }).fail((err) => {
          Materialize.toast('Ошибка соединения.', 5000)
        })
      },
      login() {
        $.post(`${urlServer}/customer/login/`, {
          Phone: this.Phone,
          Pass: this.Pass
        }, (json) => {
          if (json.result == 1) {
            Materialize.toast(json.message, 1000);
            this.$parent.dataUser = json;
            window.dataUser = json;
            this.$store.commit('login', json)
            this.$root.$emit('orders-list-customer', json);
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
    }
  }
</script>

<style scoped>
  .card-action {
    padding-top: 16px;
  }
  
  button {
    margin-top: 25px;
  }
</style>