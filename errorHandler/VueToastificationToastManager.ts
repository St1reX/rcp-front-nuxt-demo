import { useToast } from "vue-toastification";
import type { ToastID } from "vue-toastification/dist/types/types";
import ToastManager from "~/errorHandler/common/ToastManager";

export default class VueToastificationToastManager extends ToastManager {
  private _toast = useToast();
  private _toastId?: ToastID;

  error(errorMessage: string) {
    this.clearError();
    this._toastId = this._toast.error(errorMessage, { timeout: false });
  }

  noInternetConnectionError(errorMessage?: string): void {
    if (errorMessage) {
      this._noInternetConnectionErrorMessage = errorMessage;
    }

    this.clearError();
    this._toastId = this._toast.error(this._noInternetConnectionErrorMessage, {
      timeout: false,
      closeOnClick: false,
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      draggable: false,
      showCloseButtonOnHover: false,
    });
  }

  clearError(): void {
    if (this._toastId !== undefined) this._toast.dismiss(this._toastId);
  }
}
