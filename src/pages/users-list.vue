<template>
  <div id="users-list" class="row">
    <div class="col s12">
      <ul class="collection with-header">
        <li class="collection-header"><h4 class="truncate">Список пользователей программы</h4></li>
        <li class="collection-item row">
          <span class="col m2 hide-on-small-only"><b>Login</b></span>
          <span class="col m5 s8"><b>ФИО</b></span>
          <span class="col m2 s4"><b>Роль</b></span>
          <span class="col m2 hide-on-small-only"><b>Телефон</b></span>
          <span class="col m1 center hide-on-small-only"><b>%</b></span>
        </li>
        <li class="collection-item row item-clicked" v-for="user in users" @click="openUser(user)">
          <span class="col m2 truncate hide-on-small-only">{{user.UserLogin}}</span>
          <span class="col m5 truncate s8">{{user.UserFIO}}</span>
          <span class="col m2 truncate s4">{{user.Role}}</span>
          <span class="col m2 truncate hide-on-small-only">{{user.phone}}</span>
          <span class="col m1 center hide-on-small-only">{{user.procent}}</span>
        </li>
      </ul>
    </div>
    <div class="fixed-action-btn">
      <a class="btn-floating btn-large waves-effect waves-light red" @click="new_user">
        <i class="material-icons">add</i>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'users-list',
    data() {
      return {
        users: []
      }
    },
    methods: {
      openUser(user) {
        this.$root.$emit('user-edit', {
          id: user.idUser
        });
        Materialize.toast(`Открываю пользователя "${user.UserFIO}"`, 1000)
      },
      new_user() {
        Materialize.toast(`Новый пользователь`, 1000)
        this.$root.$emit('user-new');
      }
    },
    mounted() {
      httpGet(`${urlServer}/list-users`, 'json')
        .then(json => {
          console.log(json)
          this.users = json;
        })
        .catch(err => {
          Materialize.toast(err, 5000)
        })
    }
  }
</script>

<style>
  .item-clicked {
    cursor: pointer;
  }
</style>