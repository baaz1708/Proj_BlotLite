import EventService from '@/services/EventService.js'

export const namespaced = true

export const state = {
    users: [],
    user: {}
}

export const mutations = {
    SET_USERS(state, users) {
        state.users = users
    }
}

export const actions = {
    fetchUsers({ commit, dispatch }) {
        return EventService.getUsers()
            .then(response => {
                console.log('response after fetching user list is: ', response)
                commit('SET_USERS', response.data)
            })
            .catch(error => {
                const notification = {
                    type: 'error',
                    message: 'There was a problem fetching users: ' + error.message
                }
                dispatch('notification/add', notification, { root: true })
            })
    }
}

export const getters = {
    getUserById: state => id => {
        return state.users.find(user => user.id === id)
    }
}