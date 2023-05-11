<!-- generated using vbase snippet (vbase + tab)  -->
<template>
  <router-link
    class="feed-link"
    :to="{ name: 'search-user', params: { id: feed.id } }"
  >
    <div class="feed-card -shadow">
      <span class="eyebrow">@{{ feed.author.id }} on {{ feed.date_posted | date }}</span>
      <h4 class="title">{{ feed.title }}</h4>
      <img :src="feed.author.image_file" alt="User Image" class=" rounded-circle article-img"/>
      <BaseIcon name="users">{{ feed.user_id }} attending</BaseIcon>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    feed: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.-shadow {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.13);
}
.feed-card {
  padding: 20px;
  margin-bottom: 24px;
  transition: all 0.2s linear;
  cursor: pointer;
}
.feed-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.feed-card > .title {
  margin: 0;
}

.feed-link {
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-weight: 100;
}
.article-img {
    height: 60px;
    width: 60px;
    margin-right: 5px;
  }
</style>
