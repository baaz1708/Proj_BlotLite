import Vue from 'vue'
import Router from 'vue-router'
import PostCreate from './views/PostCreate.vue'
import UpdatePost from './views/UpdatePost.vue'
import FeedList from './views/FeedList.vue'
import MyProfile from './views/MyProfile.vue'
import OtherProfile from './views/OtherProfile.vue'
import NProgress from 'nprogress'
import store from '@/store/store'
import NotFound from './views/NotFound.vue'
import NetworkIssue from './views/NetworkIssue.vue'
import SearchUser from './views/SearchUser.vue'
import RegisterUser from './views/RegisterUser.vue'
import LoginUser from './views/LoginUser.vue'
import Home from './views/Home.vue'
import Follow_ersORing from './views/Follow_ersORing.vue'

Vue.use(Router)

const router = new Router({
  // helps to get rid of the ugly # in url
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from , next) => {
        if (from.path === '/' && store.getters['login_user/loggedIn']) {
          next(false);
        } else {
          next();
        }
        if (store.getters['login_user/loggedIn']) {
          next({ name: 'feed-list' })
        } else {
          next()
        }
      }
    },
    {
      path: '/feeds',
      name: 'feed-list',
      component: FeedList,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/search',
      name: 'search-user',
      component: SearchUser,
      meta: { requiresAuth: true },
    },
    {
      path: '/follow_ersORing/:id',
      name: 'follow_ersORing',
      component: Follow_ersORing,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterUser
    },
    {
      path: '/login',
      name: 'login',
      component: LoginUser
    },
    {
      path: '/profile',
      name: 'profile',
      component: MyProfile,
      meta: { requiresAuth: true },
      beforeEnter(routeTo, routeFrom, next) {
        store
          .dispatch('user/setUser')
          .then(() => {
            const userdata = store.state.user.user
            console.log('userdata:(before routeTo params profile)', userdata)
            routeTo.params.user = userdata
            next()
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              next({ name: '404', params: { resource: '' } })
            } else {
              next({ name: 'network-issue' })
            }
          })
      }
    },
    {
      path: '/other_profile/:id',
      name: 'other-profile',
      component: OtherProfile,
      meta: { requiresAuth: true },
    },
    {
      path: '/post/create',
      name: 'post-create',
      component: PostCreate,
      meta: { requiresAuth: true },
    },
    {
      path: '/post_update/:id',
      name: 'post-update',
      component: UpdatePost,
      meta: { requiresAuth: true },
    },
    {
      path: '/404',
      name: '404',
      component: NotFound,
      props: true
    },
    {
      path: '/network-issue',
      name: 'network-issue',
      component: NetworkIssue
    },
    {
      path: '*',
      redirect: { name: '404', params: { resource: 'page' } }
    }
  ]
})

router.beforeEach((routeTo, routeFrom, next) => {
  NProgress.start()
  // const loggedIn = store.getters['login_user/loggedIn']
  const loggedIn = localStorage.getItem('user')
  if (routeTo.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next({ name: 'login' })
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router