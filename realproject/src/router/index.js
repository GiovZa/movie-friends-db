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
    }
  ]
})

export default router
