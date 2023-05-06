<template>
    <div class="container pt-3 mb-3">
        <h1 class="text-center m-4" >Login</h1>
        <form @submit.prevent="login">
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" name="email" id="email" v-model="email" value @blur="$v.email.$touch()" class="form-control { error: $v.email.$error }"  aria-describedby="emailHelp">
            </div>
            <template v-if="$v.email.$error">
                <p v-if="!$v.email.required" class="errorMessage">
                Email is required.
                </p>
            </template>

            <div class="">
                <label for="password" class="form-lable">Password</label>
                <input type="password" name="password" id="password" v-model="password" value @blur="$v.password.$touch()" class="form-control { error: $v.password.$error }">
            </div>
            <template v-if="$v.password.$error">
                <p v-if="!$v.password.required" class="errorMessage">
                Password is required.
                </p>    
            </template>

            <BaseButton
            type="submit"
            buttonClass="mt-5 mb-3 -fill-gradient"
            :disabled="$v.$anyError"
            >Login
            </BaseButton>
            <p v-if="$v.$anyError" class="errorMessage">
            Please fill out the required field(s).</p>
        </form>

        <p v-if="error" class="errorMessage">{{ error }}</p>
        <router-link to="/register" class="">Don't have an account? Register</router-link>
    </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {

    data() {
        return {
            email: '',
            password: '',
            error:  null
        }
    },
    validations: {
        email: { required },
        password: { required }
    },
    methods: {
        login() {
            this.$store.dispatch('login_user/login', {
                email: this.email,
                password: this.password
            }).then(() => {
                if (this.$store.state.errorMessage) {
                    this.error = this.$store.state.errorMessage
                } else {
                    this.$router.push({ name: 'feed-list' })
                }
            }).catch((err) => {
                console.log(err)
                if (err.response && err.response.data && err.response.data.message){
                    this.error = err.response.data.message
                } else {
                    this.error = 'An error occured. Please try again.'
                }
            })
        }
    }
}
</script>

<style>

</style>