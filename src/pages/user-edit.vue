<template>
  <div id="user" class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <span class="card-title truncate" v-if="user.UserFIO">Пользователь "{{user.UserFIO}}"</span>
          <span class="card-title truncate" v-if="!user.UserFIO">Новый пользователь</span>
          <div class="row">
            <div class="input-field col s12">
              <input placeholder="ФИО" id="UserFIO" type="text" v-model="user.UserFIO">
              <label for="UserFIO">ФИО</label>
            </div>
            <div class="input-field col m6 s12">
              <input placeholder="Login" id="UserLogin" type="text" v-model="user.UserLogin">
              <label for="UserLogin">Login</label>
            </div>
            <div class="input-field col m6 s12">
              <select v-model="user.UserRole">
                <option v-for="role in roles" :value="role.Id">{{role.Title}}</option>
              </select>
              <label>Выберите роль</label>
            </div>
            <div class="input-field col m6 s12">
              <input placeholder="Телефон" id="phone" type="text" v-model="user.phone">
              <label for="phone">Телефон</label>
            </div>
            <div class="input-field col m6 s12">
              <input placeholder="Telegram" id="UserTelegram" type="text" v-model="user.UserTelegram">
              <label for="UserTelegram">Telegram</label>
            </div>
            <div class="input-field col m6 s12">
              <input placeholder="Процент" id="procent" type="text" v-model="user.procent">
              <label for="procent">Процент</label>
            </div>
            <div class="input-field col m6 s12">
              <input placeholder="Сумма" id="Sum" type="text" v-model="user.Sum" v-bind:disabled="!this.id" >
              <label for="Sum">Сумма</label>
            </div>
            <div class="input-field col s12">
              <textarea id="Remark" class="materialize-textarea" v-model="user.Remark" placeholder=""></textarea>
              <label for="Remark">Примечание</label>
            </div>
          </div>
        </div>
        <div class="card-action row">
          <button class="waves-effect waves-teal btn-flat col" @click="remove" v-bind:class="{ disabled: !this.id || this.id == 'new' }">Удалить</button>
          <button class="waves-effect waves-light btn right col" @click="save">Сохранить</button>
        </div>
      </div>
    </div>
  <div class="fixed-action-btn toolbar" v-if="this.id != 'new'">
    <a class="btn-floating btn-large red">
      <i class="large material-icons">view_headline</i>
    </a>
    <ul>
      <li class="waves-effect waves-light" @click="change_pass"><a>Сменить пароль</a></li>
      <li class="waves-effect waves-light" v-if="this.id & this.id != 'new'"><a>Выдать деньги</a></li>
    </ul>
  </div>

  </div>
</template>

<script>
  export default {
    name: 'user',
    props: ['id'],
    data() {
      return {
        user: {},
        roles: {}
      }
    },
    methods: {
      save() {
        console.log('save');
        $.post(`${urlServer}/user/${this.id || this.idProfile}`, {
          user: this.user
        }, json => {
          if (json.result == 1) {
            if (this.id == 'new') {
              Materialize.toast('Переход к форме создания пароля', 1000)
              this.$root.$emit('users-list', {
                id: json.Id
              });
            } else {
              if (this.id) {
                this.$root.$emit('users-list');
              } else {

              }
            }
            Materialize.toast('Успешное сохранение', 1000)
          } else {
            Materialize.toast(json.message, 1000)
          }
        }).fail(err => {
          Materialize.toast(err, 5000)
        })
      },
      remove() {
        console.log('remove');
        $.post(`${urlServer}/user/remove`, {
          user: this.user
        }, json => {
          if (json.result == 1) {
            this.$root.$emit('users-list');
            Materialize.toast('Успешное удаление', 1000)
          } else {
            Materialize.toast(json.message, 1000)
          }
        }).fail(err => {
          Materialize.toast(err, 5000)
        })
      },
      change_pass() {
        this.$root.$emit('user-pass', {
          id: this.user.Id
        });
      }
    },
    updated() {
      try {
        $('select').material_select();
      } catch (err) {}
    },
    mounted() {
      if (!this.id) {
        this.idProfile = 1
      }
      httpGet(`${urlServer}/user/${this.id || this.idProfile}`, 'json')
        .then(json => {
          if (json.result == '1') {
            this.user = json.user;
            this.roles = json.roles;
          } else {
            Materialize.toast(json.message, 5000)
          }
          try {
            Materialize.updateTextFields();
            $('select').material_select();
            $('#Remark').trigger('autoresize');
          } catch (err) {}
        })
        .catch(err => {
          Materialize.toast(err, 5000)
          try {
            Materialize.updateTextFields();
            $('select').material_select();
            $('#Remark').trigger('autoresize');
          } catch (err) {}
        })
    }
  }
</script>

<style>
  .card .card-content {
    padding-bottom: 0px;
  }
  
  .card .card-action {
    padding-top: 16px;
  }
</style>