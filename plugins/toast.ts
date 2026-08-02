import Toast, { POSITION, type PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  const pluginOptions: PluginOptions = {
    hideProgressBar: true,
    position: POSITION.BOTTOM_CENTER,
    maxToasts: 5,
    newestOnTop: true,
    timeout: 5000,
    filterBeforeCreate: (toast, toasts) => {
      if (toasts.filter((t) => t.content === toast.content).length !== 0) {
        // Returning false discards the toast
        return false;
      }
      return toast;
    },
  };

  nuxtApp.vueApp.use(Toast, pluginOptions);
});
