<template>
  <div class="container pt-3">
    <h1 class="text-center m-4">Create new Post</h1>

    <form @submit.prevent="createEvent">

      <h3>Name describe your Post</h3>
      <div class="field">
        <label>Title</label>
        <input  type="text" v-model="event.title" placeholder="Add an event title" @blur="$v.event.title.$touch()" class="form-control { error: $v.event.title.$error }"/>
      </div>

      <template v-if="$v.event.title.$error">
        <p v-if="!$v.event.title.required" class="errorMessage">
          Title is required.
        </p>
      </template>

      <div class="field">
        <label>Description</label>
        <input  type="text" v-model="event.description" placeholder="Add an event description" @blur="$v.event.description.$touch()" class="form-control { error: $v.event.description.$error }" />
      </div>

      <template v-if="$v.event.description.$error">
        <p v-if="!$v.event.description.required" class="errorMessage">
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
      event: this.createFreshEvent(),
    }
  },
  validations: {
    event: {
      title: { required },
      description: { required },
    }
  },
  methods: {
    createEvent() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        NProgress.start()
        this.event.timestamp = new Date().toISOString()
        // from datetime import datetime
        // @app.route('/create-event', methods=['POST'])
        // def create_event():
        //     data = request.get_json()
        //     datetime_str = data['datetime']
        //     datetime_obj = datetime.fromisoformat(datetime_str)

        this.$store
          .dispatch('event/createEvent', this.event)
          .then(() => {
            this.$router.push({
              name: 'event-show',
              params: { id: this.event.id }
            })
            this.event = this.createFreshEvent()
          })
          .catch(() => {
            NProgress.done()
          })
      }
    },
    createFreshEvent() {
      const user = this.$store.state.user.user
      const id = Math.floor(Math.random() * 10000000)
      return {
        id,
        user: user,
        title: '',
        description: '',
        selected_file: null,
        timestamp: '',
      }
    },
    onFileChange(e) {
      console.log(e.target.files[0])
      this.event.selected_file = e.target.files[0];
    }
  },
  watch: {
  'event.selected_file': function (newVal, oldVal) {
    console.log('selected_file changed from', oldVal, 'to', newVal);
  },
  'event.timestamp': function (newVal, oldVal) {
    console.log('timestamp changed from', oldVal, 'to', newVal);
  }
}
}
</script>

<style scoped>
h3 {
  margin-top: 2rem !important;
}
</style>
