<template>
  <div id="app" class="row">
    <router-view name="nav" :links="this.$root.links"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        msg: ''
      }
    },
    methods: {},
    updated() {},
    mounted() {}
  }
</script>

<style>

</style>