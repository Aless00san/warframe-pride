import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Countdown.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../components/AdminPanel.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/warframe-pride/'),
  routes,
})

export default router
