import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Movies.vue')
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('../views/Movies.vue')
    },
    {
      path: '/search-movies',
      name: 'search-movies',
      component: () => import('../views/SearchMovies.vue')
    },
    {
      path: '/movie/:id',
      name: 'movie',
      component: () => import ('../views/Movie.vue')
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: () => import('../views/LoginPage.vue')
    },
    {
      path: '/signup',
      name: 'SignupPage',
      component: () => import('../views/SignupPage.vue')
    },
    // {
    //   path: '/user',
    //   name: 'UserPage',
    //   component: () => import('../views/UserPage.vue')
    // },
    { path: '/user/:id',
      name: 'User', 
      component: () => import('../views/UserPage.vue'),
      props: true 
    },

    {
      path: '/rank-user-movies',
      name: 'rank-user-movies',
      component: () => import ('../views/RankUserMovies.vue')
    }
  ]
})

export default router
