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
      <div class="col-sm-9 ">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>@<u>{{ userdata.user.username }}</u></h2>
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
        <div class="d-flex justify-content-between p-3">
          <p><strong>Posts:</strong> {{ userdata.user_posts.length }}</p>
          <p class="mr-3"><strong>Followers:</strong><a class="clickable" @click="goToFollowers"> {{ followers }}</a></p>
          <p class="ml-4"><strong>Following:</strong><a class="clickable" @click="goToFollowing"> {{ following }}</a></p>
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
            <div style="position: relative;">
              <img :src="post.feed_image" alt="" style="width: 200px; height: 200px; object-fit: cover;">
              <div class="dropdown" style="position: absolute; top: 0; right: 0;">
                <a class="btn btn-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" @click="editPost(post)">Edit</a></li>
                  <li><a class="dropdown-item" href="#" @click="deletePost(post.id)">Delete</a></li>
                  <li><a class="dropdown-item" href="#" @click="exportPost(post)">Download</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    console.log('after route params profile', this.$route.params.user)
    return {
      userdata: this.$route.params.user,
      id: this.$route.params.user.user.id,
      followers: this.$route.params.user.user.followers.length,
      following: this.$route.params.user.user.following.length,
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
    },
    editPost(postdata) {
      console.log(' before Edit post with id', postdata.id);
      this.$router.push({ name: 'post-update', params: { post: postdata, id: postdata.id } })
    },
    deletePost(id) {
      console.log(' befor Delete post with id', id);
      this.$store.dispatch('post/deletePost', id).then(() => {
        const index = this.userdata.user_posts.findIndex((post) => post.id === id);
        this.userdata.user_posts.splice(index, 1);
      })
    },
    async exportPost(postdata) {
      const imageUrl = postdata.feed_image;
      console.log("imageUrl=",imageUrl)
      const response = await fetch(imageUrl);
      console.log("response=",response)
      const blob = await response.blob();
      console.log("blob=",blob)
      const objectUrl = URL.createObjectURL(blob);
      console.log("objectUrl=",objectUrl)
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', objectUrl);
      downloadAnchorNode.setAttribute('target', '_blank');
      downloadAnchorNode.setAttribute("download", "post-" + postdata.id + ".jpeg");

      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
    goToFollowers() {
      this.$router.push({ name: 'follow_ersORing', params: { id: this.id, follow__: 'followers' }})
    },
    goToFollowing() {
            this.$router.push({ name: 'follow_ersORing', params: { id: this.id, follow__: 'following' }})
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
.btn-light {
    background-color: transparent;
    border-color: transparent;
}
.clickable {
    cursor: pointer;
    text-decoration: none;
    color: black;
}
</style>