export interface userStoreData {
  userName?: string | undefined;
  token?: string | undefined;
  refresh_token?: string | undefined;
  timezone?: string | undefined;
  userType?: string | number | undefined;
  role?: string | number | undefined;
  clientId?: string | number | undefined;
  profilePicture?: string | undefined;
  sidebarPicture?: any;
}
export interface userStoreType {
  userName: string | undefined;
  token: string | undefined;
  refresh_token: string | undefined;
  timezone: string | undefined;
  userType: string | number | undefined;
  clientId: string | number | undefined;
  profilePicture: string | undefined;
  setUserData: (data: userStoreData) => void;
  clearUserData: () => void;
  sidebarPicture?: any;
  buttonReference?: any;
  setButtonReference?: Function;
}
