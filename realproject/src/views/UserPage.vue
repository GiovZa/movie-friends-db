<template>
  <div class="user-info">
    <h1>User Information</h1>
    <p><strong>User ID:</strong> {{ userInfo.UserId }}</p>
    <p><strong>Username:</strong> {{ userInfo.Username }}</p>
    
    <div class="update-section">
      <label><strong>Email:</strong></label>
      <input v-model="newEmail" placeholder="Enter new Email" :class="{'input-error': !isValidEmail(newEmail) && EmailTouched}" />
      <button @click="updateEmail" :disabled="!isValidEmail(newEmail)">Update Email</button>
      <p v-if="!isValidEmail(newEmail) && EmailTouched" class="error">Please enter a valid Email.</p>
    </div>
    
    <div class="update-section">
      <label><strong>New Password:</strong></label>
      <input type="password" v-model="newPassword" placeholder="Enter new password" :class="{'input-error': !isValidPassword(newPassword) && passwordTouched}" />
      <button @click="updatePassword" :disabled="!isValidPassword(newPassword)">Update Password</button>
      <p v-if="!isValidPassword(newPassword) && passwordTouched" class="error">Password must be at least 6 characters.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userInfo: {
        UserId: '',
        Username: '',
        Email: ''
      },
      newEmail: '',
      newPassword: '',
      EmailTouched: false,
      passwordTouched: false
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    fetchUserData() {
      axios.get('/api/user/:userid')
        .then(response => {
          this.userInfo = response.data;
          this.newEmail = this.userInfo.Email; // Initialize with current Email
        })
        .catch(error => console.error('Error fetching user data:', error));
    },
    updateEmail() {
      axios.put('/api/user/updateEmail', { Email: this.newEmail })
        .then(() => alert('Email updated successfully!'))
        .catch(error => console.error('Error updating Email:', error));
    },
    updatePassword() {
      axios.put('/api/user/updatePassword', { newPassword: this.newPassword })
        .then(() => {
          alert('Password updated successfully!');
          this.newPassword = '';
        })
        .catch(error => console.error('Error updating password:', error));
    },
    isValidEmail(Email) {
      this.EmailTouched = true;
      return /\S+@\S+\.\S+/.test(Email);
    },
    isValidPassword(password) {
      this.passwordTouched = true;
      return password.length >= 6;
    }
  }
}
</script>

<style scoped>
.update-section {
  margin-top: 20px;
}

.input-error {
  border-color: red;
}

.error {
  color: red;
  font-size: 0.8em;
}
</style>
