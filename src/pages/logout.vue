<template>
  <div id="app" class="row">
    <div class="col s8 offset-s2">
      <div class="card">
        <div class="card-content">
          <span class="card-title">Выйти из системы</span>
          <p>{{msg}}</p>
          <p>&nbsp;</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'logout',
    data() {
      return {
        msg: ''
      }
    },
    methods: {},
    updated() {},
    mounted() {
      this.msg = 'Успешный выход из системы';
      this.$store.commit('logout');
      this.$root.$emit('index');
    }
  }
</script>

<style>

</style>