<template>
  <div id="user-pass" class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <span class="card-title">Смена пароля</span>
          <div class="input-field">
            <input id="last_pass" type="text" placeholder="" data-length="15" v-model="last_pass" v-bind:class="{ validate: valid(last_pass)}">
            <label for="last_pass">Старый пароль</label>
          </div>
          <div class="input-field">
            <input id="new_pass" type="text" placeholder="" data-length="15" v-model="new_pass" v-bind:class="{ validate: valid(new_pass)}">
            <label for="new_pass">Новый пароль</label>
          </div>
          <div class="input-field">
            <input id="new_pass2" type="text" placeholder="" data-length="15" v-model="new_pass2" v-bind:class="{ validate: valid(new_pass2)}">
            <label for="new_pass2">Повторение пароля</label>
          </div>
        </div>
        <div class="card-action">
          <button class="waves-effect waves-teal btn-flat" v-bind:class="{ disabled: false}" @click="back">Назад</button>
          <button class="waves-effect waves-light btn right" @click="update_pass">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'user-pass',
    props: ['id'],
    data() {
      return {
        user: {},
        last_pass: '',
        new_pass: '',
        new_pass2: ''
      }
    },
    methods: {
      update_pass() {
        $.post(`${urlServer}/user/pass`, {
          id: this.id,
          last_pass: this.last_pass,
          new_pass: this.new_pass,
          new_pass2: this.new_pass2
        }, (json) => {
          if (json.result == '1') {
            this.user = json.user;
            this.$root.$emit('user', {
              id: this.id
            });
          } else {
            Materialize.toast(json.message, 5000)
          }
        }).fail(err => {
          Materialize.toast('Ошибка запроса')
        })
      },
      back() {
        this.$root.$emit('user', {
          id: this.user.Id
        });
      },
      valid(pass) {
        if (pass.length > 5 & pass.length < 16) {
          return true;
        }
        return false;
      }
    },
    updated() {},
    mounted() {
      httpGet(`${urlServer}/user/${this.id}`, 'json')
        .then(json => {
          if (json.result == '1') {
            this.user = json.user;
          } else {
            Materialize.toast(json.message, 5000)
          }
          try {
            Materialize.updateTextFields();
            $('input').characterCounter();
          } catch (err) {}
        })
        .catch(err => {
          try {
            Materialize.updateTextFields();
            $('input').characterCounter();
          } catch (err) {}
        })
    }
  }
</script>

<style">

</style>