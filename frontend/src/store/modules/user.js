import EventService from "../../services/EventService";

export const namespaced = true;
export const state = {
  user: JSON.parse(localStorage.getItem('user')) || {},
  profileinfo: JSON.parse(localStorage.getItem('user')) || {}
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  UPDATE_USER(state) {
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
  }
}

export const getters = {
  loggedIn(state) {
    return !!state.user
  }
}

