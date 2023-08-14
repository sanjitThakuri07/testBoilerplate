import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userStoreType, userStoreData } from 'interfaces/userData';

export const userDataStore = create<userStoreType>()(
  persist(
    (set) => ({
      userName: undefined,
      timezone: undefined,
      token: undefined,
      refresh_token: undefined,
      userType: undefined,
      clientId: undefined,
      profilePicture: undefined,
      buttonReference: null,
      setButtonReference: (ref: any) => {
        return set((state: any) => {
          return { ...state, buttonReference: ref };
        });
      },
      setUserData: (data: userStoreData) => {
        set(() => ({
          userName: data.userName,
          timezone: data.timezone,
          token: data.token,
          refresh_token: data.refresh_token,
          userType: data.userType,
          clientId: data.clientId,
          profilePicture: data.profilePicture,
        }));
      },
      clearUserData: () =>
        set(() => ({
          userName: undefined,
          timezone: undefined,
          token: undefined,
          refresh_token: undefined,
          userType: undefined,
          clientId: undefined,
          profilePicture: undefined,
        })),
    }),
    { name: 'userdata' },
  ),
);
