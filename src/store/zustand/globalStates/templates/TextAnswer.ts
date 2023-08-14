import { TextAnswerProps } from 'interfaces/templates/textAnswer';
import { create } from 'zustand';

interface TemplateNodeIndexProps {
  nodeIndex: any;
  setNodeIndex: any;
}

export const useTextAnswer = create<TextAnswerProps>((set) => ({
  rightSectionTabValue: '1',
  setRightSectionTabValue: (payload: any) => set({ rightSectionTabValue: payload }),

  question: [],
  setQuestion: (payload: any) => set({ question: payload }),

  selectedInputType: {
    label: 'Select Response Type',
    value: '',
    Icon: '',
  },
  setSelectedInputType: (payload: any) => set({ selectedInputType: payload }),

  selectedInputId: '',
  setSelectedInputId: (payload: any) => set({ selectedInputId: payload }),

  selectedInputIdData: {
    id: '',
    label: '',
    value: '',
    Icon: '',
  },
  setSelectedInputIdData: (payload: any) => set({ selectedInputIdData: payload }),
}));
