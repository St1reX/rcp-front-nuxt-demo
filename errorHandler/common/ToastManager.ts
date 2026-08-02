export default abstract class ToastManager {
  protected _noInternetConnectionErrorMessage: string;
  protected _noInternetConnectionIcon: any;

  constructor(
    noInternetConnectionErrorMessage: string,
    noInternetConnectionIcon: any
  ) {
    this._noInternetConnectionErrorMessage = noInternetConnectionErrorMessage;
    this._noInternetConnectionIcon = noInternetConnectionIcon;
  }

  abstract error(errorMessage: string): void;
  abstract noInternetConnectionError(errorMessage?: string): void;
  abstract clearError(): void;
}
