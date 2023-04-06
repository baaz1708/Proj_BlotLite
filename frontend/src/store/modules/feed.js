import EventService from '@/services/EventService.js'

export const namespaced = true

export const state = {
  feeds: [],
  feedsTotal: 0,
  event: {},
  perPage: 3
}
export const mutations = {
  ADD_EVENT(state, event) {
    state.feeds.push(event)
  },
  SET_FEEDS(state, feeds) {
    state.feeds = feeds
  },
  SET_FEEDS_TOTAL(state, feedsTotal) {
    state.feedsTotal = feedsTotal
  },
  SET_EVENT(state, event) {
    state.event = event
  }
}
export const actions = {
  createEvent({ commit, dispatch }, event) {
    return EventService.postEvent(event)
      .then((response) => {
        // Create a new event object with the file path
        const newEvent = {
          ...event,
          selected_file: response.data.selected_file,
          timestamp: response.data.timestamp
        }
        commit('ADD_EVENT', newEvent)
        const notification = {
          type: 'success',
          message: 'Your event has been created!'
        }
        dispatch('notification/add', notification, { root: true })
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a problem creating your event: ' + error.message
        }
        dispatch('notification/add', notification, { root: true })
        throw error
      })
  },
  fetchFeeds({ commit, dispatch, state }, { page }) {
    return EventService.getFeeds(state.perPage, page)
      .then(response => {
        console.log('data', response.data)
        commit('SET_FEEDS_TOTAL', parseInt(response.headers['x-total-count']))
        commit('SET_FEEDS', response.data)
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching feeds: ' + error.message
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
  fetchEvent({ commit, getters }, id) {
    var event = getters.getEventById(id)
    if (event) {
      commit('SET_EVENT', event)
      return event
    } else {
      // returning here creates a promise for us to process if need be, and use then()
      return EventService.getEvent(id).then(response => {
        commit('SET_EVENT', response.data)
        return response.data
      })
    }
  }
}
export const getters = {
  getEventById: state => id => {
    return state.feeds.find(event => event.id === id)
  }
}
