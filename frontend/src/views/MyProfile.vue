<template>
  <div class="container">
    <div class="row m-4">
      <div class="col-sm-3">
        <div class="profile-image-container">
          <img :src="userdata.user.image_file" alt="Profile Icon" class="img-fluid rounded-circle" @click="$refs.fileInput.click()">
          <div class="profile-image-overlay rounded-circle">
            <span>Update pic</span>
          </div>
        </div>
        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;">
      </div>
      <div class="col-sm-9">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>{{ userdata.user.username }}</h2>
          <button class="-fill-gradient rounded" @click="editMode = !editMode">Edit</button>
        </div>
        <div v-if="editMode" class="mb-3">
          <input type="text" class="form-control mb-2" v-model="newUsername" placeholder="New username">
          <input type="email" class="form-control" v-model="newEmail" placeholder="New email">
          <button class="btn btn-success mt-2" @click="updateUser">Save</button>
          <ul v-if="errors">
            <li v-for="(error, index) in errors" :key="index" class="errorMessage">{{ error }}</li>
        </ul>
        </div>
        <div class="d-flex justify-content-between">
          <p><strong>Posts:</strong> {{ userdata.user_posts.length }}</p>
          <p class="mr-3"><strong>Followers:</strong> {{ followers }}</p>
          <p class="ml-4"><strong>Following:</strong> {{ following }}</p>
        </div>
      </div>
    </div>
    <hr>
    <div class="row mt-4">
      <div class="col-sm-12">
        <h2>Posts</h2>
        <div class="d-flex flex-wrap">
          <div v-for="(post, index) in userdata.user_posts" :key="index" class="m-1">
            <!-- Replace with your post component -->
            <img :src="post.image_url" alt="" style="width: 200px; height: 200px; object-fit: cover;">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    console.log('route params', this.$route.params.user)
    return {
      userdata: this.$route.params.user,
      id: this.$route.params.user.user.id,
      followers: 123,
      following: 456,
      editMode: false,
      newUsername: this.$route.params.user.user.username,
      newEmail: this.$route.params.user.user.email,
      newProfilePic: '',
      errors: []
    }
  },
  methods: {
    handleFileChange(event) {
      // Handle the file selection here
      const file = event.target.files[0];
      this.newProfilePic = file;
      this.editMode = true;
      console.log('file', file);
    },
    updateUser() {
      console.log('update user', {username:this.newUsername, "email":this.newEmail, profilepic:this.newProfilePic}),
      console.log('update user', this.newUsername, this.newEmail, this.newProfilePic)
      // Replace with your API call to update the user
      this.$store.dispatch('user/updateUser', {
          id: this.id,
          username: this.newUsername,
          email: this.newEmail,
          image_file: this.newProfilePic
        }).then(() => {
          this.editMode = false
          this.newUsername = ''
          this.newEmail = ''
          this.newProfilePic = ''
          this.$router.push({ name: 'feed-list' })
        }).catch((err) => {
                console.log(err)
                if (err.response && err.response.data && err.response.data.message){
                    this.errors.push(err.response.data.message);
                } else {
                    this.errors.push('Something went wrong. Please try again later.');
                }
            })
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
.profile-image-container {
  position: relative;
}

.profile-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none; /* This is important to prevent the overlay from blocking the click event on the image */
}

.profile-image-container:hover .profile-image-overlay {
  opacity: 1;
}
</style>