import EventService from "../../services/EventService";

export const namespaced = true;
export const state = {
  feeduser: JSON.parse(localStorage.getItem('user')) || {},
  user: JSON.parse(localStorage.getItem('user')) || {},
  profileinfo: JSON.parse(localStorage.getItem('user')) || {}
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  UPDATE_USER(state) {
    state.feeduser = JSON.parse(localStorage.getItem('user')) || {}
    state.user = JSON.parse(localStorage.getItem('user')) || {}
    state.profileinfo= JSON.parse(localStorage.getItem('user')) || {}
  }
}

export const actions = {
  setUser({ commit, state }) {
    console.log("before enter profile before fetch user",state.user.id)
    return EventService.getUser(state.profileinfo.id).then((response) =>{
      const data = response.data;
      console.log("before enter profile after fetch user",data);
      if(response.status >= 200 && response.status < 400){
        commit('SET_USER', data)
      }
    })
  },
  updateUser({ commit}, user) {
    console.log("before edituser put",user)
    return EventService.updateUser(user).then((response) =>{
      const data = response.data;
      console.log("after edituser put",data);
      if(response.status >= 200 && response.status < 400){
        commit('SET_USER', data)
      }

    })
  },
  followUser({ commit}, payload) {
    return EventService.followUser(payload).then((response) =>{
      const data = response.data;
      console.log("after followUser put",data);
      if(response.status >= 200 && response.status < 400){
        localStorage.setItem('user', JSON.stringify(data))
        commit('UPDATE_USER')
      }

    })
  },
  unfollowUser({ commit}, payload) {
    return EventService.unfollowUser(payload).then((response) =>{
      const data = response.data;
      console.log("after unfollowUser put",data);
      if(response.status >= 200 && response.status < 400){
        localStorage.setItem('user', JSON.stringify(data))
        commit('UPDATE_USER')
      }

    })
  }
}

export const getters = {
  loggedIn(state) {
    return !!state.user
  }
}

