<template>
  <div class="container pt-3">
    <h1 class="text-center m-4">Create new Post</h1>

    <form @submit.prevent="createPost">

      <h3>Name describe your Post</h3>
      <div class="field">
        <label>Title</label>
        <input  type="text" v-model="post.title" placeholder="Add an post title" @blur="$v.post.title.$touch()" class="form-control { error: $v.post.title.$error }"/>
      </div>

      <template v-if="$v.post.title.$error">
        <p v-if="!$v.post.title.required" class="errorMessage">
          Title is required.
        </p>
      </template>

      <div class="field">
        <label>Description</label>
        <input  type="text" v-model="post.description" placeholder="Add an post description" @blur="$v.post.description.$touch()" class="form-control { error: $v.post.description.$error }" />
      </div>

      <template v-if="$v.post.description.$error">
        <p v-if="!$v.post.description.required" class="errorMessage">
          Description is required.
        </p>
      </template>

      <h3>Upload your image</h3>
      <div class="input-group mb-3">
        <input type="file" class="form-control" id="inputGroupFile02" @change="onFileChange">
        <label class="input-group-text" for="inputGroupFile02">Pick Image</label>
      </div>

      <BaseButton
        type="submit"
        buttonClass="mt-5 mb-3 -fill-gradient"
        :disabled="$v.$anyError"
      >Submit
      </BaseButton>
      <p v-if="$v.$anyError" class="errorMessage">
        Please fill out the required field(s).</p>
    </form>
</div>
</template>

<script>
import NProgress from 'nprogress'
import { required } from 'vuelidate/lib/validators'

export default {
  components: {
    NProgress
  },
  data() {
    return {
      post: this.createFreshPost(),
    }
  },
  validations: {
    post: {
      title: { required },
      description: { required },
    }
  },
  methods: {
    createPost() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        NProgress.start()
        console.log("before dispatch", this.post)
        this.$store
          .dispatch('post/new_post', this.post)
          .then(() => {
            this.$router.push({
              name: 'feed-list',
              // params: { id: this.post.id }
            })
            this.post = this.createFreshPost()
          })
          .catch(() => {
            NProgress.done()
          })
      }
    },
    createFreshPost() {
      const user = JSON.parse(localStorage.getItem('user')) || {}
      return {
        user: user,
        title: '',
        description: '',
        feed_image: '',
      }
    },
    onFileChange(e) {
      console.log(e.target.files[0])
      this.post.feed_image = e.target.files[0];
    }
  },
  watch: {
  'post.feed_image': function (newVal, oldVal) {
    console.log('feed_image changed from', oldVal, 'to', newVal);
  }
}
}
</script>

<style scoped>
h3 {
  margin-top: 2rem !important;
}
</style>
