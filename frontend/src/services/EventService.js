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
  addtoken(token){
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    console.log('apiclient header token added',apiClient.defaults.headers.common['Authorization'])
  },
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
    console.log("formData",formData)
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
  likePost(payload) {
    return apiClient.put('/like_post/' , payload)
  },
  unlikePost(payload) {
    return apiClient.put('/unlike_post/' , payload)
  },
  deletePost(postid) {
    return apiClient.delete('/delete_post/' + postid)
  },
  updatePost(post) {
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('description', post.description);
    formData.append('feed_image', post.feed_image);
    return apiClient.put('/update_post/' + post.id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  followUser(payload) {
    return apiClient.put('/follow_user/' , payload)
  },
  unfollowUser(payload) {
    return apiClient.put('/unfollow_user/' , payload)
  },
  postRegistration(registration) {
    return apiClient.post('/register', registration)
  },
  postLogin(login_user) {
    return apiClient.post('/login', login_user)
  },
  getUsers() {
    return apiClient.get('/user_list')
  },
  getUserPosts(id) {
    return apiClient.get('/user_posts/' + id)
  }
}
