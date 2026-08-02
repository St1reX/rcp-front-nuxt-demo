import type { GetMeResponse } from '../types/models/user';

export const useSessionStore = defineStore('session', () => {
  //******GLOBAL SESSION*********
  const session = ref<null | GetMeResponse>(null);

  //******GETTERS*********
  const isAuthenticated = computed(() => !!session.value);

  //******FUNCTIONS*********
  const isInRole = (roleOrRoles: string | string[]) => {
    if (!session.value?.role?.name) return false;

    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.includes(session.value.role.name);
    }
    return session.value.role.name === roleOrRoles;
  };
  const fetchSession = async () => {
    const api = useApi();
    const errorHandler = useErrorHandler();
    const { data: sessionResponse, error } = await api.user.me();

    const fetchError = toValue(error);

    if (fetchError) {
      if (fetchError.statusCode === 401) {
        return;
      }

      errorHandler.handleFetchErrorSSR(
        fetchError,
        'Błąd podczas ładowania profilu użytkownika'
      );
      return;
    }

    session.value = sessionResponse.value;
  };

  return {
    session,
    fetchSession,
    isAuthenticated,
    isInRole,
  };
});
