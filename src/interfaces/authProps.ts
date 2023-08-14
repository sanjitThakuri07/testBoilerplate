export interface AuthStoreType {
  authenticated: boolean | undefined;
  setAuthenticated: (authenticated: boolean | undefined) => void;
  clearAuthenticated: () => void;
}
