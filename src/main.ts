import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';
import Tooltip from 'primevue/tooltip';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'sweetalert2/themes/bulma.css';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  },
});
app.use(ToastService);
app.use(router);
app.directive('tooltip', Tooltip);

app.mount('#app');
