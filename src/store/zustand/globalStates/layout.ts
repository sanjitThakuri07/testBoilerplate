import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { LayoutStoreType } from 'interfaces/layoutProps';

export const useLayoutStore = create<LayoutStoreType>()(
  persist(
    set => ({
      menucollapsed: false,
      setMenuCollapse: isCollapsed =>
        set(() => ({ menucollapsed: isCollapsed })),
      clearLayoutValues: () =>
        set(() => ({ menucollapsed: false, theme: 'blue' })),
      theme: 'blue',
      changeTheme: selectedTheme => set(() => ({ theme: selectedTheme }))
    }),
    { name: 'layout' }
  )
);
