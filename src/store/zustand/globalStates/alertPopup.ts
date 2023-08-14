import { create } from 'zustand';

interface searchModule {
  app_id?: number;
  id?: number;
  name?: string;
  tag?: string;
}

interface UseAlertPopupI {
  alertContainerValue: string;
  openModalBox: boolean;
  searchValue: string;
  selectedSearchModule: searchModule;
  setAlertContainerValue: Function;
  setOpenModalBox: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSearchModule: React.Dispatch<React.SetStateAction<string>>;
}

export const useAlertPopup = create<UseAlertPopupI>((set) => ({
  alertContainerValue: 'user-alert',
  openModalBox: false,
  searchValue: '',
  selectedSearchModule: {},
  setAlertContainerValue: (payload: any) => set({ alertContainerValue: payload }),
  setSearchValue: (payload: any) => set({ searchValue: payload }),
  setOpenModalBox: (payload: any) => set({ openModalBox: payload }),
  setSelectedSearchModule: (payload: any) => set({ selectedSearchModule: payload }),
}));
