<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div>
          <label for="username">Username:</label>
          <input id="username" v-model="credentials.username" type="text" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input id="password" v-model="credentials.password" type="password" required>
        </div>
        <button type="submit">Log In</button>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </form>
    </div>
</template>
  
<script>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export default {
data() {
    return {
    credentials: {
        username: '',
        password: ''
    },
    errorMessage: ''
    };
},
setup() {
    const router = useRouter();
    return { router };
  },
methods: {
    async login() {
      if (!this.credentials.username || !this.credentials.password) {
        this.errorMessage = 'Both username and password are required.';
        return;
      }

      try {
        console.log('Request URL:', `${this.$hostname}/login`);
        console.log('Sending login credentials:', JSON.stringify(this.credentials)); // Log to verify

        const response = await fetch(`${this.$hostname}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.credentials)
        });

        if (!response.ok) {
          throw new Error('Failed to log in');
        }

        const data = await response.json();
        if (data.success) {
          sessionStorage.setItem('userId', data.userId); // Assuming the response includes userId
          this.router.push(`/user/${data.userId}`);
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = 'Login failed';
      }
    }
  }
};
</script>

<style>
.login-container {
width: 300px;
margin: auto;
padding: 20px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
