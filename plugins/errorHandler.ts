import ErrorHandler from "~/errorHandler";
import VueToastificationToastManager from "~/errorHandler/VueToastificationToastManager";

export default defineNuxtPlugin(() => {
  const errorHandler = new ErrorHandler({
    toastManager: new VueToastificationToastManager(
      "Brak połączenia z Internetem",
      undefined
    ),
  });

  return {
    provide: {
      errorHandler,
    },
  };
});
