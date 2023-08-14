export interface TextAnswerProps {
  rightSectionTabValue: string;
  setRightSectionTabValue: (value: string) => void;

  question: string[];
  setQuestion: (value: string) => void;

  selectedInputType: { id: string; name: string; type: string; img: string } | any | undefined;
  setSelectedInputType: (value: string) => void;

  selectedInputId: string;
  setSelectedInputId: (value: string) => void;

  selectedInputIdData: { id: string; name: string; type: string; img: string } | any;
  setSelectedInputIdData: (value: {}) => void;
}
