import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Dashboard', component: () => import('../pages/DashboardPage.vue') },
  { path: '/produtores-rurais', name: 'RuralProducers', component: () => import('../pages/RuralProducersPage.vue') },
  { path: '/propriedades', name: 'Properties', component: () => import('../pages/PropertiesPage.vue') },
  { path: '/rebanhos', name: 'Herds', component: () => import('../pages/HerdsPage.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})