<template>
  <div class="container p-2">
    <FeedCard v-for="feed in feed.feeds" :key="feed.id" :feed="feed" class="large-margin" />
    <template v-if="page != 1">
      <router-link
        :to="{ name: 'feed-list', query: { page: page - 1 } }"
        rel="prev">
        Prev Page
      </router-link>   
      
      <template v-if="hasNextPage">
        |
      </template>
    
    </template>
    <router-link
      v-if="hasNextPage"
      :to="{ name: 'feed-list', query: { page: page + 1 } }"
      rel="next">
      Next Page
    </router-link>
  </div>
</template>

<script>
import FeedCard from '@/components/FeedCard.vue'
import { mapState } from 'vuex'
import store from '@/store/store'

function getPageFeeds(routeTo, next) {
  const currentPage = parseInt(routeTo.query.page) || 1
  store
    .dispatch('feed/fetchFeeds', {
      page: currentPage
    })
    .then(() => {
      routeTo.params.page = currentPage
      next()
    })
}

export default {
  components: {
    FeedCard
  },
  props: {
    page: {
      type: Number,
      required: true
    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    getPageFeeds(routeTo, next)
  },
  beforeRouteUpdate(routeTo, routeFrom, next) {
    getPageFeeds(routeTo, next)
  },
  computed: {
    hasNextPage() {
      return this.feed.feedsTotal > this.page * this.feed.perPage
    },
    ...mapState(['feed','user'])
  }
}
</script>

<style scoped>

a {
  color: #1dc77d;
  font-weight: 600;
  background-color: transparent;
}

.large-margin {
  margin-left: 20px;
  margin-right: 20px;
}
</style>