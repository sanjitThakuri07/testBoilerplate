import create from "zustand";

interface ReportStoreDataSetsI {
  layoutObj: any;
  layoutObjLoader: boolean;
  layoutParams: any;
  setLayoutParams: any;
  setLayoutObjLoader: any;
  setLayoutObj: any;
  createWithoutPayload: any;
  updateLayoutProperties: any;
  profileLabelLoading: any;
  setProfileLabelLoading: any;
  getDatasFromTemplates: any;
  setGetDatasFromTemplates: any;
}

export const useReportLayoutDataSets = create<ReportStoreDataSetsI>((set) => ({
  // for active tab
  layoutObj: {},
  layoutObjLoader: false,
  layoutParams: null,
  profileLabelLoading: true,
  getDatasFromTemplates: {
    profileLabel: "",
    reducerDatas: {},
  },

  setLayoutObj: (payload: any) => set({ layoutObj: payload }),
  setLayoutObjLoader: (payload: any) => set({ layoutObjLoader: payload }),
  setLayoutParams: (payload: any) => set({ layoutParams: payload }),
  setProfileLabelLoading: (payload: any) =>
    set({ profileLabelLoading: payload }),

  setGetDatasFromTemplates: (payload: any) =>
    set({ getDatasFromTemplates: payload }),

  updateLayoutProperties: (name: any, value: any) => {
    if (name === "report_email") {
      return set((state: any) => {
        let newObj = {
          ...state.layoutObj,
          email_to: value?.TOEmailSelected,
          email_bcc: value?.BCCEmailSelected,
          email_cc: value?.CCEmailSelected,
          email_content: value?.body,
          email_file: "",
          email_subject: value?.subject,
        };
        return { layoutObj: newObj };
      });
    }

    return set((state: any) => {
      let newObj = {
        ...state.layoutObj,
        [`${name}`]: value,
      };
      return { layoutObj: newObj };
    });
  },

  createWithoutPayload: () => {
    return set((state) => ({}));
  },
}));
