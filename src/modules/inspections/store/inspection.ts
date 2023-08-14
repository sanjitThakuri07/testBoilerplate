import create from "zustand";

interface ReportStoreDataSetsI {
      setInitialState: any;
      initialState: any;
      createWithoutPayload: any;
}
interface CurrentLayoutDataSets {
      setCurrentState: any;
      currentReportLayout: any;
      createWithoutPayload: any;
}

export const useReportDataSets = create<ReportStoreDataSetsI>((set) => ({
      initialState: {},
      setInitialState: (payload: any) => set({ initialState: payload }),
      createWithoutPayload: () => {
            return set((state) => ({}));
      },
}));
export const useCurrentLayout = create<CurrentLayoutDataSets>((set) => ({
      currentReportLayout: {},
      setCurrentState: (payload: any) => set({ currentReportLayout: payload }),
      createWithoutPayload: () => {
            return set((state) => ({}));
      },
}));