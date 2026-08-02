import type { FetchError } from "ofetch";
import type ErrorReporter from "./common/ErrorReporter";
import type ToastManager from "./common/ToastManager";
import type Configuration from "./configuration";

export default class ErrorHandler {
  // private _errorReporter: ErrorReporter;
  private _toastManager: ToastManager;

  private _isOnline: boolean = true;

  constructor(configuration: Configuration) {
    // this._errorReporter = configuration.reportingClient;
    this._toastManager = configuration.toastManager;
  }

  goOffline(errorMessage: string) {
    this._isOnline = false;
    this._toastManager.noInternetConnectionError(errorMessage);
  }

  goOnline() {
    this._isOnline = true;
    this._toastManager.clearError();
  }

  handleError(error: unknown, contextMessage?: string | null, silent = false) {
    if (!this._isOnline) {
      this._toastManager.noInternetConnectionError();
      return;
    }

    if (!(error instanceof Error)) {
      return;
    }

    // if (silent) {
    //   this._errorReporter.reportError(error);
    //   return;
    // }

    const toastContent = contextMessage
      ? `${contextMessage}:\n${error.message}`
      : error.message;
    this._toastManager.error(toastContent);

    // this._errorReporter.reportError(error);
  }

  handleFetchErrorSSR(
    error: FetchError,
    contextMessage?: string | null,
    silent = false
  ) {
    if (!this._isOnline) {
      this._toastManager.noInternetConnectionError();
      return;
    }

    if (silent || import.meta.server) {
      // this._errorReporter.reportError(error);
      return;
    }

    const toastContent = contextMessage
      ? `${contextMessage}:\n${error.message}`
      : error.message;
    this._toastManager.error(toastContent);
  }

  clearError() {
    this._toastManager.clearError();
  }
}
