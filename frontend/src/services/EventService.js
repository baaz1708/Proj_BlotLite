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
  getUser(id) {
    return apiClient.get('/user/' + id)
  },
  updateUser(user){
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('picture', user.image_file);
    console.log("formData", formData)
    return apiClient.put('/user/' + user.id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  postNewPost(post) {
    const formData = new FormData();
    formData.append('curr_user', post.user);
    formData.append('user_id', post.user.id);
    formData.append('title', post.title);
    formData.append('description', post.description);
    formData.append('feed_image', post.feed_image);

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
