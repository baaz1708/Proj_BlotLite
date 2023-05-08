import axios from "axios";
import EventService from "../../services/EventService";

export const namespaced = true;

export const state = {
    user: {}
}

export const mutations = {
    SET_USER_DATA (state, userData) {
        state.user = userData
        localStorage.setItem('user', JSON.stringify(userData))
        // axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
    }
}

export const actions = {
    register ({ commit }, credentials) {
        return EventService.postRegistration(credentials).then((response) => {
            const data = response.data;
            console.log(data);
            if (response.status >= 200) {
                commit('SET_USER_DATA', data)
                
            }
    })  
    }
}
