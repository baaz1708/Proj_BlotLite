import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export default {
  getEvents(perPage, page) {
    return apiClient.get('/feed?_limit=' + perPage + '&_page=' + page)
  },
  getEvent(id) {
    return apiClient.get('/events/' + id)
  },
  postEvent(event) {
    const formData = new FormData();
    formData.append('title', event.title);
    formData.append('description', event.description);
    formData.append('selected_file', event.selected_file);

    return apiClient.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  postRegistration(registration) {
    return apiClient.post('/register', registration)
  },
  postLogin(login_user) {
    return apiClient.post('/login', login_user)
  },
  getUsers() {
    return apiClient.get('/user_list')
  }
}
