import Api from "../api/index";

export default defineNuxtPlugin(() => {
  const { apiBase } = useRuntimeConfig().public;

  const api = new Api({ baseUrl: apiBase, requestTimeout: 15000 });

  return {
    provide: {
      api,
    },
  };
});
