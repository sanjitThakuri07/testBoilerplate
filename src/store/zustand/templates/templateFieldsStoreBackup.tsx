import create from "zustand";
import { v4 as uuidv4 } from "uuid";
import { responseChoice } from "src/modules/template/itemTypes/itemTypes";
import { deepCloneArray, deepCloneObject } from "src/modules/utils/deepCloneArray";
import { reduceDataSet } from "src/modules/utils/reducedDataSet";

export const selectFiledOptions = [
  responseChoice.MULTIPLE,
  responseChoice.GLOBAL,
  responseChoice.EXTERNAL_RESPONSE_SET,
  responseChoice.INTERNAL_RESPONSE_SET,
];

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
  name: "logic",
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
      annotationLabel: "",
      annotationImg: "",
      annotationDesc: "",
      name: "Question",
      label: "Question",
      sectionActions: {
        duplicate: false,
        required: false,
        repeatThisSection: false,
      },

      imageLabel: "",
      imageImg: "",
      imageDesc: "",
      titleAndDescValue: "",
      titleAndDescActions: {
        duplicate: false,
        required: false,
      },
      isImageOpened: false,
      logicReferenceId: null,
      globalLogicReferenceId: null,
      logicId: logicId,
    },
    {
      id: logicId,
      required: false,
      multipleSelection: false,
      flaggedResponse: [],
      name: "logic",
      label: "logic",
      component: "logic",
      logics: [],
      logicReferenceId: null,
      parent: commonId,
      globalLogicReferenceId: null,
      parentPage: parentPage,
    },
  ];
  return myDataset;
}

function generateTemplateDatasets({ type, initial = false }: any) {
  switch (type) {
    case "page":
      const pageId = !initial ? uuidv4() : 1;
      const generateQnLg = genereateDatasets({ parentPage: pageId });
      return [
        {
          id: pageId,
          component: "page",
          parent: null,
          name: `Page 1`,
          label: `Page 1`,
          sectionActions: {
            duplicate: false,
            required: false,
            repeatThisSection: false,
          },
          imageLabel: "",
          imageImg: "",
          imageDesc: "",
          titleAndDescValue: "",
          titleAndDescActions: {
            duplicate: false,
            required: false,
          },
          type: "",
          isPageDeleted: false,
          isImageOpened: false,
        },
        ...generateQnLg,
      ];
    default:
      return [];
  }
}

