import { ROUTES } from '../constants/routes';
import { Roles } from '~/constants/roles';

export default defineNuxtRouteMiddleware(async (to) => {
  //******VARIABLES/STATES*********
  const nuxtApp = useNuxtApp();
  const sessionStore = useSessionStore(nuxtApp.$pinia);

  //******GLOBAL MIDDLEWARE (every route is checked in terms of role/privileges) *********
  await callOnce(sessionStore.fetchSession);
  if (sessionStore.isAuthenticated) {
    if (to.meta.accessibleAfterLogin === false) {
      if (sessionStore.isInRole(Roles.ADMIN)) {
        return navigateTo(ROUTES.AFTER_LOGIN_HOMEPAGE);
      } else if (sessionStore.isInRole(Roles.LEAVES_REQUESTER)) {
        return navigateTo(ROUTES.LEAVES_REQUEST_PAGE);
      } else if (sessionStore.isInRole(Roles.LEAVES_MANAGER)) {
        return navigateTo(ROUTES.LEAVES_MANAGMENT_PAGE);
      } else if (sessionStore.isInRole(Roles.LEAVES_VIEWER)) {
        return navigateTo(ROUTES.LEAVES_VIEW_PAGE);
      }
    }
  }

  if (
    to.path.includes(ROUTES.LEAVES_MANAGMENT_PAGE) &&
    !sessionStore.isInRole([Roles.ADMIN, Roles.LEAVES_MANAGER])
  ) {
    return navigateTo(ROUTES.ROOT_PAGE);
  }

  if (
    to.path.includes(ROUTES.LEAVES_VIEW_PAGE) &&
    !sessionStore.isInRole([Roles.ADMIN, Roles.LEAVES_VIEWER])
  ) {
    return navigateTo(ROUTES.ROOT_PAGE);
  }

  if (
    to.path.includes(ROUTES.LEAVES_REQUEST_PAGE) &&
    !sessionStore.isInRole([
      Roles.LEAVES_REQUESTER,
      Roles.ADMIN,
      Roles.LEAVES_MANAGER,
    ])
  ) {
    return navigateTo(ROUTES.ROOT_PAGE);
  }

  if (
    to.path.includes(ROUTES.DASHBOARD_PAGE) &&
    !sessionStore.isInRole(Roles.ADMIN)
  ) {
    return navigateTo(ROUTES.ROOT_PAGE);
  }

  if (to.path === ROUTES.DASHBOARD_PAGE && !sessionStore.isAuthenticated) {
    return navigateTo(ROUTES.LOGIN_PAGE);
  }
});
