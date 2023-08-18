import create from "zustand";
import { v4 as uuidv4 } from "uuid";
import { responseChoice } from "src/modules/template/itemTypes/itemTypes";
import { deepCloneArray, deepCloneObject } from "src/modules/utils/deepCloneArray";
import { reduceDataSet } from "src/modules/utils/reducedDataSet";
import {
  HasDragLGID,
  updateCorrespondingLabel,
  IntoLogicFunction,
  HasDragDropLGID,
} from "./LogicDrag";
import useUndoRedo from "src/hooks/useUndoRedo";
import { sortObjectKeysToCustomArray } from "src/utils/keyFunction";

export const selectFiledOptions = [
  responseChoice.MULTIPLE,
  responseChoice.GLOBAL,
  responseChoice.EXTERNAL_RESPONSE_SET,
  responseChoice.INTERNAL_RESPONSE_SET,
];

export const selectActionType = {
  CREATE_PAGE: "CREATE_PAGE",
  ADD_QUESTION: "ADD_QUESTION",
  ADD_SECTION: "ADD_SECTION",
};

interface TemplateFieldsState {
  templateHeading: any;
  setTemplateHeading: any;
  templateDatasets: any;
  addNewPageHandler?: any;
  addTemplateQuestion: any;
  addTemplateSection: any;
  addTemplateImage: any;
  deleteTemplateContents: any;
  updateTemplateDatasets: any;
  addTemplateNestedSection: any;
  addTitleAndDescription: any;
  setTemplateDatasets: Function;
  moveItems: Function;
  moveResponseData: Function;
  moveItemBlockSide: Function;
  selectedDataset: any;
  activeLogicBlocks: any;
  setLogicBlocks: any;
  setSelectedData?: Function;
  addLogicData?: Function;
  activePageId?: string | number;
  setActivePageId?: Function;
  // sections actions
  duplicateSectionHandler: any;
  deletePageHandler: any;
  checkCanDrop: any;
  resetTemplateValues: any;
  currentStateIndex?: any;
  pastStates?: any;
  setCurrentStateIndex?: any;
  setPastStates?: any;
}

interface moveItemsProps {
  dragId: string;
  destinationId: string;
}

let logicDataset = {
  id: uuidv4(),
  required: false,
  multipleSelection: false,
  flaggedResponse: [],

  label: "logic",
  component: "logic",
  logics: [
    {
      // id: uuidv4(),
      // condition: 'is',
      // value: 'good',
      // trigger: [],
      // linkQuestions: [],
    },
  ],

  logicReferenceId: null,
  parent: null,
};
var updateTimer: any = null;

const customOrder = [
  "subCategory",
  "subCategoryFindings",
  "subCategoryRecommendations",
  "mainCategoryFindings",
  "mainCategoryFindingsRecommendations",
];

function genereateDatasets({ parentPage, initial = false }: any) {
  const commonId = uuidv4();
  const logicId = uuidv4();
  const myDataset = [
    {
      id: commonId,
      parent: null,
      component: "question",
      parentPage: initial ? 1 : parentPage,
      response_type: "TEXT_001",
      response_choice: "default",
      variables: {
        step: "1",
        min_value: "1",
        max_value: "20",
        date: true,
        time: true,
        // temperature components
        temperatureFormat: "Celcius",
        format: "text",
      },
      type: "text",
      value: "",
      notes: "",
      label: "New Question",
      placeholder: "New Question",
      isImageOpened: false,
      logicReferenceId: null,
      globalLogicReferenceId: null,
      logicId: logicId,
      level: 0,
    },
    {
      id: logicId,
      required: false,
      multipleSelection: false,
      flaggedResponse: [],
      label: "logic",
      component: "logic",
      logics: [],
      logicReferenceId: null,
      parent: commonId,
      globalLogicReferenceId: null,
      parentPage: parentPage,
      level: 0,
    },
  ];
  return myDataset;
}

function generateQuestionDataSet({ updateFields }: any) {
  // update fields will consist of commonId(questionId), logicId,
  // globalLogicReferenceId and logicReferenceId, logicParentId, templateItem
  let {
    commonId,
    logicId,
    globalLogicReferenceId,
    logicReferenceId,
    logicParentId,
    templateItem,
    level,
  } = updateFields;

  let updateQuestionData: any = {
    id: commonId,
    label: ``,
    placeholder: "New Question",
    response_type: "TEXT_001",
    response_choice: "default",
    type: "text",
    variables: {
      step: "1",
      min_value: "1",
      max_value: "20",
      date: true,
      time: true,
      temperatureFormat: "Celcius",
      format: "text",
    },
    component: "question",
    value: "",
    notes: "",
    parent: !logicParentId ? templateItem.parent : templateItem.id,
    parentPage: templateItem.parentPage,
    isImageOpened: false,
    imageFields: null,
    logicReferenceId: logicReferenceId,
    globalLogicReferenceId: globalLogicReferenceId,
    logicId: logicId,
    level,
  };

  let updateLogicData = {
    id: logicId,
    required: false,
    multipleSelection: false,
    flaggedResponse: [],
    label: "logic",
    component: "logic",
    logics: [],
    logicReferenceId: logicReferenceId,
    parent: commonId,
    globalLogicReferenceId: globalLogicReferenceId,
    level,
  };
  return [updateQuestionData, updateLogicData];
}

