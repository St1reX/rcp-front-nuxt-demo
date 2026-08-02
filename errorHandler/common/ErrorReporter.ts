export default abstract class ErrorReporter {
  abstract reportError(error: Error): void;
}
