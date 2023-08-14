import { Template } from 'interfaces/templates/template';
import { create } from 'zustand';

export const useTemplate = create<Template>((set) => ({
  templateData: [],
  setTemplateData: (payload: any) => set({ templateData: payload }),
}));