function generateQuestionDataSetFnR({ updateFields, extraDetails }: any) {
  // update fields will consist of commonId(questionId), logicId,
  // globalLogicReferenceId and logicReferenceId, logicParentId, templateItem
  let {
    commonId,
    logicId,
    globalLogicReferenceId,
    logicReferenceId,
    logicParentId,
    templateItem,
    level,
  } = updateFields;

  let { logicApi, logicData = {}, ...attr } = extraDetails;

  let updateQuestionData: any = {
    id: commonId,
    label: ``,
    placeholder: "New Question",
    // response_type: 'TEXT_001',
    // response_choice: 'internal',
    type: "text",
    variables: {
      step: "1",
      min_value: "1",
      max_value: "20",
      date: true,
      time: true,
      temperatureFormat: "Celcius",
      format: "text",
    },
    component: "question",
    value: "",
    notes: "",
    parent: !logicParentId ? templateItem.parent : templateItem.id,
    parentPage: templateItem.parentPage,
    isImageOpened: false,
    imageFields: null,
    logicReferenceId: logicReferenceId,
    globalLogicReferenceId: globalLogicReferenceId,
    logicId: logicId,
    level,
    logicApi,
    ...attr,
  };

  let updateLogicData = {
    id: logicId,
    required: false,
    multipleSelection: false,
    flaggedResponse: [],
    label: "logic",
    component: "logic",
    logics: [],
    logicReferenceId: logicReferenceId,
    parent: commonId,
    globalLogicReferenceId: globalLogicReferenceId,
    level,
    logicApi,
    ...logicData,
  };
  return [updateQuestionData, updateLogicData];
}

function generateSectionDataSet({ updateFields }: any) {
  // update fields will contain template item, logicReferenceId, globalLogicReferenceId
  let { templateItem, logicReferenceId, globalLogicReferenceId, level } = updateFields;
  // current template item
  const newId = uuidv4();
  let logicId = uuidv4();
  let commonId = uuidv4();

  let updatedSectionData: any = {
    id: newId,
    label: `New Section label`,
    placeholder: "New Section Label",
    component: "section",
    parent: templateItem.parent,
    parentPage: templateItem.parentPage,
    logicReferenceId: logicReferenceId,
    globalLogicReferenceId: globalLogicReferenceId,
    level,
  };

  let updatedNewQuestionData: any = {
    id: commonId,
    label: "Label",
    placeholder: "Label",
    response_type: "TEXT_001",
    response_choice: "default",
    variables: {
      // temperature components
      temperatureFormat: "Celcius",
      format: "text",
    },
    value: "",
    notes: "",
    component: "question",
    type: "text",
    parent: newId,
    parentPage: templateItem.parentPage,
    isImageOpened: false,
    logic: {
      required: false,
      multipleSelection: false,
      flaggedResponse: [],
      logics: [],
    },
    logicReferenceId: logicReferenceId,
    globalLogicReferenceId: globalLogicReferenceId,
    logicId: logicId,
    level: level + 1,
  };

  let updatedLogic = {
    id: logicId,
    required: false,
    multipleSelection: false,
    flaggedResponse: [],

    label: "logic",
    component: "logic",
    logics: [],
    parent: commonId,
    logicReferenceId: logicReferenceId,
    globalLogicReferenceId: globalLogicReferenceId,
    level: level + 1,
  };

  return [updatedSectionData, updatedNewQuestionData, updatedLogic];
}

function generateTemplateDatasets({ action, initial = false, updateFields }: any) {
  switch (action) {
    case selectActionType.CREATE_PAGE:
      const pageId = !initial ? uuidv4() : 1;
      const generateQnLg = genereateDatasets({ parentPage: pageId });
      return [
        {
          id: pageId,
          component: "page",
          parent: null,
          label: `Page`,
          placeholder: "Page",
          description:
            " Title page is the first page of your inspection report. You can customise it below",
        },
        ...generateQnLg,
      ];
    case selectActionType.ADD_QUESTION:
      return [...generateQuestionDataSet({ updateFields })];
    case selectActionType.ADD_SECTION:
      return [...generateSectionDataSet({ updateFields })];
    default:
      return [];
  }
}

