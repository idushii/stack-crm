<template>
  <nav id="nav" class="white black-text">
    <div class="nav-wrapper">
      <a href="#" class="brand-logo left">&nbsp;&nbsp;<img src="static/images/logo.png" width="50px"></a>
      <ul id="nav-list" class="right">
        <li v-for="link in links"><router-link v-bind:to="getUrl(link)" class="black-text" v-if="visible(link)">{{getTitle(link)}}</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'nav',
    props: ['links'],
    data() {
      return {}
    },
    mounted() {
      console.log(this.links)
    },
    methods: {
      getUrl(link) {
        return link.url ? link.url : link
      },
      getTitle(link) {
        return link.title ? link.title : link.replace('/', ' ')
      },
      visible(link) {
        let login = this.$store.state.login;
        let datauser = this.datauser;
        if (login && login.length) {
          datauser = login;
        }
        for (let i = 0; i < link.visible.length; i++) {
          if (link.visible[i] == datauser.UserRole) {
            return true;
          }
        }
        return false;
      }
    },
    computed: {
      datauser() {
        return this.$store.state.login
      } //*/
    }

  }
</script>

<style>
  img {
    margin-top: 5px;
  }
  
  .router-link-active {
    background-color: rgba(255, 50, 50, 0.2)
  }
  
  nav ul a:hover {
    background-color: rgba(255, 50, 50, 0.3)
  }
</style>