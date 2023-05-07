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
  getFeeds(perPage, page) {
    return apiClient.get('/feeds?_limit=' + perPage + '&_page=' + page)
  },
  getEvent(id) {
    return apiClient.get('/events/' + id)
  },
  postNewPost(post) {
    const formData = new FormData();
    formData.append('id', post.id);
    formData.append('user', post.user);
    formData.append('title', post.title);
    formData.append('description', post.description);
    formData.append('selected_file', post.selected_file);
    formData.append('timestamp', post.timestamp);

    return apiClient.post('/post/new', formData, {
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
