import { createRouter, createWebHistory } from 'vue-router'
import Inventory from '../components/Inventory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inventory',
      component: Inventory,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Inventory,
    },
  ],
})

export default router
