<template>
  <div class="feed-card -shadow large-margin">
    <router-link
      class="feed-link"
      :to="{ name: 'search-user', params: { id: feed.author.id } }"
    >
      <img :src="feed.author.image_file" alt="User Image" class="rounded-circle article-img" />
      <span class="eyebrow">@{{ feed.timestamp | time }} on {{ feed.timestamp | date }}</span>
    </router-link>
    <div class="d-flex justify-content-between align-items-center">
      <h4 class="author">{{ feed.author.username }}</h4>
      <button v-if="feed.author.id !== $store.state.user.user.id" class="btn btn-outline-primary" @click="toggleFollow">
        {{ isFollowing ? 'Following' : 'Follow' }}
      </button>
    </div>
    <hr />

    <div class="row">
      <div class="col-md-12">
        <img :src="feed.feed_image" alt="" class="feed-image rounded">
      </div>
      <hr>
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="title">{{ feed.title }}</h5>
        <div class="d-flex flex-column align-items-end">
          <i :class="{ 'fas fa-thumbs-up': isLiked, 'far fa-thumbs-up': !isLiked, 'large-icon': true }" @click="toggleLike"></i>
          <span class="likes">{{ feed.likes }} likes</span>
        </div>
      </div>
      <p class="description">{{ feed.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    feed: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLiked: false,
      isFollowing: false
    };
  },
  created() {
    this.isLiked = this.feed.liked_by.includes(this.$store.state.user.user.id);
    this.isFollowing = this.$store.state.user.user.following.includes(this.feed.author.username);
  },
  methods: {
    toggleLike() {
      const payload = {
        postId: this.feed.id,
        userId: this.$store.state.user.user.id
      };
      if (this.isLiked) {
        this.feed.likes--;
        console.log('before dispatch unlikePost', payload)
        this.$store.dispatch('post/unlikePost', payload);
      } else {
        this.feed.likes++;
        console.log('before dispatch likePost', payload)
        this.$store.dispatch('post/likePost', payload);
      }
      this.isLiked = !this.isLiked;
    },
    toggleFollow() {
      const payload ={
        authorId : this.feed.author.id,
        userId : this.$store.state.user.user.id
      };
      if (this.isFollowing) {
        console.log('before dispatch unfollowUser', payload)
        this.$store.dispatch('user/unfollowUser', payload);
      } else {
        console.log('before dispatch followUser', payload)
        this.$store.dispatch('user/followUser', payload);
      }
      this.isFollowing = !this.isFollowing;
    }
  }
};
</script>

<style scoped>
.large-icon {
  font-size: 28px;
}

.large-margin {
  margin-left: 30px;
  margin-right: 30px;
}

.author {
  font-family: cursive;
}

.feed-image {
  height: 320px;
  width: 100%;
  object-fit: contain;
  display: block;
  margin: auto;
}

.-shadow {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.13);
}

.feed-card {
  padding: 20px;
  margin-bottom: 24px;
  transition: all 0.2s linear;
}

.feed-card > .title {
  margin: 0;
}

.feed-link {
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-weight: 100;
  cursor: pointer;
}

.article-img {
  height: 30px;
  width: 30px;
  margin-right: 5px;
}

.far.fa-thumbs-up:hover {
  cursor: pointer;
}

.fas.fa-thumbs-up {
  color: rgb(254, 2, 149);
}

.likes {
  margin-left: 10px;
}
</style>
