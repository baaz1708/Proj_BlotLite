<template>
  <div class="container">
    <div class="row m-4">
      <div class="col-sm-3">
        <div class="profile-image-container">
          <img :src="userdata.user.image_file" alt="Profile Icon" class="img-fluid rounded-circle">
        </div>
      </div>
      <div class="col-sm-9 ">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>@<u>{{ userdata.user.username }}</u></h2>
            <button v-if="id !== $store.state.user.feeduser.id" class="btn btn-outline-primary" @click="toggleFollow">
                {{ isFollowing ? 'Unfollow' : 'Follow' }}
            </button>
        </div>
        <div class="d-flex justify-content-between p-3">
          <p><strong>Posts:</strong> {{ userdata.user.user_posts.length }}</p>
          <p class="mr-3"><strong>Followers:</strong> <a class="clickable" @click="goToFollowers"> {{userdata.user.followers.length }}</a></p>
          <p class="ml-4"><strong>Following:</strong> <a class="clickable" @click="goToFollowing"> {{userdata.user.following.length }}</a></p>
        </div>
      </div>
    </div>
    <hr>
    <div class="row mt-4">
        <div class="col-sm-12">
            <h2>Posts</h2>
            <div class="d-flex flex-wrap" v-if="isFollowing">
                <div v-for="(post, index) in userdata.user.user_posts" :key="index" class="m-1">
                    <img :src="post.feed_image" alt="" style="width: 200px; height: 200px; object-fit: cover;">
                </div>
            </div>
            <div v-else class=" d-flex justify-content-center">
                <i class="fa-solid fa-user-lock fa-2xl me-2"></i>
                <span>follow to unlock posts</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import store from '@/store/store'
function getUserList(routeTo, next) {
    console.log('before dispatch user_list/fetchUsers from getUserList function ')
  store
    .dispatch('user_list/fetchUsers', {
    })
    .then(() => {
      next()
    })
}
function getUserPosts(routeTo, next, id) {
    console.log('before dispatch user/fetchUserPosts from getUserPosts function with id: ', id)
  store
    .dispatch('user/fetchUserPosts', id)
    .then(() => {
      next()
    })
}
export default {
  data() {
    return {
        id: '',
        isFollowing: false,
        userdata:{
            user: {
                username: '',
                email: '',
                image_file: '',
                followers: [],
                following: [],
                user_posts: []
            }
        }
    }
  },
  created() {
  const userdata = JSON.parse(this.$route.query.userdata);
  console.log(
    'after route params profile mmm',
    this.$route.params.id,
    'and userdata.username',
    userdata.username
  );
  this.id = this.$route.params.id;
  this.userdata.user.username = userdata.username;
  this.userdata.user.email = userdata.email;
  this.userdata.user.image_file = userdata.image_file;
  this.userdata.user.followers = userdata.followers;
  this.userdata.user.following = userdata.following;
  this.userdata.user.user_posts = this.$store.state.user.user_posts;
  this.isFollowing = this.$store.state.user.feeduser.following.includes(userdata.username);
},
  beforeRouteEnter(routeTo, routeFrom, next) {
    getUserList(routeTo, next)
    getUserPosts(routeTo, next, routeTo.params.id)
  },
  beforeRouteUpdate(routeTo, routeFrom, next) {
    getUserList(routeTo, next)
    getUserPosts(routeTo, next, this.id)
  },
  methods: {
    toggleFollow() {
      const payload ={
        authorId : this.id,
        userId : this.$store.state.user.feeduser.id
      };
      if (this.isFollowing) {
        console.log('before dispatch unfollowUser', payload)
        this.$store.dispatch('user/unfollowUser', payload);
      } else {
        console.log('before dispatch followUser', payload)
        this.$store.dispatch('user/followUser', payload);
      }
      this.isFollowing = !this.isFollowing;
    },
    goToFollowers() {
        if (this.isFollowing){
            this.$router.push({ name: 'follow_ersORing', params: { id: this.id, follow__: 'followers' }})
        }
    },
    goToFollowing() {
        if (this.isFollowing){
            this.$router.push({ name: 'follow_ersORing', params: { id: this.id, follow__: 'following' }})
        }
    }
}
}
</script>

<style scoped>
/* Add your styles here */
.profile-image-container {
  position: relative;
}
.clickable {
    cursor: pointer;
    text-decoration: none;
    color: black;
}

</style>