export const useTemplateFieldsStore = create<TemplateFieldsState>((set) => ({
  activeLogicBlocks: {},
  templateHeading: {
    headerImage: null,
    templateTitle: "",
    templateDescription: "",
  },
  setTemplateHeading: (keyname: any, value: any) => {
    return set((state) => {
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

  templateDatasets: [...generateTemplateDatasets({ type: "page", initial: true })],

  // creating new page
  addNewPageHandler: () => {
    let pageId = uuidv4();
    const commonId = uuidv4();
    return set((state) => ({
      templateDatasets: [
        ...state.templateDatasets,
        {
          id: pageId,
          component: "page",
          parent: null,
          name: `Page`,
          label: `Page`,
          response_type: "TEXT_001",
          response_choice: "default",
          sectionActions: {
            duplicate: false,
            required: false,
            repeatThisSection: false,
          },
          imageLabel: "",
          imageImg: "",
          imageDesc: "",
          titleAndDescValue: "",
          titleAndDescActions: {
            duplicate: false,
            required: false,
          },
          isPageDeleted: true,
          isImageOpened: false,
        },
        {
          id: commonId,
          name: "New Question",
          label: "Label",
          response_type: "TEXT_001",
          response_choice: "default",
          variables: {
            // temperature components
            temperatureFormat: "Celcius",
            format: "text",
          },
          value: "",
          notes: "",
          logicReferenceId: null,
          annotationLabel: "",
          annotationImg: "",
          annotationDesc: "",
          sectionActions: {
            duplicate: false,
            required: false,
            repeatThisSection: false,
          },
          imageLabel: "",
          imageImg: "",
          imageDesc: "",
          titleAndDescValue: "",
          titleAndDescActions: {
            duplicate: false,
            required: false,
          },
          component: "question",
          parent: null,
          parentPage: pageId,
          isImageOpened: false,
        },
        {
          id: uuidv4(),
          required: false,
          multipleSelection: false,
          flaggedResponse: [],
          name: "logic",
          label: "logic",
          component: "logic",
          logics: [],
          logicReferenceId: null,
          parent: commonId,
          globalLogicReferenceId: null,
        },
      ],
    }));
  },

  addTemplateQuestion: (
    templateItem: any,
    id: number,
    askQuestionId?: string,
    logicParentId?: string,
  ) =>
    set((state): any => {
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      let newArr = deepCloneArray(state.templateDatasets);
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
        : templateItem.logicReferenceId == null
        ? `${templateItem.id}[logicParentId]${logicParentId}`
        : null;
      let commonId = askQuestionId ? askQuestionId : uuidv4();
      let logicId = uuidv4();

      let updateQuestionData: any = {
        id: commonId,
        name: `New Question`,
        label: `New Question`,
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
        annotationLabel: "",
        annotationImg: "",
        annotationDesc: "",
        sectionActions: {
          duplicate: false,
          required: false,
          repeatThisSection: false,
        },
        imageLabel: "",
        imageImg: "",
        imageDesc: "",
        titleAndDescValue: "",
        titleAndDescActions: {
          duplicate: false,
          required: false,
        },
        component: "question",
        value: "",
        notes: "",
        parent: !logicParentId ? templateItem.parent : id,
        parentPage: templateItem.parentPage,
        isImageOpened: false,
        imageFields: null,
        logicReferenceId: logicReferenceId,
        globalLogicReferenceId: globalLogicReferenceId,
        logicId: logicId,
      };

      let updateLogicData = {
        id: logicId,
        required: false,
        multipleSelection: false,
        flaggedResponse: [],
        name: "logic",
        label: "logic",
        component: "logic",
        logics: [],
        logicReferenceId: logicReferenceId,
        parent: commonId,
        globalLogicReferenceId: globalLogicReferenceId,
      };

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
    }),

  addTemplateSection: (
    templateItem: any,
    id: number,
    logicReferenceId?: string,
    globalLogicReferenceId?: string,
  ) =>
    set((state): any => {
      let newArr = deepCloneArray(state.templateDatasets);
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      const newId = uuidv4();
      let logicId = uuidv4();
      let commonId = uuidv4();

      let updatedSectionData: any = {
        id: newId,
        name: `'New Question'`,
        label: `New Section label`,
        response_type: "TEXT_001",
        response_choice: "default",
        sectionActions: {
          duplicate: false,
          required: false,
          repeatThisSection: false,
        },
        imageLabel: "",
        imageImg: "",
        imageDesc: "",
        titleAndDescValue: "",
        titleAndDescActions: {
          duplicate: false,
          required: false,
        },
        component: "section",
        parent: templateItem.parent,
        parentPage: templateItem.parentPage,
        isImageOpened: false,
        logicReferenceId: logicReferenceId,
        globalLogicReferenceId: globalLogicReferenceId,
      };

      let updatedNewQuestionData: any = {
        id: commonId,
        name: "New Question",
        label: "Label",
        response_type: "TEXT_001",
        response_choice: "default",
        variables: {
          // temperature components
          temperatureFormat: "Celcius",
          format: "text",
        },
        value: "",
        notes: "",
        annotationLabel: "",
        annotationImg: "",
        annotationDesc: "",
        sectionActions: {
          duplicate: false,
          required: false,
          repeatThisSection: false,
        },
        imageLabel: "",
        imageImg: "",
        imageDesc: "",
        titleAndDescValue: "",
        titleAndDescActions: {
          duplicate: false,
          required: false,
        },
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
      };

      let updatedLogicId = {
        id: logicId,
        required: false,
        multipleSelection: false,
        flaggedResponse: [],
        name: "logic",
        label: "logic",
        component: "logic",
        logics: [],
        parent: commonId,
        logicReferenceId: logicReferenceId,
        globalLogicReferenceId: globalLogicReferenceId,
      };

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
            activeBlockIds.push(id, updatedNewQuestionData?.id, updatedLogicId?.id);
          }

          newArr?.splice(
            foundIndex + 1,
            0,
            updatedSectionData,
            updatedNewQuestionData,
            updatedLogicId,
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
            activeBlockIds.push(id, updatedNewQuestionData?.id, updatedLogicId?.id);
          }
        }
      }

      newArr?.splice(foundIndex + 1, 0, updatedSectionData, updatedNewQuestionData, updatedLogicId);
      //   setDataset(newArr);
      return { ...state, templateDatasets: newArr, activeLogicBlocks: activeBlock };
    }),

  // deleting the entire template contents
  deleteTemplateContents: (templateContentId: string | number) => {
    return set((state) => ({
      templateDatasets: state.templateDatasets.filter((item: any) => item.id !== templateContentId),
    }));
  },

  addTemplateNestedSection: (templateItem: any, id: number) =>
    set((state): any => {
      let newArr = [...state.templateDatasets];
      const newId = uuidv4();
      const logicId = uuidv4();
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      newArr?.splice(
        foundIndex + 1,
        0,
        {
          id: newId,
          name: `New Section`,
          response_type: "TEXT_001",
          response_choice: "default",
          component: "section",
          sectionActions: {
            duplicate: false,
            required: false,
            repeatThisSection: false,
          },
          imageLabel: "",
          imageImg: "",
          imageDesc: "",
          titleAndDescValue: "",
          titleAndDescActions: {
            duplicate: false,
            required: false,
          },
          parent: templateItem.parent,
          parentPage: templateItem.parentPage,
          isImageOpened: false,
          isLast: true,
          logicReferenceId: null,
          globalLogicReferenceId: null,
          logicId: logicId,
        },
        {
          id: uuidv4(),
          name: "New nested Default Question",
          label: "New  Nested section Question",
          response_type: "TEXT_001",
          response_choice: "default",
          variables: {
            temperatureFormat: "Celcius",
            format: "text",
          },
          value: "",
          notes: "",
          annotationLabel: "",
          annotationImg: "",
          annotationDesc: "",
          sectionActions: {
            duplicate: false,
            required: false,
            repeatThisSection: false,
          },
          imageLabel: "",
          imageImg: "",
          imageDesc: "",
          titleAndDescValue: "",
          titleAndDescActions: {
            duplicate: false,
            required: false,
          },
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
    set((state): any => {
      let newArr = [...state.templateDatasets];
      const newId = uuidv4();
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      newArr?.splice(foundIndex + 1, 0, {
        id: uuidv4(),
        name: "New Image",
        label: "Label",
        response_type: "TEXT_001",
        sectionActions: {
          duplicate: false,
          required: false,
          repeatThisSection: false,
        },
        imageLabel: "",
        imageImg: "",
        imageDesc: "",
        titleAndDescValue: "",
        titleAndDescActions: {
          duplicate: false,
          required: false,
        },
        value: "",
        component: "question",
        parent: null,
        parentPage: templateItem.parentPage,
        isImageOpened: true,
      });
      return (state.templateDatasets = newArr);
    }),

  addTitleAndDescription: (templateItem: any, id: number) =>
    set((state): any => {
      let newArr = [...state.templateDatasets];
      const newId = uuidv4();
      const foundIndex = state.templateDatasets?.findIndex((data: any) => data?.id === id);
      newArr?.splice(foundIndex + 1, 0, {
        id: uuidv4(),
        name: "New Image",
        label: "New Question",
        response_type: "TEXT_001",
        value: "",
        sectionActions: {
          duplicate: false,
          required: false,
          repeatThisSection: false,
        },
        imageLabel: "",
        imageImg: "",
        imageDesc: "",
        titleAndDescValue: "",
        titleAndDescActions: {
          duplicate: false,
          required: false,
        },
        component: "titleDescription",
        parent: templateItem.parent,
        parentPage: templateItem.parentPage,
        isImageOpened: false,
      });
      return (state.templateDatasets = newArr);
    }),

  updateTemplateDatasets: (templateItem: any, keyName: any, value: any) =>
    set((state): any => {
      const newState = state.templateDatasets?.map((obj: any) => {
        // 👇️ if id equals 2, update country property
        if (obj.id === templateItem?.id) {
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
    }),

  setSelectedData: (templateItem: any) =>
    set((state) => ({
      ...state,
      selectedDataset: templateItem,
    })),

  // section actions buttons
  duplicateSectionHandler: () => set((state): any => {}),

  setTemplateDatasets: (datas: any) => {
    set((state): any => {
      if (datas) {
        return (state.templateDatasets = datas);
      }
      return state;
    });
  },
  moveItems: ({ dragId, destinationId }: moveItemsProps) => {
    return set((state): any => {
      // need to create this drag object because in
      // edit we get error like can not assign to read only field
      let dragObject: any = {};
      // let prevTemplateDatasets = [...state?.templateDatasets];
      let prevTemplateDatasets = deepCloneArray(state?.templateDatasets);
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

      // update the parent for drag => because we need to asign it according to nested level or out level
      dragObject = { ...datas.drag };
      let activeDatas: any = { ...state.activeLogicBlocks };
      console.log({ activeDatas });
      if (datas?.destination?.parent || datas?.drag?.parent) {
        // dragObject.globalLogicReferenceId = datas?.destination.globalLogicReferenceId || null;
        // dragObject.logicReferenceId = datas?.destination.logicReferenceId || null;
      }

      // here we focused on the drag object because of the activeBlockData
      // as we need to remove it from the link question of that logics as well as the active datasets
      let activeBlocks = { ...state.activeLogicBlocks };
      if (
        datas?.drag?.globalLogicReferenceId &&
        datas?.drag?.logicReferenceId &&
        !datas?.destination?.logicReferenceId &&
        !datas?.destination?.globalLogicReferenceId
      ) {
        const logicID = datas?.drag?.logicReferenceId?.split("[logicParentId]")?.[0];
        const tabID = datas?.drag?.logicReferenceId?.split("[logicParentId]")?.reverse()?.[0];
        let value: any = [
          ...(activeBlocks?.[`${logicID}`]?.[`${tabID}`]?.filter(
            (id: any) => id !== datas?.drag?.id,
          ) || []),
        ];
        activeDatas = {
          ...activeBlocks,
          [`${logicID}`]: {
            ...activeBlocks?.[`${logicID}`],
            [`${tabID}`]: value,
          },
        };
        const foundParentLogic = prevTemplateDatasets?.find((it: any) => it?.id === logicID) || {};
        foundParentLogic?.logics.forEach((logic: any) => {
          if (logic?.id === tabID) {
            logic.linkQuestions = logic?.linkQuestions?.filter((qn: any) => qn !== datas?.drag?.id);
          }
        });
        // question logic
        const foundQuestionLogic =
          prevTemplateDatasets?.find((it: any) => it?.id === datas?.drag?.logicId) || {};
        foundQuestionLogic.logicReferenceId = datas?.destination.logicReferenceId || null;
        foundQuestionLogic.globalLogicReferenceId =
          datas?.destination.globalLogicReferenceId || null;
        // prevTemplateDatasets = [...prevTemplateDatasets, foundParentLogic];
      } else if (
        !datas?.drag?.logicReferenceId &&
        !datas?.drag?.globalLogicReferenceId &&
        !datas?.destination?.logicReferenceId &&
        !datas?.destination?.globalLogicReferenceId
      ) {
        console.log({ activeBlocks });
        if (Object.keys(activeBlocks || {})?.length) {
          let value = [
            ...activeBlocks?.[
              `${datas?.drag?.globalLogicReferenceId?.split("[logicParentId]")?.[0]}`
            ]?.[`${datas?.drag?.globalLogicReferenceId?.split("[logicParentId]")?.reverse()?.[0]}`],
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

      // case for the destination global and logic reference id
      if (
        datas?.drag?.globalLogicReferenceId &&
        datas?.drag?.logicReferenceId &&
        datas?.destination?.logicReferenceId &&
        datas?.destination?.globalLogicReferenceId
      ) {
        const logicID = datas?.destination?.logicReferenceId?.split("[logicParentId]")?.[0];
        const tabID = datas?.destination?.logicReferenceId
          ?.split("[logicParentId]")
          ?.reverse()?.[0];
        let value = [
          ...activeBlocks?.[`${logicID}`]?.[`${tabID}`],
          datas?.drag?.id,
          datas?.drag?.logicId,
        ];
        activeDatas = {
          ...activeBlocks,
          [`${logicID}`]: {
            ...activeBlocks?.[`${logicID}`],
            [`${tabID}`]: value,
          },
        };
        // remove from the current link questions
        // get the logic from the template data sets
        const foundLogic = prevTemplateDatasets?.find((it: any) => it?.id === logicID);
        foundLogic?.logics?.forEach((logic: any) => {
          if (logic?.id === tabID) {
            if (logic?.linkQuestions?.includes(datas?.drag?.id)) {
              let linkQuestions = [...(logic?.linkQuestions || [])];
              const findLinkQuestionIndex = logic.linkQuestions.findIndex(
                (qn: string) => qn === datas?.drag?.id,
              );
              const findTargetIndex = logic.linkQuestions.findIndex(
                (qn: string) => qn === datas?.destination?.id,
              );
              let gotAllChild: any = {};
              if (datas?.drag.component !== "section") {
                // questions order
                // it is what interchanges our datasets
                const [removed] = linkQuestions.splice(findLinkQuestionIndex, 1);
                linkQuestions?.splice(findTargetIndex, 0, datas?.drag?.id);
                logic.linkQuestions = [...new Set(linkQuestions)];
              } else {
                gotAllChild = reduceDataSet(prevTemplateDatasets, datas?.drag?.id, true);

                const cutStartIndex: any = Number(
                  linkQuestions.findIndex(
                    (q: string) => q === gotAllChild?.questionSectionIDCollection?.[0],
                  ),
                );
                const cutEndIndex: any = Number(
                  linkQuestions.findIndex(
                    (q: string) =>
                      q ===
                      gotAllChild?.questionSectionIDCollection?.[
                        gotAllChild?.questionSectionIDCollection?.length - 1
                      ],
                  ),
                );

                if (Number(cutEndIndex) !== -1 && Number(cutStartIndex) !== -1) {
                  const oldDestinationIndex = [...linkQuestions]?.findIndex(
                    (qn: string) => qn === datas?.destination?.id,
                  );
                  linkQuestions.splice(cutStartIndex, cutEndIndex - cutStartIndex + 1);
                  const newDestinationIndex = linkQuestions?.findIndex(
                    (qn: string) => qn === datas?.destination?.id,
                  );
                  if (Number(oldDestinationIndex) > Number(newDestinationIndex)) {
                    linkQuestions.splice(
                      newDestinationIndex + 1,
                      0,
                      ...(gotAllChild?.questionSectionIDCollection || []),
                    );
                  } else if (Number(newDestinationIndex) === Number(oldDestinationIndex)) {
                    linkQuestions.splice(
                      newDestinationIndex,
                      0,
                      ...(gotAllChild?.questionSectionIDCollection || []),
                    );
                  }
                }
              }
              logic.linkQuestions = [...new Set(linkQuestions)];
            } else {
              const findTargetIndex = logic.linkQuestions.findIndex(
                (qn: string) => qn === datas?.destination?.id,
              );
              logic?.linkQuestions?.splice(findTargetIndex, 0, datas?.drag?.id);
            }
          }
        });
        // question logic
        const foundQuestionLogic = prevTemplateDatasets?.find(
          (it: any) => it?.id === datas?.drag?.logicId,
        );
        if (foundQuestionLogic) {
          foundQuestionLogic.logicReferenceId = datas?.destination.logicReferenceId || null;
          foundQuestionLogic.globalLogicReferenceId =
            datas?.destination.globalLogicReferenceId || null;
        }
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
  },
  moveResponseData: ({ destinationId, responseData }: any) => {
    let { response_choice, response_type, responseOptionsData }: any = responseData;

    return set((state): any => {
      // it is what interchanges our datasets
      return {
        ...state,
        templateDatasets: state.templateDatasets.map((templateData: any) => {
          if (destinationId === templateData?.id) {
            // question or section
            return {
              ...templateData,
              response_choice: response_choice,
              response_type: response_type,
              type: "Array",
            };
          } else if (destinationId === templateData?.parent) {
            // logic
            let options = [];
            if (
              responseChoice.MULTIPLE === response_choice ||
              responseChoice.GLOBAL === response_choice
            ) {
              options = responseOptionsData?.options?.map((it: any) => it?.name);
            } else if (responseChoice.INTERNAL_RESPONSE_SET === response_choice) {
            }

            return {
              ...templateData,
              logicOptions: response_choice !== responseChoice.INTERNAL_RESPONSE_SET ? options : [],
              selectField: selectFiledOptions.includes(response_choice) ? true : false,
            };
          }
          return templateData;
        }),
      };
    });
  },
  moveItemBlockSide: ({ dragItem, destinationItem, before }: any) => {
    set((state: any) => {
      if (!dragItem && !destinationItem) {
        console.log("you can not");
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
    set((state): any => {
      if (datas) {
        return (state.activeLogicBlocks = { ...datas });
      }
      return state;
    });
  },
}));

// getting the latest recent updated data
// currently not working
export const getUpdatedDataset = (key: string, callback: (newValue: any) => void) => {
  const unsubscribe = useTemplateFieldsStore.subscribe((newState: any) => {
    const newValue = newState[key];
    if (newValue !== undefined) {
      callback(newValue);
    }
  });

  return unsubscribe;
};
