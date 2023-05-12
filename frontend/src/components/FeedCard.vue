<!-- generated using vbase snippet (vbase + tab)  -->
<template>
  <router-link
    class="feed-link"
    :to="{ name: 'search-user', params: { id: feed.id } }"
  >
    <div class="feed-card -shadow large-margin">
      <img :src="feed.author.image_file" alt="User Image" class=" rounded-circle article-img"/>
      <span class="eyebrow">@{{ feed.timestamp | time }} on {{ feed.timestamp | date }}</span>
      <h4 class="author">{{ feed.author.username }}</h4>
      <hr>
      
      <!-- image  -->
      <div class="row">
        <div class="col-md-12">
          <img :src="feed.feed_image" alt="" class=" feed-image rounded" >
        </div>
      <hr>
      <h5 class="title">{{ feed.title }}</h5>
      <p class="description">{{ feed.description }}</p>
      </div>
      <!-- <BaseIcon name="users">{{ feed.user_id }} attending</BaseIcon> -->
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
.large-margin {
  margin-left: 30px;
  margin-right: 30px;
}

.author{
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
    height: 30px;
    width: 30px;
    margin-right: 5px;
  }
</style>
