export {};
declare global {
  module jest {
    interface Matchers<R> {
      toSetDefaultTheme<T>(Component: React.FunctionComponent<T>): {pass: boolean; message: string};
    }
  }
}
