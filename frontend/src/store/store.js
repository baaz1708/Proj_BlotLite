import Vue from 'vue'
import Vuex from 'vuex'
import * as user from '@/store/modules/user.js'
import * as feed from '@/store/modules/feed.js'
import * as notification from '@/store/modules/notification.js'
import * as registeration from '@/store/modules/registeration.js'
import * as login_user from '@/store/modules/login_user.js'
import * as user_list from '@/store/modules/user_list.js'
import * as post from '@/store/modules/post.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    feed,
    notification,
    registeration,
    login_user,
    user_list,
    post
  },
  state: {
    
  }
})
