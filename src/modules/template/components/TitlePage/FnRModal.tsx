// import CloseIcon from '@mui/icons/Close';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import {
  Alert,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  Snackbar,
} from '@mui/material';
import { converText } from 'containers/table/BASDataTable';
import { useEffect, useState } from 'react';
import { RadioOptions } from 'utils/FindingsUtils';
import { useTemplateFieldsStore } from 'containers/template/store/templateFieldsStore';
import TextAnswer from '../TextAnswer/TextAnswer';
import GetTextInput from '../TextAnswer/GetTextInput';
import useApiOptionsStore from 'containers/template/store/apiOptionsTemplateStore';
import { useLocation } from 'react-router-dom';

interface CustomPopUpProps extends ButtonProps {
  // Define any additional props for your component here
  title?: string;
  children?: any;

  headers?: any;
  viewData?: any;
  chipOptions?: string[];
  field?: any;
}

const FnrModal = ({ parentItem, fnrAction }: any) => {
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };
  const { templateInternalResponseData }: any = useApiOptionsStore();
  const { addFnRFields }: any = useTemplateFieldsStore();

  const [formValues, setFormValues]: any = useState({
    [parentItem?.id]: {},
    subCategory: {
      state: false,
      responseData: {},
      responseType: 'internal',
      id: uuidv4(),
      lock: true,
      selectField: true,
    },
    subCategoryFindings: {
      state: false,
      responseData: {},
      responseType: 'internal',
      id: uuidv4(),
      lock: true,
      selectField: true,
    },
    subCategoryRecommendations: {
      state: false,
      responseData: {},
      responseType: 'internal',
      id: uuidv4(),
      lock: true,
      selectField: true,
    },
    mainCategoryFindings: {
      state: false,
      responseData: {},
      responseType: 'internal',
      id: uuidv4(),
      lock: true,
      selectField: true,
    },
    mainCategoryFindingsRecommendations: {
      state: false,
      responseData: {},
      responseType: 'internal',
      id: uuidv4(),
      lock: true,
      selectField: true,
    },
  });
  const { fnrFields, updateTemplateDatasetsBeta }: any = useTemplateFieldsStore();
  const questionLinks = useState([]);
  const [error, setError] = useState({ state: false, message: '' });

  const handleClose = () => {
    setError({ state: false, message: '' });
  };

  useEffect(() => {
    if (parentItem?.formValuesLink) {
      setFormValues(parentItem?.formValuesLink);
    }
  }, [parentItem]);

  return (
    <>
      <Snackbar
        sx={{ top: '100px !important' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={error?.state}
        autoHideDuration={5000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {/* {error} */}
          {error?.message}
        </Alert>
      </Snackbar>
      {fnrAction?.showFnrField ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="fnr__template-modal">
          <h1>Link fields according to the {parentItem?.label || ''} (Category)</h1>
          <div className="fnr__form-container">
            <section>
              <InputLabel htmlFor="subCategory" sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  size="small"
                  checked={formValues?.subCategory?.state}
                  onChange={(e: any) => {
                    let responseData = {};
                    let filterFields: any = [];
                    let responseDataApi =
                      templateInternalResponseData?.find(
                        (internalResponseData: any) =>
                          internalResponseData?.module_id === 'FindingRecommendationSubCategory',
                      ) || {};

                    if (!responseDataApi?.module_id) {
                      setError((prev: any) => ({
                        message:
                          'You have no sub category internal attributes, Please create sub category internal attribute to enable this feature',
                        state: true,
                      }));
                      return;
                    }

                    setError({ state: false, message: '' });

                    if (e.target.checked) {
                      responseData = {
                        ...responseDataApi,
                        module_id: 'FindingRecommendationSubCategory',
                      };
                      filterFields = [
                        ...(formValues?.[parentItem?.id]?.filterFields || []),
                        `${parentItem?.id}=>FindingRecommendationSubCategory`,
                      ];
                    } else {
                      responseData = {};
                      filterFields = formValues?.[parentItem?.id]?.filterFields?.filter(
                        (ids: any) => ids !== `${parentItem?.id}=>FindingRecommendationSubCategory`,
                      );
                    }
                    setFormValues((prev: any) => ({
                      ...prev,
                      [parentItem?.id]: {
                        state: false,
                        label: 'parent',
                        id: parentItem?.id,
                        filterFields: filterFields,
                      },
                      subCategory: {
                        ...prev?.subCategory,
                        state: e.target.checked,
                        filterFields: e.target.checked
                          ? [...(prev?.subCategory?.filterFields || [])]
                          : [],
                        responseData,
                        linkFieldId: `${parentItem?.id}=>FindingRecommendationSubCategory`,
                      },
                      subCategoryFindings: {
                        ...prev?.subCategoryFindings,
                        state: e.target.checked ? prev?.subCategoryFindings?.state : false,
                      },
                      subCategoryRecommendations: {
                        ...prev?.subCategoryRecommendations,
                        state: e.target.checked ? prev?.subCategoryRecommendations?.state : false,
                      },
                    }));
                  }}
                />
                <div className="label-heading  align__label">Create Sub Category</div>
              </InputLabel>
              <div className={`nest__level-1 ${formValues?.subCategory?.state ? 'active' : ''}`}>
                {formValues?.subCategory?.state && (
                  <InputLabel
                    htmlFor="subCategory"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    className="label__style">
                    <Checkbox
                      size="small"
                      checked={formValues?.subCategoryFindings?.state}
                      onChange={(e: any) => {
                        let responseData = {};
                        let filterFields: any = [];
                        let responseDataApi =
                          templateInternalResponseData?.find(
                            (internalResponseData: any) =>
                              internalResponseData?.module_id === 'Findings',
                          ) || {};

                        if (!responseDataApi?.module_id) {
                          setError((prev: any) => ({
                            message:
                              'You have no findings (sub category) internal attributes, Please create findings (sub category) internal attribute to enable this feature',
                            state: true,
                          }));
                          return;
                        }

                        setError({ state: false, message: '' });

                        if (e.target.checked) {
                          responseData = {
                            ...responseDataApi,
                            module_id: 'FindingsSubCategoryFindings',
                          };
                          filterFields = [
                            ...(formValues?.subCategory?.filterFields || []),
                            `${formValues?.subCategory?.id}=>FindingsSubCategoryFindings`,
                          ];
                        } else {
                          responseData = {};
                          filterFields = formValues?.subCategory?.filterFields?.filter(
                            (ids: any) =>
                              ids !== `${formValues?.subCategory?.id}=>FindingsSubCategoryFindings`,
                          );
                        }
                        setFormValues((prev: any) => ({
                          ...prev,
                          subCategory: {
                            ...prev?.subCategory,
                            filterFields: filterFields,
                          },
                          subCategoryFindings: {
                            ...prev?.subCategoryFindings,
                            state: e.target.checked,
                            filterFields: e.target.checked
                              ? [...(prev?.subCategoryFindings?.filterFields || [])]
                              : [],
                            responseData,
                            linkFieldId: `${prev?.subCategory?.id}=>FindingsSubCategoryFindings`,
                          },
                          subCategoryRecommendations: {
                            ...prev?.subCategoryRecommendations,
                            state: e.target.checked
                              ? prev?.subCategoryRecommendations?.state
                              : false,
                          },
                        }));
                      }}
                    />
                    <div className="label-heading  align__label">Create Sub Category Findings</div>
                  </InputLabel>
                )}
              </div>
              <div
                className={`nest__level-2 ${
                  formValues?.subCategoryFindings?.state ? 'active' : ''
                }`}>
                {formValues?.subCategoryFindings?.state && (
                  <InputLabel
                    className="label__style"
                    htmlFor="subCategory"
                    sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={formValues?.subCategoryRecommendations?.state}
                      onChange={(e: any) => {
                        let responseData = {};
                        let filterFields: any = [];

                        let responseDataApi =
                          templateInternalResponseData?.find(
                            (internalResponseData: any) =>
                              internalResponseData?.module_id === 'FindingRecommendations',
                          ) || {};

                        if (!responseDataApi?.module_id) {
                          setError((prev: any) => ({
                            message:
                              'You have no recommendation (sub category) internal attributes, Please create recommendations (sub category) internal attribute to enable this feature',
                            state: true,
                          }));
                          return;
                        }

                        setError({ state: false, message: '' });

                        if (e.target.checked) {
                          responseData = {
                            ...responseDataApi,
                            module_id: 'FindingsSubCategoryFindingsRecommendations',
                          };
                          filterFields = [
                            ...(formValues?.subCategoryFindings?.filterFields || []),
                            `${formValues?.subCategoryFindings?.id}=>FindingsSubCategoryFindingsRecommendations`,
                          ];
                        } else {
                          responseData = {};
                          filterFields = formValues?.subCategoryFindings?.filterFields?.filter(
                            (ids: any) =>
                              ids !==
                              `${formValues?.subCategoryFindings?.id}=>FindingsSubCategoryFindingsRecommendations`,
                          );
                        }
                        setFormValues((prev: any) => ({
                          ...prev,
                          subCategoryFindings: {
                            ...prev?.subCategoryFindings,
                            // filterFields: [
                            //   ...(prev?.subCategoryFindings?.filterFields || []),
                            //   `${prev?.subCategoryFindings?.id}=>FindingsSubCategoryFindingsRecommendations`,
                            // ],
                            filterFields: filterFields,
                          },
                          subCategoryRecommendations: {
                            ...prev?.subCategoryRecommendations,
                            state: e.target.checked,
                            responseData,
                            linkFieldId: `${prev?.subCategoryFindings?.id}=>FindingsSubCategoryFindingsRecommendations`,
                          },
                        }));
                      }}
                    />
                    <div className="label-heading  align__label">
                      Create Sub Category Findings Recommendations
                    </div>
                  </InputLabel>
                )}
              </div>
            </section>
            <section>
              <InputLabel
                className="label__style"
                htmlFor="subCategory"
                sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  size="small"
                  checked={formValues?.mainCategoryFindings?.state}
                  onChange={(e: any) => {
                    let responseData = {};
                    let filterFields: any = [];
                    let responseDataApi =
                      templateInternalResponseData?.find(
                        (internalResponseData: any) =>
                          internalResponseData?.module_id === 'Findings',
                      ) || {};

                    if (!responseDataApi?.module_id) {
                      setError((prev: any) => ({
                        message:
                          'You have no findings (category) internal attributes, Please create findings (main category) internal attribute to enable this feature',
                        state: true,
                      }));
                      return;
                    }

                    setError({ state: false, message: '' });

                    if (e.target.checked) {
                      responseData = {
                        ...responseDataApi,
                        module_id: 'FindingsMainCategoryFindings',
                        field: 'description',
                      };
                      filterFields = [
                        ...(formValues?.[parentItem?.id]?.filterFields || []),
                        `${parentItem?.id}=>FindingsMainCategoryFindings`,
                      ];
                    } else {
                      responseData = {};
                      filterFields = formValues?.[parentItem?.id]?.filterFields?.filter(
                        (ids: any) => ids !== `${parentItem?.id}=>FindingsMainCategoryFindings`,
                      );
                    }
                    setFormValues((prev: any) => ({
                      ...prev,
                      [parentItem?.id]: {
                        state: false,
                        label: 'parent',
                        id: parentItem?.id,
                        filterFields,
                      },
                      mainCategoryFindings: {
                        ...prev?.mainCategoryFindings,
                        state: e.target.checked,
                        responseData,
                        filterFields: e.target.checked
                          ? [...(prev?.mainCategoryFindings?.filterFields || [])]
                          : [],
                        linkFieldId: `${parentItem?.id}=>FindingsMainCategoryFindings`,
                      },
                      mainCategoryFindingsRecommendations: {
                        ...prev?.mainCategoryFindingsRecommendations,
                        state: e.target.checked
                          ? prev?.mainCategoryFindingsRecommendations?.state
                          : false,
                      },
                    }));
                  }}
                />
                <div className="label-heading  align__label">Create Category Findings</div>
              </InputLabel>
              <div
                className={`nest__level-1 ${
                  formValues?.mainCategoryFindings?.state ? 'active' : ''
                }`}>
                {formValues?.mainCategoryFindings?.state && (
                  <InputLabel
                    className="label__style"
                    htmlFor="subCategory"
                    sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={formValues?.mainCategoryFindingsRecommendations?.state}
                      onChange={(e: any) => {
                        let responseData = {};
                        let filterFields: any = [];
                        let responseDataApi =
                          templateInternalResponseData?.find(
                            (internalResponseData: any) =>
                              internalResponseData?.module_id === 'FindingRecommendations',
                          ) || {};

                        if (!responseDataApi?.module_id) {
                          setError((prev: any) => ({
                            message:
                              'You have no recommendations (category) internal attributes, Please create recommendations (category) internal attribute to enable this feature',
                            state: true,
                          }));
                          return;
                        }

                        setError({ state: false, message: '' });
                        if (e.target.checked) {
                          responseData = {
                            ...responseDataApi,
                            module_id: 'FindingsMainCategoryFindingsRecommendations',
                            field: 'description',
                          };
                          filterFields = [
                            ...(formValues?.mainCategoryFindings?.id?.filterFields || []),
                            `${formValues?.mainCategoryFindings?.id}=>FindingsMainCategoryFindingsRecommendations`,
                          ];
                        } else {
                          responseData = {};
                          filterFields = [];
                        }
                        setFormValues((prev: any) => ({
                          ...prev,
                          mainCategoryFindings: {
                            ...prev?.mainCategoryFindings,
                            filterFields: filterFields,
                          },
                          mainCategoryFindingsRecommendations: {
                            ...prev?.mainCategoryFindingsRecommendations,
                            state: e.target.checked,
                            responseData,
                            linkFieldId: `${prev?.mainCategoryFindings?.id}=>FindingsMainCategoryFindingsRecommendations`,
                          },
                        }));
                      }}
                    />
                    <div className="label-heading  align__label">
                      Create Category Findings Recommendations
                    </div>
                  </InputLabel>
                )}
              </div>
            </section>
          </div>
          <div className="actions__container">
            <Button
              type="button"
              onClick={() => {
                // if (!formValues?.subCategory?.state && !formValues?.mainCategoryFindings?.state) {
                //   return;
                // }
                updateTemplateDatasetsBeta({
                  selectedDataset: parentItem,
                  dataObjects: {
                    filterFields: formValues?.[parentItem?.id]?.filterFields || [],
                    formValuesLink: formValues,
                    lock: true,
                  },
                });
                addFnRFields({ values: formValues, item: parentItem });
                // fnrAction?.setShowFnrField(false);
              }}
              variant="outlined">
              {parentItem?.['filterFields'] ? 'Update Questions' : 'Create Question'}
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default FnrModal;
