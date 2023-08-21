import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getAPI, patchAPI, postAPI, putAPI } from "src/lib/axios";
import { deleteAPiData, fetchApI, postApiData } from "src/modules/apiRequest/apiRequest";
import { responseChoice } from "../itemTypes/itemTypes";
import { useTemplateFieldsStore } from "./templateFieldsStore";
import { url } from "src/utils/url";
import { ACTION_TYPE } from "../actionType";

export const useTemplateStore = create(
  devtools(
    immer((set) => {
      const { resetTemplateValues }: any = useTemplateFieldsStore.getState();
      return {
        tableDatas: {
          items: [],
          headers: [],
          page: 1,
          pages: 1,
          size: 1,
          total: 0,
          archivedCount: 0,
        },
        templates: [],
        template: undefined,
        inspection: undefined,
        templateIssue: undefined,
        isLoading: false,
        templatesMedia: [],

        postTemplate: async (values: any, navigate: any, enqueueSnackbar: any) => {
          // const response = await postAPI('/templates/', values);
          // if (response) {
          //   navigate('/template');
          //   return true;
          // }
          // set((state: any) => {
          //   state.templates = response.data;
          // });
          set({ isLoading: true });
          const apiResponse = await postApiData({
            values: values,
            url: "/templates/",
            enqueueSnackbar: enqueueSnackbar,
            setterFunction: (data: any) => {
              resetTemplateValues();
              set((state: any) => {
                return {
                  templates: [data.data, ...state.templates],
                  isLoading: false,
                  tableDatas: {
                    ...state.tableDatas,

                    items: [data?.data, ...state.tableDatas.items],
                  },
                };
              });
            },
            domain: "Form Builder",
          });
          set({ isLoading: false });
          !apiResponse && set({ isLoading: false });
          apiResponse && navigate?.("/template");
          return apiResponse;
        },
        postTemplateIssue: async (ids: any, values: any, navigate: any) => {
          const response = await patchAPI(
            `activity/${ids?.issueId}/assign-inspection/?inspection=${ids?.inspectionId}`,
            values,
          );
          if (response) {
            set({ templateIssue: response.data, templates: [] });
            navigate(`assign-activities/edit/${ids?.issueId}`);
          }
        },

        postTemplateDraft: async (values: any, navigate: any, enqueueSnackbar: any) => {
          // const response = await postAPI('/templates/', values);
          // if (response) {
          //   navigate('/template');
          //   return true;
          // }
          // set((state: any) => {
          //   state.templates = response.data;
          // });
          set({ isLoading: true });
          const apiResponse: any = await postApiData({
            values: values,
            url: "/templates/",
            enqueueSnackbar: enqueueSnackbar,
            setterFunction: (data: any) => {
              set((state: any) => {
                if (data) {
                  navigate?.(`/template/edit/${data?.data?.id}`);
                }
                return {
                  templates: data.data,
                  isLoading: false,
                };
              });
            },
            domain: "Form Builder",
          });
          !apiResponse && set({ isLoading: false });

          // apiResponse && navigate?.(`/template/edit/${apiResponse?.data?.id}`);
          return apiResponse;
        },

        updateTemplateDraft: async (templdateId: number, values: any, enqueueSnackbar: any) => {
          set({ isLoading: true });

          const response = await putAPI(`templates/${templdateId}`, values);
          if (response) {
            set((state: any) => {
              state.templates = response.data;
              state.isLoading = false;
            });
            enqueueSnackbar?.(
              response?.data?.message ? response?.data?.message : "Data Saved Successfully",
              {
                variant: "success",
              },
            );
            return true;
          }
        },

        updateTemplate: async (
          templdateId: number,
          values: any,
          navigate: any,
          enqueueSnackbar: any,
        ) => {
          set({ isLoading: true });
          const response = await putAPI(`templates/${templdateId}`, values);
          if (response) {
            resetTemplateValues();
            set({ templates: [], isLoading: false });
            navigate?.("/template");
            enqueueSnackbar?.(
              response?.data?.message ? response?.data?.message : "Data Created Successfully",
              {
                variant: "success",
              },
            );
            return true;
          }
        },

        getTemplate: async (templateId: any) => {
          set((state: any) => {
            state.isLoading = true;
          });
          const response = await getAPI(`templates/${templateId}`);
          set((state: any) => {
            if (response) {
              state.template = response.data;
              state.isLoading = false;
            }
          });
        },
        getTemplates: async ({ inspection_id, getAll, enqueueSnackbar, query }: any) => {
          // set((state: any) => {
          //   state.isLoading = true;
          // });
          // const response = await getAPI(
          //   `templates/?q=&archived=false${
          //     inspection_id ? `&inspection_id=${inspection_id}&` : ""
          //   }`,
          // );
          // set((state: any) => {
          //   if (response) {
          //     state.templates = response.data;
          //     state.isLoading = false;
          //   }
          // });

          set({ isLoading: true });
          const apiResponse = await fetchApI({
            url: url?.template + "/",
            setterFunction: (data: any) => {
              set((state) => {
                return {
                  templates: getAll ? data?.items || [] : data || [],
                  tableDatas: getAll
                    ? { ...data, archivedCount: data?.info?.archived_count || 0 }
                    : { ...state?.tableDatas, items: data },
                  isLoading: false,
                };
              });
            },
            getAll,
            queryParam: inspection_id ? { ...query, inspection_id } : query,
            enqueueSnackbar,
          });
          !apiResponse && set({ isLoading: false });
          return apiResponse;
        },

        postTemplateMedia: async (values: any) => {
          const formData = new FormData();
          formData.append("id", values.id);
          formData.append("files", values.files);
          const response = await postAPI("/templates/upload-media/", formData);

          set((state: any) => {
            state.templatesMedia = response.data?.media;
          });
        },

        postTemplateInspection: async ({ values, navigate, goTo }: any) => {
          const response = await postAPI("/templates-data/", values);
          if (response) {
            if (values?.issueID) {
              const responses = await patchAPI(
                `activity/${values?.issueID}/assign-inspection/?inspection=${response?.data?.data?.id}`,
                values,
              );
              if (responses) {
                navigate?.({ pathname: `/assign-activities/edit/${Number(values?.issueID)}` });
              }
              set((state: any) => {
                state.templateIssue = response.data;
              });
            } else {
              if (!goTo) {
                navigate?.("/inspections");
                return;
              } else {
                goTo?.(response?.data);
              }
            }
          }
          set((state: any) => {
            state.inspection = response?.data;
          });
        },

        tableActionHandler: async ({ values, enqueueSnackbar, type, URL = url?.template }: any) => {
          set({ loading: true });
          let apiResponse = false;

          switch (type) {
            case ACTION_TYPE.DELETE:
              apiResponse = await deleteAPiData({
                values: values,
                url: url?.template + "/",
                // setterLoading: setLoading,
                enqueueSnackbar: enqueueSnackbar,
                getAll: true,
                setterFunction: (data: any) => {
                  set((state: any) => {
                    let tableDatas = state.tableDatas || {};
                    let items = tableDatas?.items?.filter(
                      (data: any) => !values?.includes(data?.id),
                    );
                    return {
                      loading: false,
                      tableDatas: {
                        ...(tableDatas || {}),
                        archivedCount: tableDatas?.archivedCount + values?.length || 0,
                        items,
                      },
                      regions: items,
                    };
                  });
                },
              });
              break;
            case ACTION_TYPE.RESTORE:
              apiResponse = await postApiData({
                values: values,
                url: `/${url?.template}/${url?.restore}`,
                // setterLoading: setLoading,
                enqueueSnackbar: enqueueSnackbar,
                setterFunction: (data: any) => {
                  set((state: any) => {
                    const updateData = state?.tableDatas?.items?.filter(
                      (data: any) => !values?.includes(data?.id),
                    );
                    const updatedTableData = {
                      ...(state.tableDatas || {}),
                      items: updateData,
                      archivedCount: state.tableDatas?.archivedCount - values?.length || 0,
                    };

                    return {
                      regions: updateData,
                      individualRegion: {},
                      tableDatas: updatedTableData,
                      loading: false,
                    };
                  });
                },
              });
              break;
            case ACTION_TYPE.DUPLICATE:
              apiResponse = await postApiData({
                values: values,
                url: `/${url?.template}/${url?.duplicate}/${values?.id}`,
                // setterLoading: setLoading,
                enqueueSnackbar: enqueueSnackbar,
                setterFunction: (data: any) => {
                  set((state: any) => {
                    const updateData = [...(data?.data || []), ...(state?.tableDatas?.items || [])];
                    const updatedTableData = {
                      ...(state.tableDatas || {}),
                      items: updateData,
                      archivedCount: state.tableDatas?.archivedCount - values?.length || 0,
                    };

                    return {
                      regions: updateData,
                      individualRegion: {},
                      tableDatas: updatedTableData,
                      loading: false,
                    };
                  });
                },
              });
              break;
            default:
              break;
          }

          !apiResponse && set({ loading: false });
          return apiResponse;
        },
      };
    }),
  ),
);
