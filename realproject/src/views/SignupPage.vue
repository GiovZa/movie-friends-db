<template>
  <div class="signup-container">
    <h1>Sign Up</h1>
    <form @submit.prevent="signup">
      <div>
        <label for="userId">User ID:</label>
        <input id="userId" v-model="credentials.userId" type="number" required>
      </div>
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="credentials.username" type="text" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="credentials.email" type="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="credentials.password" type="password" required>
      </div>
      <button type="submit">Sign Up</button>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
data() {
  return {
    credentials: {
      userId: null,
      username: '',
      email: '',
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
  async signup() {
    if (!this.credentials.userId || !this.credentials.username || !this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'User ID, username, email, and password are required.';
      return;
    }

    try {
      const response = await fetch(`${this.$hostname}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.credentials)
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const data = await response.json();
      if (data.success) {
        alert('Signup successful!');
        this.router.push('/login');
      } else {
        this.errorMessage = data.message || 'Signup failed';
      }
    } catch (error) {
      console.error('Signup error:', error);
      this.errorMessage = 'Signup failed';
    }
  }
}
};
</script>

<style scoped>
.signup-container {
width: 300px;
margin: auto;
padding: 20px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
