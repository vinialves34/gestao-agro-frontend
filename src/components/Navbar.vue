<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const mobileMenuOpen = ref(false);

const navItems = [
  { path: "/", name: "Reports", label: "Relatórios" },
  {
    path: "/produtores-rurais",
    name: "RuralProducers",
    label: "Produtores Rurais",
  },
  { path: "/propriedades", name: "Properties", label: "Propriedades" },
  { path: "/rebanhos", name: "Herds", label: "Rebanhos" },
];

const isActive = (path: string) => route.path === path;

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<template>
  <nav class="bg-white shadow-md border-b border-gray-200">
    <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0">
          <a href="/" class="text-2xl font-bold text-green-700">Gestão Agro</a>
        </div>

        <div class="hidden md:flex space-x-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
              isActive(item.path)
                ? 'bg-green-100 text-green-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            ]"
          >
            {{ item.label }}
          </router-link>
        </div>

        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
          >
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="closeMobileMenu"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200',
              isActive(item.path)
                ? 'bg-green-100 text-green-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            ]"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
