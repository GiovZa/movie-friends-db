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
<template>
    <div class="user-info">
      <div v-if="userInfo && userInfo.userId">
        <h1>User Information</h1>
        <p><strong>User ID:</strong> {{ userInfo.userId }}</p>
        <p><strong>Username:</strong> {{ userInfo.username }}</p>
        <p><strong>Email:</strong> {{ userInfo.email }}</p>
      </div>

      
      <!-- Friends Section -->
      <div>
        <h2>Friends</h2>
        <ul>
          <li v-for="friend in friends" :key="friend.FriendUsername">{{ friend.FriendUsername  }}</li>
        </ul>
      </div>
  
      <!-- Genre Preferences -->
      <div>
        <h2>Genre Preferences</h2>
        <ul>
          <li v-for="genre in genrePref" :key="genre.GenreID">Genre: {{ genre.GenreID }}, Rating: {{ genre.Rating }}</li>
        </ul>
      </div>
  
      <!-- Actor Preferences -->
      <div>
        <h2>Actor Preferences</h2>
        <ul>
          <li v-for="actor in actorPref" :key="actor.ActorID">Actor: {{ actor.ActorID }}, Rating: {{ actor.Rating }}</li>
        </ul>
      </div>
  
      <!-- Watch History -->
      <div>
        <h2>Watch History</h2>
        <ul>
          <li v-for="history in watchHistory" :key="history.MovieID">Movie ID: {{ history.MovieID }}, Watched: {{ history.DateWatched }}, Rating: {{ history.UserRating }}</li>
        </ul>
      </div>
  
      <div class="update-section">
        <label><strong>Email:</strong></label>
        <input v-model="newEmail" placeholder="Enter new email" :class="{'input-error': !isValidEmail(newEmail) && emailTouched}" />
        <button @click="updateEmail" :disabled="!isValidEmail(newEmail)">Update Email</button>
        <p v-if="!isValidEmail(newEmail) && emailTouched" class="error">Please enter a valid email.</p>
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
          userId: 0,
          username: '',
          email: ''
        },
        friends: [],
        genrePref: [],
        actorPref: [],
        watchHistory: [],
        newEmail: '',
        newPassword: '',
        emailTouched: false,
        passwordTouched: false
      };
    },
    created() {
      this.fetchUserData();
    },
    methods: {
    async fetchUserData() {
      const userId = sessionStorage.getItem('userId');
      console.log(userId)
      console.log(`${this.$hostname}/user/${userId}`)
      try {
        const response = await fetch(`${this.$hostname}/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        console.log(data)
        this.userInfo = {
            userId: data.user.UserID,
            username: data.user.Username,
            email: data.user.Email.trim()  // Added .trim() to remove any unwanted newline or whitespace
        };
        this.friends = data.friends;
        this.genrePref = data.genrePref;
        this.actorPref = data.actorPref;
        this.watchHistory = data.watchHistory;
        this.newEmail = this.userInfo.email;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async updateEmail() {
  try {
    const response = await fetch(`${this.$hostname}/user/updateEmail`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: this.newEmail, userId: this.userInfo.userId })
    });
    if (!response.ok) {
      throw new Error('Failed to update email');
    }
    alert('Email updated successfully!');
  } catch (error) {
    console.error('Error updating email:', error);
  }
},

async updatePassword() {
  try {
    const response = await fetch(`${this.$hostname}/user/updatePassword`, {  // Make sure the URL is correct
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newPassword: this.newPassword, userId: this.userInfo.userId })
    });
    if (!response.ok) {
      const errorResponse = await response.json(); // Handle JSON response on error
      throw new Error(errorResponse.error || 'Failed to update password');
    }
    alert('Password updated successfully!');
    this.newPassword = ''; // Clear password after update
  } catch (error) {
    console.error('Error updating password:', error.message);
    alert(error.message);
  }
},

      isValidEmail(email) {
        this.emailTouched = true;
        return /\S+@\S+\.\S+/.test(email);
      },
      isValidPassword(password) {
        this.passwordTouched = true;
        return password.length >= 6;
      }
    }
  };
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