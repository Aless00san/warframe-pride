import { createRouter, createWebHashHistory } from 'vue-router'

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
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory('/warframe-pride/'),
  routes,
})

export default router