// let [currentState, setNewState, undo, redo] = useUndoRedo('');
export const useTemplateFieldsStore = create<any>((set: any) => ({
  activeLogicBlocks: {},
  currentStateIndex: -1,
  pastStates: [],
  updateData: "sh",
  fnrFields: {},
  isLoading: false,
  // setTemplateDatasets: (newState: any) =>
  //   set((state: any) => ({
  //     templateDatasets: newState,
  //     currentStateIndex: state.currentStateIndex,
  //     pastStates: state.pastStates,
  //   })),

  setPastStates: (newPastStates: any) =>
    set((state: any) => ({
      templateDatasets: state.templateDatasets,
      currentStateIndex: state.currentStateIndex,
      pastStates: newPastStates,
    })),
  templateHeading: {
    headerImage: null,
    templateTitle: "",
    templateDescription: "",
  },

  setTemplateHeading: (keyname: any, value: any) => {
    return set((state: any) => {
      return {
        templateHeading: {
          ...state.templateHeading,
          [`${keyname}`]: value,
        },
      };
    });
  },

  rightSectionTabValue: "1",
  selectedDataset: undefined,
  activePageId: 1,

  setActivePageId: ({ pageId }: any) => {
    return set((state: any) => {
      return { ...state, activePageId: pageId };
    });
  },

  templateDatasets: [
    ...generateTemplateDatasets({ action: selectActionType.CREATE_PAGE, initial: true }),
  ],

  resetTemplateValues: () =>
    set((state: any) => {
      return {
        ...state,
        templateDatasets: [
          ...generateTemplateDatasets({ action: selectActionType.CREATE_PAGE, initial: true }),
        ],
        activePageId: 1,
        templateHeading: {
          headerImage: null,
          templateTitle: "",
          templateDescription: "",
        },
      };
    }),

  // creating new page
  addNewPageHandler: () => {
    const generatePageQnLg = deepCloneArray(
      generateTemplateDatasets({ action: selectActionType.CREATE_PAGE }),
    );
    set((state: any) => ({
      templateDatasets: [...state.templateDatasets, ...generatePageQnLg],
      activePageId: generatePageQnLg?.[0]?.id ? generatePageQnLg?.[0]?.id : 1,
    }));

    // set((state: any) => {
    //   return {
    //     currentStateIndex: state.currentStateIndex + 1,
    //     pastStates: [
    //       ...state.pastStates.slice(0, state.currentStateIndex + 1),
    //       [...state.templateDatasets, ...generatePageQnLg],
    //     ],
    //   };
    // });
  },

  deletePageHandler: ({ pageId }: any) => {
    return set((state: any) => ({
      ...state,
      templateDatasets: state.templateDatasets.filter((it: any) => it.id !== pageId),
    }));
  },
  addNestedTemplateQuestion: (
    templateItem: any,
    id: number,
    askQuestionId?: string,
    logicParentId?: string,
  ) => {
    let newArr: any = [];
    set((state: any) => {
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      newArr = deepCloneArray(state.templateDatasets);
      // if(!logicParentId )
      let logicReferenceId = logicParentId
        ? `${templateItem.id}[logicParentId]${logicParentId}`
        : templateItem?.logicReferenceId
        ? templateItem?.logicReferenceId
        : null;
      // let globalLogicReferenceId = templateItem?.globalLogicReferenceId
      //   ? templateItem?.globalLogicReferenceId
      //   : templateItem.logicReferenceId == null
      //   ? `${templateItem.id}[logicParentId]${logicParentId}`
      //   : null;
      let globalLogicReferenceId = templateItem?.globalLogicReferenceId
        ? templateItem?.globalLogicReferenceId
        : templateItem.logicReferenceId === null
        ? logicParentId
          ? `${templateItem.id}[logicParentId]${logicParentId}`
          : null
        : null;
      let commonId = askQuestionId ? askQuestionId : uuidv4();
      let logicId = uuidv4();
      let level = templateItem?.component === "logic" ? (templateItem?.level || 0) + 1 : 0;

      let generateQnLogic = deepCloneArray(
        generateTemplateDatasets({
          action: selectActionType.ADD_QUESTION,
          updateFields: {
            commonId,
            logicId,
            globalLogicReferenceId,
            logicReferenceId,
            templateItem,
            logicParentId: true,
            level,
          },
        }),
      );

      let updateQuestionData: any = generateQnLogic?.[0];
      let updateLogicData = generateQnLogic?.[1];

      let logicID = logicReferenceId?.split("[logicParentId]")?.[0];
      let foundParentIndex = newArr.findIndex((data: any) => data?.id === logicID);
      let tabId = logicReferenceId?.split("[logicParentId]")?.reverse()?.[0] || "";
      let activeBlock: any = {};
      if (!logicParentId && logicReferenceId) {
        // get the parent  and track the logic tab id from logicReferenceId and the id of new updateQuestionData
        let { parent, logicReferenceId, id } = updateQuestionData;
        if (foundParentIndex != -1) {
          let blockId = newArr?.[`${foundParentIndex}`]?.id;
          // getting the linkQuestions

          let finalData = newArr[foundParentIndex]?.logics?.find((data: any) => data?.id === tabId);
          const linkQuestionDestinationIndex =
            finalData?.linkQuestions?.length &&
            finalData?.linkQuestions?.findIndex((qn: string) => qn === templateItem?.id);
          if (linkQuestionDestinationIndex != -1) {
            finalData?.linkQuestions?.splice(linkQuestionDestinationIndex + 1, 0, id);
          } else {
            finalData?.linkQuestions?.push(id);
          }
          finalData.linkQuestions = [...new Set(finalData?.linkQuestions)];
          // after this we also need to update the id in the view part
          // that is activeBlocks
          activeBlock = deepCloneObject(state.activeLogicBlocks);
          let activeBlockIds = activeBlock?.[blockId]?.[tabId];
          if (Array.isArray(activeBlockIds)) {
            activeBlockIds.push(id, updateLogicData?.id);
          }

          newArr?.splice(foundIndex + 1, 0, updateQuestionData, updateLogicData);
          return { ...state, templateDatasets: newArr, activeLogicBlocks: activeBlock };
        }
      } else {
        if (foundParentIndex != -1) {
          let { parent, logicReferenceId, id } = updateQuestionData;
          let blockId = newArr?.[`${foundParentIndex}`]?.id;
          activeBlock = deepCloneObject(state.activeLogicBlocks);
          let activeBlockIds = activeBlock?.[blockId]?.[tabId];
          if (Array.isArray(activeBlockIds)) {
            activeBlockIds.push(id, updateLogicData?.id);
          }
        }
      }

      newArr?.splice(foundIndex + 1, 0, updateQuestionData, updateLogicData);
      return { ...state, templateDatasets: newArr, activeLogicBlocks: activeBlock };
    });
    set((state: any) => {
      return {
        currentStateIndex: state.currentStateIndex + 1,
        pastStates: [...state.pastStates.slice(0, state.currentStateIndex + 1), newArr],
      };
    });
  },
  addTemplateQuestion: (
    templateItem: any,
    id: number,
    askQuestionId?: string,
    logicParentId?: string,
  ) => {
    var newArr: any = [];
    set((state: any) => {
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      newArr = deepCloneArray(state.templateDatasets);
      // if(!logicParentId )
      let logicReferenceId = logicParentId
        ? `${templateItem.id}[logicParentId]${logicParentId}`
        : templateItem?.logicReferenceId
        ? templateItem?.logicReferenceId
        : null;
      // let globalLogicReferenceId = templateItem?.globalLogicReferenceId
      //   ? templateItem?.globalLogicReferenceId
      //   : templateItem.logicReferenceId == null
      //   ? `${templateItem.id}[logicParentId]${logicParentId}`
      //   : null;
      let globalLogicReferenceId = templateItem?.globalLogicReferenceId
        ? templateItem?.globalLogicReferenceId
        : templateItem.logicReferenceId === null
        ? logicParentId
          ? `${templateItem.id}[logicParentId]${logicParentId}`
          : null
        : null;
      let commonId = askQuestionId ? askQuestionId : uuidv4();
      let logicId = uuidv4();
      let level = templateItem?.component === "logic" ? (templateItem?.level || 0) + 1 : 0;

      let generateQnLogic = deepCloneArray(
        generateTemplateDatasets({
          action: selectActionType.ADD_QUESTION,
          updateFields: {
            commonId,
            logicId,
            globalLogicReferenceId,
            logicReferenceId,
            templateItem,
            logicParentId,
            level,
          },
        }),
      );

      let updateQuestionData: any = generateQnLogic?.[0];
      let updateLogicData = generateQnLogic?.[1];

      let logicID = logicReferenceId?.split("[logicParentId]")?.[0];
      let foundParentIndex = newArr.findIndex((data: any) => data?.id === logicID);
      let tabId = logicReferenceId?.split("[logicParentId]")?.reverse()?.[0] || "";
      let activeBlock: any = {};
      if (!logicParentId && logicReferenceId) {
        // get the parent  and track the logic tab id from logicReferenceId and the id of new updateQuestionData
        let { parent, logicReferenceId, id } = updateQuestionData;
        if (foundParentIndex != -1) {
          let blockId = newArr?.[`${foundParentIndex}`]?.id;
          // getting the linkQuestions

          let finalData = newArr[foundParentIndex]?.logics?.find((data: any) => data?.id === tabId);
          const linkQuestionDestinationIndex =
            finalData?.linkQuestions?.length &&
            finalData?.linkQuestions?.findIndex((qn: string) => qn === templateItem?.id);
          if (linkQuestionDestinationIndex != -1) {
            finalData?.linkQuestions?.splice(linkQuestionDestinationIndex + 1, 0, id);
          } else {
            finalData?.linkQuestions?.push(id);
          }
          finalData.linkQuestions = [...new Set(finalData?.linkQuestions)];
          // after this we also need to update the id in the view part
          // that is activeBlocks
          activeBlock = deepCloneObject(state.activeLogicBlocks);
          let activeBlockIds = activeBlock?.[blockId]?.[tabId];
          if (Array.isArray(activeBlockIds)) {
            activeBlockIds.push(id, updateLogicData?.id);
          }

          newArr?.splice(foundIndex + 1, 0, updateQuestionData, updateLogicData);
          return { ...state, templateDatasets: newArr, activeLogicBlocks: activeBlock };
        }
      } else {
        if (foundParentIndex != -1) {
          let { parent, logicReferenceId, id } = updateQuestionData;
          let blockId = newArr?.[`${foundParentIndex}`]?.id;
          activeBlock = deepCloneObject(state.activeLogicBlocks);
          let activeBlockIds = activeBlock?.[blockId]?.[tabId];
          if (Array.isArray(activeBlockIds)) {
            activeBlockIds.push(id, updateLogicData?.id);
          }
        }
      }

      newArr?.splice(foundIndex + 1, 0, updateQuestionData, updateLogicData);
      // setNewState(newArr);
      // setTemplateDatasets(newState);
      // setCurrentStateIndex(currentStateIndex + 1);
      // setPastStates([...pastStates.slice(0, currentStateIndex + 1), newState]);
      return {
        ...state,
        templateDatasets: newArr,
        activeLogicBlocks: activeBlock,
        // currentStateIndex: 100,
      };
    });
    set((state: any) => {
      return {
        currentStateIndex: state.currentStateIndex + 1,
        pastStates: [...state.pastStates.slice(0, state.currentStateIndex + 1), newArr],
      };
    });
  },

  addTemplateSection: (
    templateItem: any,
    id: number,
    logicReferenceId?: string,
    globalLogicReferenceId?: string,
  ) => {
    let newArr: any = [];
    set((state: any) => {
      newArr = deepCloneArray(state.templateDatasets);
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      let level = templateItem.level || 0;
      let generateSectionQnLg = deepCloneArray(
        generateTemplateDatasets({
          action: selectActionType.ADD_SECTION,
          updateFields: {
            templateItem,
            globalLogicReferenceId,
            logicReferenceId,
            level,
          },
        }),
      );
      let updatedSectionData: any = generateSectionQnLg?.[0];
      let updatedNewQuestionData: any = generateSectionQnLg?.[1];
      let updatedLogic = generateSectionQnLg?.[2];
      // ======= for setting activeDatasets and updated in logic section (linking the questions) =====
      let logicID = logicReferenceId?.split("[logicParentId]")?.[0];
      let foundParentIndex = newArr.findIndex((data: any) => data?.id === logicID);
      let tabId = logicReferenceId?.split("[logicParentId]")?.reverse()?.[0] || "";
      let activeBlock: any = {};
      if (logicReferenceId) {
        // get the parent  and track the logic tab id from logicReferenceId and the id of new updateQuestionData
        let { parent, logicReferenceId, id } = updatedSectionData;
        if (foundParentIndex != -1) {
          let blockId = newArr?.[`${foundParentIndex}`]?.id;
          // getting the linkQuestions
          let finalData = newArr[foundParentIndex]?.logics?.find((data: any) => data?.id === tabId);
          const linkQuestionDestinationIndex =
            finalData?.linkQuestions?.length &&
            finalData?.linkQuestions?.findIndex((qn: string) => qn === templateItem?.id);
          if (linkQuestionDestinationIndex != -1) {
            finalData?.linkQuestions?.splice(
              linkQuestionDestinationIndex + 1,
              0,
              id,
              updatedNewQuestionData?.id,
            );
          } else {
            finalData?.linkQuestions?.push(id, updatedNewQuestionData?.id);
          }
          // after this we also need to update the id in the view part
          // that is activeBlocks
          activeBlock = deepCloneObject(state.activeLogicBlocks);
          let activeBlockIds = activeBlock?.[blockId]?.[tabId];
          if (Array.isArray(activeBlockIds)) {
            activeBlockIds.push(id, updatedNewQuestionData?.id, updatedLogic?.id);
          }

          newArr?.splice(
            foundIndex + 1,
            0,
            updatedSectionData,
            updatedNewQuestionData,
            updatedLogic,
          );
          return { ...state, templateDatasets: newArr, activeLogicBlocks: activeBlock };
        }
      } else {
        if (foundParentIndex != -1) {
          let { parent, logicReferenceId, id } = updatedSectionData;
          let blockId = newArr?.[`${foundParentIndex}`]?.id;
          activeBlock = deepCloneObject(state.activeLogicBlocks);
          let activeBlockIds = activeBlock?.[blockId]?.[tabId];
          if (Array.isArray(activeBlockIds)) {
            activeBlockIds.push(id, updatedNewQuestionData?.id, updatedLogic?.id);
          }
        }
      }

      newArr?.splice(foundIndex + 1, 0, updatedSectionData, updatedNewQuestionData, updatedLogic);
      //   setDataset(newArr);
      return { ...state, templateDatasets: newArr, activeLogicBlocks: activeBlock };
    });
    set((state: any) => {
      return {
        currentStateIndex: state.currentStateIndex + 1,
        pastStates: [...state.pastStates.slice(0, state.currentStateIndex + 1), newArr],
      };
    });
  },

  // deleting the entire template contents
  deleteTemplateContents: (templateContentId: string | number) => {
    return set((state: any) => ({
      templateDatasets: state.templateDatasets.filter((item: any) => item.id !== templateContentId),
    }));
  },

  addTemplateNestedSection: (templateItem: any, id: number) =>
    set((state: any) => {
      let newArr = [...state.templateDatasets];
      const newId = uuidv4();
      const logicId = uuidv4();
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      newArr?.splice(
        foundIndex + 1,
        0,
        {
          id: newId,
          component: "section",
          parent: templateItem.parent,
          parentPage: templateItem.parentPage,
          isLast: true,
          logicReferenceId: null,
          globalLogicReferenceId: null,
          logicId: logicId,
        },
        {
          id: uuidv4(),
          label: "New  Nested section Question",
          response_type: "TEXT_001",
          response_choice: "default",
          variables: {
            temperatureFormat: "Celcius",
            format: "text",
          },
          value: "",
          notes: "",
          component: "question",
          parent: newId,
          parentPage: templateItem.parentPage,
          isImageOpened: false,
          logicReferenceId: null,
          logic: {
            required: false,
            multipleSelection: false,
            flaggedResponse: [],
            logics: [
              {
                id: uuidv4(),
                condition: "is",
                value: "good",
                trigger: [],
                linkQuestions: [],
              },
            ],
          },
        },
      );
      return (state.templateDatasets = newArr);
    }),

  addTemplateImage: (templateItem: any, id: number) =>
    set((state: any) => {
      let newArr = [...state.templateDatasets];
      const newId = uuidv4();
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      newArr?.splice(foundIndex + 1, 0, {
        id: uuidv4(),
        label: "Label",
        response_type: "TEXT_001",
        value: "",
        component: "question",
        parent: null,
        parentPage: templateItem.parentPage,
        isImageOpened: true,
      });
      return (state.templateDatasets = newArr);
    }),

  addTitleAndDescription: (templateItem: any, id: number) =>
    set((state: any) => {
      let newArr = [...state.templateDatasets];
      const newId = uuidv4();
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      newArr?.splice(foundIndex + 1, 0, {
        id: uuidv4(),
        label: "New Question",
        response_type: "TEXT_001",
        value: "",
        component: "titleDescription",
        parent: templateItem.parent,
        parentPage: templateItem.parentPage,
        isImageOpened: false,
      });
      return (state.templateDatasets = newArr);
    }),
  updateTemplateDatasets: (templateItem: any, keyName: any, value: any) => {
    clearTimeout(updateTimer);

    let newState: any = [];
    set((state: any) => {
      newState = state.templateDatasets?.map((obj: any) => {
        // 👇️ if id equals 2, update country property
        if (obj.id.toString() === templateItem?.id.toString()) {
          return {
            ...obj,
            [`${keyName}`]: value,
            // titleAndDescName: name,
          };
        }
        // 👇️ otherwise return the object as it is
        return obj;
      });
      const findActiveData = newState.find((it: any) => it.id === templateItem.id);
      return { ...state, templateDatasets: newState, selectedDataset: findActiveData };
    });
    updateTimer = setTimeout(() => {
      set((state: any) => {
        return {
          currentStateIndex: state.currentStateIndex + 1,
          pastStates: [...state.pastStates.slice(0, state.currentStateIndex + 1), newState],
        };
      });
    }, 500);
  },
  updateTemplateDatasetsBeta: ({ selectedDataset, key, value, dataObjects }: any) => {
    let newState: any = [];
    set((state: any) => {
      newState = state.templateDatasets?.map((obj: any) => {
        // 👇️ if id equals 2, update country property
        if (obj?.id.toString() === selectedDataset?.id?.toString()) {
          return {
            ...obj,
            ...dataObjects,
            // [`${keyName}`]: value,
            // titleAndDescName: name,
          };
        }
        // 👇️ otherwise return the object as it is
        return obj;
      });
      const findActiveData = newState.find((it: any) => it?.id === selectedDataset?.id);
      return { ...state, templateDatasets: newState, selectedDataset: findActiveData };
    });
    if (key !== "logic")
      set((state: any) => {
        // setInterval(() => {
        return {
          currentStateIndex: state.currentStateIndex + 1,
          pastStates: [...state.pastStates.slice(0, state.currentStateIndex + 1), newState],
        };
        // }, 5000);
      });
  },

  setSelectedData: (templateItem: any) =>
    set((state: any) => ({
      ...state,
      selectedDataset: templateItem,
    })),

  // section actions buttons
  duplicateSectionHandler: () => set((state: any) => {}),

  setTemplateDatasets: (datas: any) => {
    set((state: any) => {
      if (datas) {
        state.templateDatasets = datas;
        // return (state.templateDatasets = datas);
        state.currentStateIndex = state.currentStateIndex;
        state.pastStates = state.pastStates;
      }
      return state;
    });
  },
  moveItems: ({ dragId, destinationId }: moveItemsProps) => {
    // clearTimeout(updateTimer);
    if (dragId === destinationId) return;
    let prevTemplateDatasets: any = [];
    set((state: any) => {
      // need to create this drag object because in
      // edit we get error like can not assign to read only field
      let dragObject: any = {};
      // let prevTemplateDatasets = [...state?.templateDatasets];
      prevTemplateDatasets = deepCloneArray(state?.templateDatasets);
      let datas = prevTemplateDatasets?.reduce((acc: any, obj: any, index: any) => {
        if (obj.id === dragId) {
          acc.drag = obj;
          acc.dragIndex = index;
        }
        if (obj?.id === destinationId) {
          acc.destination = obj;
          acc.destinationIndex = index;
        }
        return acc;
      }, {});

      const foundQuestionDestinationLogic = prevTemplateDatasets?.find(
        (it: any) => it?.id === datas?.drag?.logicId,
      );

      // update the parent for drag => because we need to asign it according to nested level or out level
      dragObject = { ...datas.drag };
      let activeDatas: any = deepCloneObject(state.activeLogicBlocks);
      if (datas?.destination?.parent || datas?.drag?.parent) {
        // dragObject.globalLogicReferenceId = datas?.destination.globalLogicReferenceId || null;
        // dragObject.logicReferenceId = datas?.destination.logicReferenceId || null;
      }

      // here we focused on the drag object because of the activeBlockData
      // as we need to remove it from the link question of that logics as well as the active datasets
      let activeBlocks = deepCloneObject(state.activeLogicBlocks);
      dragObject.level = datas?.destination?.level || 0;
      // if (dragObject.component === 'section') {
      // }
      if (foundQuestionDestinationLogic) {
        foundQuestionDestinationLogic.level = datas?.destination?.level || 0;
      }
      updateCorrespondingLabel({
        data: prevTemplateDatasets,
        childId: dragObject?.id,
        level: dragObject.level,
        type: datas.component,
      });

      if (
        datas?.drag?.globalLogicReferenceId &&
        datas?.drag?.logicReferenceId &&
        !datas?.destination?.logicReferenceId &&
        !datas?.destination?.globalLogicReferenceId
      ) {
        HasDragLGID({ datas, activeBlocks, activeDatas, prevTemplateDatasets });
      } else if (
        !datas?.drag?.logicReferenceId &&
        !datas?.drag?.globalLogicReferenceId &&
        !datas?.destination?.logicReferenceId &&
        !datas?.destination?.globalLogicReferenceId
      ) {
        if (Object.keys(activeBlocks || {})?.length) {
          let value = [
            ...(activeBlocks?.[
              `${datas?.drag?.globalLogicReferenceId?.split("[logicParentId]")?.[0]}`
            ]?.[
              `${datas?.drag?.globalLogicReferenceId?.split("[logicParentId]")?.reverse()?.[0]}`
            ] || []),
          ]?.filter((id: any) => id !== datas?.drag?.id);
          activeDatas = {
            ...activeBlocks,
            [`${datas?.drag?.globalLogicReferenceId?.split("[logicParentId]")?.[0]}`]: {
              ...[`${datas?.drag?.globalLogicReferenceId?.split("[logicParentId]")?.[0]}`],
              [`${datas?.drag?.globalLogicReferenceId?.split("[logicParentId]")?.reverse()?.[0]}`]:
                value,
            },
          };
        }
      }

      if (
        datas?.destination?.logicReferenceId &&
        datas?.destination?.globalLogicReferenceId &&
        !datas?.drag?.globalLogicReferenceId &&
        !datas?.drag?.logicReferenceId
      ) {
        IntoLogicFunction({
          datas,
          activeBlocks,
          activeDatas: (val: any) => {
            activeDatas = val;
          },
          prevTemplateDatasets,
          state,
          dragObject,
        });
      }

      // case for the destination global and logic reference id
      if (
        datas?.drag?.globalLogicReferenceId &&
        datas?.drag?.logicReferenceId &&
        datas?.destination?.logicReferenceId &&
        datas?.destination?.globalLogicReferenceId
      ) {
        HasDragDropLGID({ datas, activeBlocks, activeDatas, prevTemplateDatasets });
      } else if (!datas?.destination?.logicReferenceId && datas?.globalLogicReferenceId) {
      }
      // here we interchange the corresponding parent datas
      dragObject.parent = datas.destination.parent || null;
      dragObject.globalLogicReferenceId = datas?.destination?.globalLogicReferenceId || null;
      dragObject.logicReferenceId = datas?.destination?.logicReferenceId || null;
      dragObject.parentPage = datas?.destination.parentPage || null;

      if (!datas?.dragIndex && !datas?.destinationIndex) return;
      // it is what interchanges our datasets
      const [removed] = prevTemplateDatasets?.splice(datas?.dragIndex, 1);
      prevTemplateDatasets?.splice(datas?.destinationIndex, 0, dragObject);
      return { ...state, templateDatasets: prevTemplateDatasets, activeLogicBlocks: activeDatas };
      // return { ...state, templateDatasets: prevTemplateDatasets };
      return state;
    });
    // set((state: any) => {
    //   return {
    //     currentStateIndex: state.currentStateIndex + 1,
    //     pastStates: [
    //       ...state.pastStates.slice(0, state.currentStateIndex + 1),
    //       prevTemplateDatasets,
    //     ],
    //   };
    // });

    // updateTimer = setTimeout(() => {
    //   set((state: any) => {
    //     return {
    //       currentStateIndex: state.currentStateIndex + 1,
    //       pastStates: [
    //         ...state.pastStates.slice(0, state.currentStateIndex + 1),
    //         prevTemplateDatasets,
    //       ],
    //     };
    //   });
    // }, 500);
  },
  moveResponseData: ({ destinationId, responseData }: any) => {
    let { response_choice, response_type, responseOptionsData, attr }: any = responseData;
    set((state: any) => {
      // it is what interchanges our datasets
      return {
        ...state,
        templateDatasets: state.templateDatasets.map((templateData: any) => {
          if (destinationId === templateData?.id) {
            // question or section
            let responseObj = {};
            if (response_choice !== "default") {
              responseObj = {
                response_choice: response_choice,
                response_type: response_type,
                type: response_choice !== "external" ? "Array" : "text",
                logicApi: {
                  url: responseOptionsData?.url || responseOptionsData?.id,
                  response_choice,
                  field:
                    responseChoice.MULTIPLE === response_choice ||
                    responseChoice.GLOBAL === response_choice
                      ? "name"
                      : responseOptionsData?.field || "",
                  storeKey: response_type,
                  // apiOptions: responseOptionsData?.options || null,
                },
              };
            } else if (response_choice === "default") {
              responseObj = {
                response_choice: "default",
                type: attr?.type || "text",
                response_type: response_type,
              };
            }

            return {
              ...templateData,
              ...responseObj,
            };
          } else if (destinationId === templateData?.parent) {
            // logic => modifying in logic
            let options = [];
            if (
              responseChoice.MULTIPLE === response_choice ||
              responseChoice.GLOBAL === response_choice
            ) {
              options = responseOptionsData?.options?.map((it: any) => it?.name);
            } else if (responseChoice.INTERNAL_RESPONSE_SET === response_choice) {
              options = responseOptionsData?.options?.map(
                (it: any) => it?.[responseOptionsData?.field || "name"],
              );
            } else if (responseChoice.EXTERNAL_RESPONSE_SET) {
            }

            return {
              ...templateData,
              logicOptions: response_choice !== responseChoice.EXTERNAL_RESPONSE_SET ? options : [],
              logicApi: {
                url: responseOptionsData?.url || responseOptionsData?.id,
                response_choice,
                field:
                  responseChoice.MULTIPLE === response_choice ||
                  responseChoice.GLOBAL === response_choice
                    ? "name"
                    : responseOptionsData?.field || "",
                storeKey: response_type,
                // apiOptions: responseOptionsData?.options || null,
              },
              selectField: selectFiledOptions.includes(response_choice) ? true : false,
            };
          }
          return templateData;
        }),
      };
    });
    updateTimer = setTimeout(() => {
      set((state: any) => {
        return {
          currentStateIndex: state.currentStateIndex + 1,
          pastStates: [
            ...state.pastStates.slice(0, state.currentStateIndex + 1),
            state.templateDatasets.map((templateData: any) => {
              if (destinationId === templateData?.id) {
                // question or section
                let responseObj = {};
                if (response_choice !== "default") {
                  responseObj = {
                    response_choice: response_choice,
                    response_type: response_type,
                    type: response_choice !== "external" ? "Array" : "text",
                  };
                } else if (response_choice === "default") {
                  responseObj = {
                    response_choice: "default",
                    type: attr?.type || "text",
                    response_type: response_type,
                  };
                }

                return {
                  ...templateData,
                  ...responseObj,
                };
              } else if (destinationId === templateData?.parent) {
                // logic => modifying in logic
                let options = [];
                if (
                  responseChoice.MULTIPLE === response_choice ||
                  responseChoice.GLOBAL === response_choice
                ) {
                  options = responseOptionsData?.options?.map((it: any) => it?.name);
                } else if (responseChoice.INTERNAL_RESPONSE_SET === response_choice) {
                  options = responseOptionsData?.options?.map(
                    (it: any) => it?.[responseOptionsData?.field || "name"],
                  );
                } else if (responseChoice.EXTERNAL_RESPONSE_SET) {
                }

                return {
                  ...templateData,
                  logicOptions:
                    response_choice !== responseChoice.EXTERNAL_RESPONSE_SET ? options : [],
                  logicApi: {
                    url: responseOptionsData?.url || responseOptionsData?.id,
                    response_choice,
                    field:
                      responseChoice.MULTIPLE === response_choice ||
                      responseChoice.GLOBAL === response_choice
                        ? "name"
                        : responseOptionsData?.field || "",
                    storeKey: response_type,
                    apiOptions: responseOptionsData?.options || null,
                  },
                  selectField: selectFiledOptions.includes(response_choice) ? true : false,
                };
              }
              return templateData;
            }),
            ,
          ],
        };
      });
    }, 500);
  },
  moveItemBlockSide: ({ dragItem, destinationItem, before }: any) => {
    set((state: any) => {
      if (!dragItem && !destinationItem) {
        return { ...state };
      }
      let prevTemplateDatasets = deepCloneArray(state?.templateDatasets);
      let dragIndex = prevTemplateDatasets.findIndex((it: any) => it.id === dragItem?.id);
      let destinationIndex = prevTemplateDatasets.findIndex(
        (it: any) => it.id === destinationItem?.id,
      );
      dragItem.parent = destinationItem.parent || null;
      // it is what interchanges our datasets
      const [removed] = prevTemplateDatasets?.splice(dragIndex, 1);
      prevTemplateDatasets?.splice(destinationIndex, 0, dragItem);
      // get the current dragId and the destinationId
      // update the parent according to it
      return { ...state, templateDatasets: prevTemplateDatasets };
    });
  },
  setLogicBlocks: (datas: any) => {
    set((state: any) => {
      if (datas) {
        return (state.activeLogicBlocks = { ...datas });
      }
      return state;
    });
  },
  checkCanDrop: () => {
    // if drag item is same as destination
    // can not drop inside its own logic
    return true;
  },
  setCurrentStateIndex: (index: any) => {
    return set((state: any) => {
      return {
        // templateDatasets: state.templateDatasets,
        currentStateIndex: index,
        // pastStates: state.pastStates,
        updateData: "asdfkjn",
      };
    });
  },

  addFnRFields: ({ values, item }: any) => {
    set({ isLoading: true });
    set((state: any) => {
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === item?.id);
      let newArr = deepCloneArray(state.templateDatasets);
      let appendFields: any = [];
      const sortedArray = sortObjectKeysToCustomArray({ obj: values, customOrder });
      // Object.entries(values || {})
      sortedArray?.map((fnrQnVal: any) => {
        let fnrQn = values?.[fnrQnVal];
        let key = fnrQnVal;
        let isQuestionPresent = newArr?.findIndex((it: any) => it?.id === fnrQn?.id);

        if (fnrQn?.state && fnrQn?.label !== "parent") {
          let questionId = fnrQn?.id;
          // do not create the question if present
          if (isQuestionPresent !== -1) return;

          let logicId = uuidv4();
          let fields = generateQuestionDataSetFnR({
            updateFields: { ...item, commonId: questionId, logicId, templateItem: item },
            extraDetails: {
              logicApi: {
                ...(fnrQn?.responseData || {}),
                response_choice: "internal",
                stokeKey: fnrQn?.linkFieldId,
              },
              lock: fnrQn?.lock || true,
              response_choice: "internal",
              label: key,
              type: "Array",
              response_type: fnrQn?.responseData?.id || "",
              filterFields: fnrQn?.filterFields || [],
              linkFieldId: fnrQn?.linkFieldId,
              logicData: {
                selectField: fnrQn?.select || true,
              },
            },
          });
          appendFields?.push(...fields);
        } else if (!fnrQn?.state && fnrQn?.label !== "parent") {
          isQuestionPresent !== -1 && newArr.splice(isQuestionPresent, 1);
        }
      });

      newArr?.splice(foundIndex + 1, 0, ...appendFields);

      return { ...state, isLoading: false, templateDatasets: newArr };
    });
  },
}));
