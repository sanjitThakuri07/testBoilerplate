import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const loggedUserDataStore = create<any>()(
  persist(
    (set) => ({
      name: undefined,
      logo: undefined,
      country_code: null,
      setButtonReference: (ref: any) => {
        return set((state: any) => {
          return { ...state };
        });
      },
      setOrgData: (data: any) => {
        set(() => ({
          name: data.name,
          logo: data.logo,
          country_code: data.country_code,
        }));
      },
      clearOrgData: () =>
        set(() => ({
          name: undefined,
          logo: undefined,
          country_code: undefined,
        })),
    }),
    { name: 'orgdata' },
  ),
);
