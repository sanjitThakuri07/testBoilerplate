import { v4 as uuidv4 } from 'uuid';

export const TemplateDataStructure = [
  {
    id: 1,
    component: 'page',
    parent: null,
    name: `Page 1`,
    label: `Page 1`,
    questionName: ``,
    SectionName: 'New Section',
    sectionActions: {
      duplicate: false,
      required: false,
      repeatThisSection: false,
    },
    titleAndDescName: 'Title and Description',
    titleAndDescActions: {
      duplicate: false,
      required: false,
    },
    type: '',
    isPageDeleted: false,
    isQuestionDisplayed: true,
    isSectionDisplayed: false,
    isTitleDescriptionDisplayed: false,
  },

  {
    id: uuidv4(),
    parent: null,
    component: 'question',
    parentPage: 1,
    type: '',
    name: 'Question',
    label: 'Question',
    questionName: ``,
    SectionName: 'Section 1',
    sectionActions: {
      duplicate: false,
      required: false,
      repeatThisSection: false,
    },
    titleAndDescName: 'Title and Description',
    titleAndDescActions: {
      duplicate: false,
      required: false,
    },
    isQuestionDisplayed: true,
    isSectionDisplayed: false,
    isTitleDescriptionDisplayed: false,
  },
];
