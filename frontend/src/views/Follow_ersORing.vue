<template>
<div class="container m-5">
  <div class="input-group mb-3 ">
    <span class="input-group-text" id="user">@</span>
    <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="user" v-model="search">
  </div>
  <UserCard v-for="user in filteredList" :key="user.id" :user="user" />
</div>
</template>

<script>
import store from '@/store/store'
import UserCard from '@/components/UserCard'

function getUserList(routeTo, next) {
  store
    .dispatch('user_list/fetchUsers', {
    })
    .then(() => {
      next()
    })
}
export default {
  components: {
    UserCard
  },
  data() {
    return {
     search: '',
    }
  },
  methods: {
    
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    getUserList(routeTo, next)
  },
  beforeRouteUpdate(routeTo, routeFrom, next) {
    getUserList(routeTo, next)
  },
  computed: {
    user_list() {
        let userid= this.$route.params.id;
        let follow__= this.$route.params.follow__;
        let users= this.$store.state.user_list.users;
        let user = users.find(user => user.id === userid);
        if (follow__ === 'followers') {
            return users.filter(u => user.followers.includes(u.username));
        } else {
            return users.filter(u => user.following.includes(u.username));
        }
    },
    filteredList() {
     if (this.search === "") {
        return this.user_list;
      }
      return this.user_list.filter((user) =>
        user.username.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  }
}
</script>
