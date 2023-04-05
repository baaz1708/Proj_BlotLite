<template>
  <div id="nav" class="nav">
    <router-link to="/" class="brand">Home</router-link>
    <nav class="nav-item">
      <router-link :to="{ name: 'search-user' }" class=" btn btn-light btn-sm me-2" v-if="loggedIn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search me-2 " viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
      </svg>
      Search </router-link>
      <router-link :to="{ name: 'event-create' }" v-if="loggedIn" class=" btn btn-light btn-sm mr-2">Post</router-link> |
      <router-link :to="{ name: 'login' }" v-if="!loggedIn" class=" btn btn-light btn-sm">Login</router-link>
      <button v-else type="button" class=" btn btn-light btn-sm" @click="logout">Logout</button>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed:{
    ...mapGetters('login_user',['loggedIn'])
  },
  methods:{
    logout(){
      console.log('Loggded out')
      this.$store.dispatch('login_user/logout')
    }
  }
}
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: linear-gradient(to right, #16c0b0, #84cf6a);
  color:#0c110e
}
.nav > .brand {
  font-family: 'Montserrat', sans-serif;
  font-weight: 530;
  font-size: 1.3em;
  color: #21412e;
  text-decoration: none;
  padding: 0 20px;
}
 .nav .nav-item{
  box-sizing: border-box;
  margin: 0 10px;
}
</style>
