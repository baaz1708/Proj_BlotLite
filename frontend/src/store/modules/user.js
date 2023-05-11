import EventService from "../../services/EventService";

export const namespaced = true;
export const state = {
  user: JSON.parse(localStorage.getItem('user')) || {}
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  UPDATE_USER(state) {
    state.user = JSON.parse(localStorage.getItem('user')) || {}
  }
}

export const actions = {
  setUser({ commit, state }) {
    return EventService.getUser(state.user.id).then((response) =>{
      const data = response.data;
      console.log(data);
      if(response.status >= 200 && response.status < 400){
        commit('SET_USER', data)
      }
    })
  },
  updateUser({ commit}, user) {
    console.log("before put",user)
    return EventService.updateUser(user).then((response) =>{
      const data = response.data;
      console.log("after put",data);
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

