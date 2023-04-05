import axios from "axios";
import EventService from "../../services/EventService";

export const namespaced = true;

export const state = {
    user:null
}

export const mutations = {
    LOGIN_DATA (state, userData) {
        state.user = userData
        localStorage.setItem('user', JSON.stringify(userData))
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    },
    CLEAR_USER_DATA () {
        localStorage.removeItem('user')
        location.reload()
    }
}

export const actions = {
    login ({ commit }, credentials) {
        return EventService.postLogin(credentials).then(() =>{
            // ({ data }) => {
            //     console.log('user data is: ', data)
             commit('LOGIN_DATA', credentials)}
                // return data
            // }
        )
    },
    logout ({ commit }) {
        commit('CLEAR_USER_DATA')
    }

}

export const getters = {
    loggedIn (state) {
        return !!state.user//.token
    }
  }