import { SetStateAction } from 'react';
import { create } from 'zustand';

interface IndexManagementI {
  templateIndex: number;
  setTemplateIndex: React.Dispatch<SetStateAction<any>>;
}

export const useIndexManagement = create<IndexManagementI>((set) => ({
  templateIndex: 0,

  setTemplateIndex: (payload: any) => set({ templateIndex: payload }),
}));
