<template>
    <div class="container pt-3">
        <h1 class="text-center m-4">Register User</h1>
        <form @submit.prevent="register">
            <div>
                <label for="name" class="form-label">Name</label>
                <input type="text" name="name" id="name" v-model="name" value @blur="$v.name.$touch()" class="form-control { error: $v.name.$error }" >
            </div>
            <template v-if="$v.name.$error">
                <p v-if="!$v.name.required" class="errorMessage">
                Category is required.
                </p>
            </template>

            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" name="email" id="email" v-model="email" value @blur="$v.email.$touch()" class="form-control { error: $v.email.$error }" >
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <template v-if="$v.email.$error">
                <p v-if="!$v.email.required" class="errorMessage">
                Email is required.
                </p>
            </template>

            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" name="password" id="password" v-model="password" value @blur="$v.password.$touch()" class="form-control { error: $v.password.$error }">
            </div>
            <template v-if="$v.password.$error">
                <p v-if="!$v.password.required" class="errorMessage">
                Password is required.
                </p>    
            </template>

            <div class="mb-3">
                <label for="password_confirmation" class="form-label">Confirm Password</label>
                <input type="password" name="password_confirmation" id="password_confirmation" v-model="password_confirmation" value @blur="$v.password_confirmation.$touch()" class="form-control { error: $v.password_confirmation.$error }">
            </div>
            <template v-if="$v.password_confirmation.$error">
                <p v-if="!$v.password_confirmation.required" class="errorMessage">
                Confirm Password is required.
                </p>

                <p v-if="!$v.password_confirmation.sameAsPassword" class="errorMessage">
                Passwords do not match.
                </p>

            </template>

            <BaseButton
            type="submit"
            buttonClass="mt-5 mb-3 -fill-gradient"
            :disabled="$v.$anyError"
            >Register
            </BaseButton>
            <p v-if="$v.$anyError" class="errorMessage">
            Please fill out the required field(s).</p>
        </form>

        <ul v-if="errors">
            <li v-for="(error, index) in errors" :key="index" class="errorMessage">{{ error }}</li>
        </ul>

        <router-link to="/login" class="">Already have an account? Login</router-link>
    </div>
</template>

<script>
import { required, sameAs } from 'vuelidate/lib/validators'
export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            errors: null
        }
    },
    validations:{
        name: { required },
        email: { required },
        password: { required },
        password_confirmation: { required,
            sameAsPassword: sameAs('password')
        },
    },

    methods: {
        register() {
            this.$store.dispatch('registeration/register', {
                name: this.name,
                email: this.email,
                password: this.password,
                password_confirmation: this.password_confirmation
            }).then(() => {
                this.$router.push({ name: 'login' })
            }).catch((err) => {
                this.errors = err.response.data.errors
            })
        }
    }
}
</script>

<style>

</style>