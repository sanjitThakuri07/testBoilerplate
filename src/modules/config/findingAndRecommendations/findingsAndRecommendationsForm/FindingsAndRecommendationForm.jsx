import {
  Box,
  Button,
  CircularProgress,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Radio from "src/components/Radio";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Formik, Form, Field, FieldArray } from "formik";
import MultiUploader from "src/components/MultiFileUploader/index";
import {
  putApiData,
  postApiData,
  fetchApI,
  fetchIndividualApi,
} from "src/modules/apiRequest/apiRequest";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSnackbar, SnackbarKey, SnackbarMessage, OptionsObject } from "notistack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddIcon from "@mui/icons-material/Add";
import {
  findingsAndRecommendationsValidationSchema,
  IndividualFindingsAndMultipleRecommendationValidationSchema,
  IndividualRecommendationValidationSchema,
  findingsAndRecommendationsValidationSchemaSubCategory,
} from "src/validationSchemas/ContractorValidation";
import FullPageLoader from "src/components/FullPageLoader";
import { usePathUrlSettor } from "src/store/zustand/globalStates/config";
import { map } from "lodash";
import { getByTitle } from "@testing-library/react";

export const RadioOptions = [
  {
    id: 1,
    value: "High",
    background: "#FEF3F2",
    textColor: "#F04438",
    dotColor: "#B42318",
    label: "High",
  },
  { id: 2, value: "Medium", background: "", textColor: "", dotColor: "", label: "Medium" },
  {
    id: 3,
    value: "Low",
    background: " #ECFDF3;",
    textColor: "#027A48",
    dotColor: "#12B76A",
    label: "Low",
  },
  {
    id: 4,
    value: "N/A",
    background: "#F2F4F7",
    textColor: "#667085",
    dotColor: "#344054",
    label: "N/A",
  },
];

const MyForm = () => {
  const [initialValues, setInitialValues] = useState({
    category: [{ name: "", status: "Active", notes: "" }],
    findings: [],
  });
  const [validation, setValidation] = useState({});
  const [clearData, setClearData] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const param = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchObject = Object.fromEntries(searchParams.entries());
  const { routes, setCustomRoutes } = usePathUrlSettor();

  //   form submit handler
  const submitHandler = async (values, actions) => {
    // const newPath =
    if (searchObject["findings"]) {
      // recomendation api individual
      if (!param?.findingsAndRecommendationsId) {
        (await postApiData({
          // setterFunction: setSomeState,
          values: [values],
          url:
            searchObject?.type === "findings"
              ? "main-category/single-finding"
              : `/finding-category/recommendation/`,
          enqueueSnackbar: enqueueSnackbar,
          domain: "Recommendation",
          setterLoading: setIsFormLoading,
        })) && navigate(`/config/findings-recommendations?findings=${searchObject["findings"]}`);
      } else {
        (await putApiData({
          // setterFunction: setSomeState,
          values: values?.findings,
          id: +param?.findingsAndRecommendationsId,
          url:
            searchObject?.type === "findings"
              ? "main-category/single-finding"
              : `${routes?.backendUrl}`,
          enqueueSnackbar: enqueueSnackbar,
          domain: "Recommendation",
          setterLoading: setIsFormLoading,
        })) && navigate(`/config/findings-recommendations?findings=${searchObject["findings"]}`);
      }
    } else if (searchObject["category"] || searchObject?.type === "findings") {
      // individual api of findings
      if (!param?.findingsAndRecommendationsId) {
        await postApiData({
          // setterFunction: setSomeState,
          values: [values],
          url:
            searchObject?.type === "findings"
              ? "/main-category/finding/"
              : `/finding-category/finding/`,
          enqueueSnackbar: enqueueSnackbar,
          domain: "Recommendation",
          setterLoading: setIsFormLoading,
        });
        if (searchObject?.type === "findings") {
          navigate(
            `/config/findings-recommendations?p_category=${searchObject["p_category"]}&type=findings`,
          );
        } else {
          navigate(`/config/findings-recommendations?category=${searchObject["category"]}`);
        }
        // && navigate(`/config/findings-recommendations?category=${searchObject['category']}`)
      } else {
        await putApiData({
          // setterFunction: setSomeState,
          values: values?.findings,
          id: +param?.findingsAndRecommendationsId,
          url:
            searchObject?.type === "findings"
              ? "main-category/single-finding"
              : `${routes?.backendUrl}`,
          enqueueSnackbar: enqueueSnackbar,
          domain: "Recommendation",
          setterLoading: setIsFormLoading,
        });
        // && navigate(`/config/findings-recommendations?category=${searchObject['category']}`)
      }
    } else {
      // create full category api
      if (param?.findingsAndRecommendationsId) {
        // search params according to last hit api

        // when there is no search params
        if (searchObject[`p_category`]) {
          (await putApiData({
            // setterFunction: setSomeState,
            values: values?.category,
            id: +param?.findingsAndRecommendationsId,
            url: "finding-category/category",
            enqueueSnackbar: enqueueSnackbar,
            domain: "Category",
            setterLoading: setIsFormLoading,
          })) &&
            navigate(`/config/findings-recommendations?p_category=${searchObject[`p_category`]}`);
        } else {
          (await putApiData({
            values: values?.[0],
            id: +param?.findingsAndRecommendationsId,
            url: "main-category",
            enqueueSnackbar: enqueueSnackbar,
            domain: "Category",
            setterLoading: setIsFormLoading,
          })) && navigate("/config/findings-recommendations");
        }

        // if (values[0]?.findings?.length) {
      } else {
        if (searchObject[`p_category`]) {
          (await postApiData({
            values: [values],
            url: "/finding-category/",
            enqueueSnackbar: enqueueSnackbar,
            domain: "Sub Category",
            setterLoading: setIsFormLoading,
          })) &&
            navigate(`/config/findings-recommendations?p_category=${searchObject[`p_category`]}`);
        } else {
          (await postApiData({
            values,
            url: "/main-category/",
            enqueueSnackbar: enqueueSnackbar,
            domain: "Category",
            setterLoading: setIsFormLoading,
          })) && navigate("/config/findings-recommendations");
        }
      }
    }
  };

  // individual findings
  const FindingsAndRecommendationsField = ({
    object,
    parentIndex,
    selfIndex,
    name,
    label,
    formikProps,
  }) => {
    let {
      values,
      touched,
      errors,
      handleBlur,
      handleChange,
      handleSubmit,
      isValid,
      dirty,
      isSubmitting,
      setFieldValue,
      setFieldTouched,
    } = formikProps;
    const [openMultiImage, setOpenMultiImage] = useState(false);

    function getIsErrorAndValue({
      touched,
      errors,
      name,
      selfIndex,
      parentIndex,
      field,
      parentField,
      values,
    }) {
      let touch = "";
      let error = "";
      let value = "";

      if (name === "finding") {
        touched =
          touched &&
          touched[`${name}s}`] &&
          touched[`${name}s}`][selfIndex] &&
          touched[`${name}s}`][selfIndex][field];
        error =
          errors &&
          errors[`${name}s}`] &&
          errors[`${name}s}`][selfIndex] &&
          errors[`${name}s}`][selfIndex][field];

        value = values?.[`${name}s`]?.[selfIndex][field];
        if (field === "attachments") {
          if (value?.length) {
            value = [{ documents: value?.map((data) => data?.attachment), title: "" }];
          }
        }
      } else {
        touch =
          touched &&
          touched[parentField] &&
          touched[parentField][parentIndex] &&
          touched[parentField][parentIndex][`${name}s}`] &&
          touched[parentField][parentIndex][`${name}s}`][selfIndex] &&
          touched[parentField][parentIndex][`${name}s}`][selfIndex][field];
        error =
          errors &&
          errors[parentField] &&
          errors[parentField][parentIndex] &&
          errors[parentField][parentIndex][`${name}s}`] &&
          errors[parentField][parentIndex][`${name}s}`][selfIndex] &&
          errors[parentField][parentIndex][`${name}s}`][selfIndex][field];
        value = values?.[parentField]?.[parentIndex]?.[`${name}s`]?.[selfIndex]?.[field];
      }

      return { isError: Boolean(touch && error), message: error, value };
    }

    function getTitle() {
      let title = "";
      if (searchObject["findings"]) {
        title = `Recommendation ${(selfIndex + 1)?.toString()?.padStart(2, 0)}`;
      } else {
        title = `${name} ${(selfIndex + 1)?.toString()?.padStart(2, 0)}`;
      }

      return title;
    }

    return (
      <div className={`individual__${name !== "finding" ? name : ""} for__recommendations`}>
        <Grid container spacing={4} className="formGroupItem text-area">
          <Grid item xs={4}>
            <InputLabel htmlFor="notes">
              <div className="label-heading  align__label">{getTitle()}</div>
            </InputLabel>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ flexDirection: "column", display: "grid" }}
            className="pin__box nested__input-alignment"
          >
            <FormGroup className="input-holder">
              <TextareaAutosize
                minRows={3}
                id="w3review"
                onChange={handleChange}
                className="text__area-style"
                inputProps={{ maxLength: 1 }}
                name={
                  name === "finding"
                    ? `${name}s[${selfIndex}].description`
                    : `findings[${parentIndex}][${name}s][${selfIndex}].description`
                }
                value={
                  name === "finding"
                    ? getIsErrorAndValue({
                        touched,
                        errors,
                        name,
                        selfIndex,
                        field: "description",
                        values,
                      })?.value
                    : getIsErrorAndValue({
                        touched,
                        errors,
                        name,
                        selfIndex,
                        field: "description",
                        parentIndex,
                        parentField: "findings",
                        values,
                      })?.value
                }
                error={
                  name === "finding"
                    ? getIsErrorAndValue({ touched, errors, name, selfIndex, field: "description" })
                        ?.isError
                    : getIsErrorAndValue({
                        touched,
                        errors,
                        name,
                        selfIndex,
                        field: "description",
                        parentIndex,
                        parentField: "findings",
                      })?.isError
                }
                maxLength={300}
              />
              <FormHelperText>
                {300 -
                  Number(
                    (name === "finding"
                      ? getIsErrorAndValue({
                          touched,
                          errors,
                          name,
                          selfIndex,
                          field: "description",
                          values,
                        })?.value?.length
                      : getIsErrorAndValue({
                          touched,
                          errors,
                          name,
                          selfIndex,
                          field: "description",
                          parentIndex,
                          parentField: "findings",
                          values,
                        })?.value?.length) || 0,
                  )}
                {` characters left`}
              </FormHelperText>
              {name === "finding"
                ? getIsErrorAndValue({ touched, errors, name, selfIndex, field: "description" })
                    ?.isError
                : getIsErrorAndValue({
                    touched,
                    errors,
                    name,
                    selfIndex,
                    field: "description",
                    parentIndex,
                    parentField: "findings",
                  })?.isError && (
                    <FormHelperText error>
                      {name === "finding"
                        ? getIsErrorAndValue({
                            touched,
                            errors,
                            name,
                            selfIndex,
                            field: "description",
                          })?.message
                        : getIsErrorAndValue({
                            touched,
                            errors,
                            name,
                            selfIndex,
                            field: "description",
                            parentIndex,
                            parentField: "findings",
                          })?.message}
                    </FormHelperText>
                  )}
            </FormGroup>
            <MultiUploader
              setOpenMultiImage={setOpenMultiImage}
              openMultiImage={openMultiImage}
              // initialData={values?.[`${name}s`]?.attachments || []}
              For={"Objects"}
              initialData={
                name === "finding"
                  ? getIsErrorAndValue({
                      touched,
                      errors,
                      name,
                      selfIndex,
                      field: "documents",
                      values,
                    })?.value
                  : getIsErrorAndValue({
                      touched,
                      errors,
                      name,
                      selfIndex,
                      field: "documents",
                      parentIndex,
                      parentField: "findings",
                      values,
                    })?.value || []
              }
              clearData={clearData}
              setClearData={setClearData}
              maxFileSize={2}
              requireDescription={false}
              accept={{
                "image/jpeg": [".jpeg", ".jpg"],
                "image/png": [".png"],
                "application/pdf": [".pdf"],
              }}
              icon={
                <div className="attach__files-icon">
                  <AttachFileIcon></AttachFileIcon>
                </div>
              }
              getFileData={(files = []) => {
                // files: [{ documents: any[]; title: string }
                // here you get the selected files do what you want to accordingly
                let formattedFiles = files[0]?.documents?.map((doc) => {
                  return doc?.base64
                    ? `${doc?.formatedFileSize}--${doc?.name};${doc?.base64}`
                    : doc;
                });

                setFieldValue(
                  name === "finding"
                    ? `${name}s[${selfIndex}].documents`
                    : `findings[${parentIndex}][${name}s][${selfIndex}].documents`,
                  files || [],
                );
                setFieldValue(
                  name === "finding"
                    ? `${name}s[${selfIndex}].attachments`
                    : `findings[${parentIndex}][${name}s][${selfIndex}].attachments`,
                  formattedFiles || [],
                );
              }}
            />
          </Grid>
        </Grid>

        {/* <FieldArray name={`findings[${parentIndex}].recommendations`}></FieldArray> */}
        {name?.toLowerCase() === "finding" && !searchObject["findings"] && (
          <Grid container spacing={4} className="formGroupItem nested__input-alignment">
            <Grid
              item
              xs={4}
              sx={{ alignSelf: "flex-start" }}
              className="nested__input-radio-alignment"
            >
              <InputLabel htmlFor="riskFactor">
                <div className="label-heading  align__label">
                  Mention Risk Factor <sup>*</sup>
                </div>
              </InputLabel>
            </Grid>

            <Grid item xs={7} className="align__radio nested__input-alignment">
              <Radio
                radioOption={RadioOptions}
                name={`${name}s[${selfIndex}].risk_factor`}
                id={`${name}s[${selfIndex}].risk_factor`}
                onChange={handleChange}
                value={
                  name === "finding"
                    ? getIsErrorAndValue({
                        touched,
                        errors,
                        name,
                        selfIndex,
                        field: "risk_factor",
                        values,
                      })?.value
                    : getIsErrorAndValue({
                        touched,
                        errors,
                        name,
                        selfIndex,
                        field: "risk_factor",
                        parentIndex,
                        parentField: "findings",
                        values,
                      })?.value
                }
                defaultValue={"Low"}
                color={"primary"}
                error={
                  name === "finding"
                    ? getIsErrorAndValue({ touched, errors, name, selfIndex, field: "description" })
                        ?.isError
                    : getIsErrorAndValue({
                        touched,
                        errors,
                        name,
                        selfIndex,
                        field: "description",
                        parentIndex,
                        parentField: "findings",
                      })?.isError
                }
              />
              {name === "finding"
                ? getIsErrorAndValue({ touched, errors, name, selfIndex, field: "description" })
                    ?.isError
                : getIsErrorAndValue({
                    touched,
                    errors,
                    name,
                    selfIndex,
                    field: "description",
                    parentIndex,
                    parentField: "findings",
                  })?.isError && (
                    <FormHelperText error>
                      {name === "finding"
                        ? getIsErrorAndValue({
                            touched,
                            errors,
                            name,
                            selfIndex,
                            field: "description",
                          })?.message
                        : getIsErrorAndValue({
                            touched,
                            errors,
                            name,
                            selfIndex,
                            field: "description",
                            parentIndex,
                            parentField: "findings",
                          })?.message}
                    </FormHelperText>
                  )}
            </Grid>
          </Grid>
        )}
      </div>
    );
  };

  // button container
  const ButtonCollection = ({ values, push, pushRec, finding = {}, onlyFinding = false }) => {
    return (
      <Grid container spacing={4} justifyContent="start" className="formGroupItem">
        <Grid item xs={4}>
          <InputLabel htmlFor="notes">
            {/* <div className="label-heading  align__label">test</div> */}
          </InputLabel>
        </Grid>
        <Grid
          xs={7}
          item
          sx={{
            justifyContent: !onlyFinding
              ? values?.findings?.length === 1
                ? "start"
                : "end"
              : "start",
          }}
        >
          {!!(values?.findings?.length === 1 && pushRec) && values?.category && (
            <Button
              type="button"
              variant="contained"
              className="add-another__findings"
              onClick={() => push({ description: "", risk_factor: "Low", attachments: [] })}
            >
              Add Another Finding
            </Button>
          )}
          {onlyFinding && values?.category && (
            <Button
              type="button"
              variant="contained"
              className="add-another__findings"
              onClick={() => push({ description: "", risk_factor: "Low", attachments: [] })}
            >
              Add Another Finding
            </Button>
          )}
          {!!(Object.keys(finding)?.length > 1 && !searchObject["findings"]) && (
            <Button
              type="button"
              // variant='contained'
              variant="text"
              onClick={() => pushRec({ description: "", attachments: [] })}
            >
              <AddIcon></AddIcon>
              <span>
                Add{finding?.recommendations?.length > 0 ? " Another " : " "}
                Recommendations
              </span>
            </Button>
          )}
        </Grid>
      </Grid>
    );
  };

  //cancel button
  const cancelButton = ({ deleteFnk, deleteId, iconStyle }) => {
    return (
      <div onClick={() => deleteFnk(deleteId)} style={iconStyle}>
        <IconButton>
          <CancelOutlinedIcon
            sx={{
              fill: "#C1C6D4",
              "&:hover": {
                fill: "#FF0000",
                cursor: "pointer",
              },
            }}
          ></CancelOutlinedIcon>
        </IconButton>
      </div>
    );
  };

  // const fetchApi
  const getApi = async ({ id, url, domain }) => {
    // setIsFormLoading(true);
    setIsFormLoading(true);

    await fetchIndividualApi({
      id,
      url,
      // enqueueSnackbar,
      setterLoading: setIsFormLoading,
      domain,
      setterFunction: (data) => {
        // need to set initial findings according to domain
        if (data) {
          let updatedData = {};

          if (domain?.toLowerCase() === "category") {
            updatedData = {
              ...initialValues,
              category: [{ name: data?.name, status: data?.status, notes: data?.notes }],
            };
            setInitialValues((prev) => ({
              ...prev,
              category: [{ name: data?.name, status: data?.status, notes: data?.notes }],
            }));
          } else if (domain?.toLowerCase() === "finding") {
            updatedData.findings = [
              {
                ...data,
                documents: [
                  { documents: data?.attachments?.map((data) => data?.attachment), title: "" },
                ],
                recommendations: data?.recommendations?.map((recommend) => ({
                  ...recommend,
                  documents: [
                    {
                      documents: recommend?.attachments?.map((data) => data?.attachment),
                      title: "",
                    },
                  ],
                })),
              },
            ];
            setInitialValues(updatedData);
          } else if (domain?.toLowerCase() === "recommendation") {
            updatedData.findings = [
              {
                ...data,
                documents: [
                  { documents: data?.attachments?.map((data) => data?.attachment), title: "" },
                ],
              },
            ];
            setInitialValues(updatedData);
          }
        }
      },
    });
    setIsFormLoading(false);
  };

  // fetching data
  // useEffect(() => {
  //   if (param?.findingsAndRecommendationsId) {
  //     getApi({
  //       id: Number(param?.findingsAndRecommendationsId),
  //       url: 'finding-category',
  //       domain: 'Category',
  //     });
  //   }
  // }, [param?.findingsAndRecommendationsId]);

  // effect for search params
  useEffect(() => {
    if (searchObject?.[`category`] || searchObject?.type === "findings") {
      setValidation(IndividualFindingsAndMultipleRecommendationValidationSchema);
      setInitialValues({
        findings: [
          {
            description: "",
            risk_factor: "Low",
            attachments: [],
            recommendations: [],
          },
        ],
      });
      if (param?.findingsAndRecommendationsId && routes?.backendUrl) {
        getApi({
          url:
            searchObject?.type === "findings" ? "main-category/single-finding" : routes?.backendUrl,
          id: Number(param?.findingsAndRecommendationsId),
          domain: "Finding",
        });
      }
    } else if (searchObject?.[`findings`]) {
      setValidation(IndividualRecommendationValidationSchema);
      // setInitialValues
      setInitialValues({
        findings: [
          {
            description: "",
            attachments: [],
          },
        ],
      });
      if (param?.findingsAndRecommendationsId && routes?.backendUrl) {
        getApi({
          url: routes?.backendUrl,
          id: Number(param?.findingsAndRecommendationsId),
          domain: "Recommendation",
        });
      }
    } else if (searchObject?.[`p_category`]) {
      setValidation(findingsAndRecommendationsValidationSchemaSubCategory);
      if (param?.findingsAndRecommendationsId) {
        getApi({
          url: "finding-category",
          id: Number(param?.findingsAndRecommendationsId),
          domain: "Category",
        });
      }
    } else {
      setValidation(findingsAndRecommendationsValidationSchema);
      if (param?.findingsAndRecommendationsId && routes?.backendUrl) {
        getApi({
          url: `${routes?.backendUrl}`,
          id: Number(param?.findingsAndRecommendationsId),
          domain: "Category",
        });
      }
    }
  }, [Object.keys(searchObject || {})?.length, routes?.backendUrl]);

  let checkMethod = searchObject?.[`p_category`]
    ? location.pathname.includes("add")
      ? true
      : false
    : true;

  return (
    <>
      {isFormLoading && <FullPageLoader></FullPageLoader>}
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validation || {}}
        onSubmit={(values, actions) => {
          let finalValue = {};
          if (searchObject[`findings`]) {
            if (param?.findingsAndRecommendationsId) {
              let finalVal = values?.findings?.map((find) => ({
                ...find,
                documents: undefined,
                attachments: find?.attachments?.map((att) =>
                  att?.attachment ? att?.attachment : att,
                ),
              }));
              finalValue.findings = finalVal[0];
            } else {
              finalValue = { ...values?.findings?.[0], finding: searchObject["findings"] };
            }
          } else if (searchObject[`category`] || searchObject?.type === "findings") {
            if (param?.findingsAndRecommendationsId) {
              let finalVal = values?.findings?.map((find) => ({
                ...find,
                documents: undefined,
                attachments: find?.attachments?.map((att) =>
                  att?.attachment ? att?.attachment : att,
                ),
                recommendations: find?.recommendations?.map((rec) => ({
                  ...rec,
                  documents: undefined,
                  attachments: rec?.attachments?.map((att) =>
                    att?.attachment ? att?.attachment : att,
                  ),
                })),
              }));
              finalValue.findings = finalVal[0];
            } else {
              finalValue = {
                ...values?.findings?.[0],
                category: searchObject["category"] || null,
                main_category:
                  searchObject?.type === "findings" ? Number(searchObject?.["p_category"]) : null,
              };
            }
          } else if (searchObject[`p_category`]) {
            finalValue = { ...values };
            if (values?.category) {
              finalValue = {
                ...finalValue,
                category: {
                  ...values?.category?.[0],
                  main_category: Number(searchObject[`p_category`]),
                },
              };
            }
            if (values?.findings?.length && param?.findingsAndRecommendationsId) {
              finalValue.findings = values?.findings?.map((data) => ({
                ...data,
                category: param?.findingsAndRecommendationsId,
              }));
            }
          } else {
            finalValue = values?.category;
          }
          submitHandler(finalValue, actions);
        }}
      >
        {(formikProps) => {
          let {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isValid,
            dirty,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          } = formikProps;
          return (
            <Form className="region-form">
              <div className="region-fieldset">
                <FieldArray name="category">
                  {({ push, remove }) => {
                    return (
                      <>
                        {values?.category?.map((category, index) => {
                          return (
                            <>
                              <div
                                className="category__container"
                                style={{ position: "relative", paddingTop: "2rem" }}
                              >
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="name">
                                      <div className="label-heading">
                                        {searchObject[`p_category`] ? "Sub Category" : "Category"}{" "}
                                        Name <sup>*</sup>
                                      </div>
                                    </InputLabel>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <FormGroup className="input-holder">
                                      <OutlinedInput
                                        id="name"
                                        type="text"
                                        placeholder="Type here"
                                        size="small"
                                        fullWidth
                                        name={`category.${index}.name`}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values?.category?.[index]?.name}
                                        error={Boolean(
                                          touched?.category?.[index]?.name &&
                                            errors?.category?.[index]?.name,
                                        )}
                                      />
                                      {Boolean(
                                        touched?.category?.[index]?.name &&
                                          errors?.category?.[index]?.name,
                                      ) && (
                                        <FormHelperText error>
                                          {errors?.category?.[index]?.name}
                                        </FormHelperText>
                                      )}
                                    </FormGroup>
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="status">
                                      <div className="label-heading">
                                        Status <sup>*</sup>
                                      </div>
                                    </InputLabel>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <FormGroup className="input-holder">
                                      <Select
                                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                                        id="status"
                                        size="small"
                                        fullWidth
                                        placeholder="Active"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name={`category.${index}.status`}
                                        value={values?.category?.[index]?.status}
                                        error={Boolean(
                                          touched?.category?.[index]?.status &&
                                            errors?.category?.[index]?.status,
                                        )}
                                      >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                      </Select>
                                      {Boolean(
                                        touched?.category?.[index]?.status &&
                                          errors?.category?.[index]?.status,
                                      ) && (
                                        <FormHelperText error>
                                          {errors?.category?.[index]?.status}
                                        </FormHelperText>
                                      )}
                                    </FormGroup>
                                  </Grid>
                                </Grid>
                                <Grid container spacing={4} className="formGroupItem text-area">
                                  <Grid item xs={4}>
                                    <InputLabel htmlFor="notes">
                                      <div className="label-heading">Add Notes</div>
                                      <p>A message from you that has to communicated to.</p>
                                    </InputLabel>
                                  </Grid>
                                  <Grid item xs={7}>
                                    <FormGroup className="input-holder">
                                      <TextareaAutosize
                                        placeholder="Type any message that has to be passed on."
                                        minRows={3}
                                        id="notes"
                                        onChange={(ev) => {
                                          setFieldValue(`category.${index}.notes`, ev.target.value);
                                          // setFieldTouched('categorynotes');
                                        }}
                                        className={`text__area-style `}
                                        // disabled={disabled}
                                        name={`category.${index}.notes`}
                                        value={values.category?.[index].notes}
                                        onBlur={handleBlur}
                                        maxLength={300}
                                      />
                                      <FormHelperText>
                                        {300 -
                                          Number(
                                            values?.category?.[index]?.notes?.length || 0,
                                          )}{" "}
                                        characters left
                                      </FormHelperText>
                                    </FormGroup>
                                  </Grid>
                                </Grid>
                                {!!(values?.category?.length > 1) &&
                                  cancelButton({
                                    deleteFnk: (id) => remove(id),
                                    deleteId: index,
                                    iconStyle: {
                                      position: "absolute",
                                      right: "15px",
                                      top: "0",
                                    },
                                  })}
                              </div>
                            </>
                          );
                        })}
                        {/* {!param?.findingsAndRecommendationsId &&
                          !Object.keys(searchObject || {})?.length && (
                            <Button
                              type="button"
                              variant="contained"
                              sx={{ marginTop: '2rem' }}
                              className="add-another__findings"
                              onClick={() => {
                                push({ name: '', status: 'Active', notes: '' });
                              }}>
                              Add Another Category
                            </Button>
                          )} */}
                        {/* <Button
                          type="button"
                          variant="contained"
                          sx={{ marginTop: '2rem' }}
                          className="add-another__findings"
                          onClick={() => {
                            push({ name: '', status: 'Active', notes: '' });
                          }}>
                          Add Another Category
                        </Button> */}
                      </>
                    );
                  }}
                </FieldArray>

                <FieldArray name="findings">
                  {({ push, remove }) => (
                    <>
                      {/* findings */}
                      {values?.findings?.map((finding, findingIndex) => (
                        <div
                          key={findingIndex}
                          className={`individual__finding ${
                            searchObject["findings"]
                              ? "single__recommendation"
                              : searchObject["category"]
                              ? "single__finding"
                              : ""
                          }`}
                        >
                          {/* findings fields */}
                          <FindingsAndRecommendationsField
                            object={finding}
                            selfIndex={findingIndex}
                            name="finding"
                            formikProps={formikProps}
                          />
                          {/* recommendations fields and mappings */}
                          <FieldArray name={`findings[${findingIndex}].recommendations`}>
                            {({ push: pushRec, remove: removeRec }) => (
                              <>
                                {finding?.recommendations?.map(
                                  (recommendation, recommendationIndex) => (
                                    <>
                                      <div
                                        key={recommendationIndex}
                                        style={{ position: "relative" }}
                                      >
                                        <FindingsAndRecommendationsField
                                          object={finding}
                                          parentIndex={findingIndex}
                                          selfIndex={recommendationIndex}
                                          name="recommendation"
                                          formikProps={formikProps}
                                        />
                                        {values?.category && finding?.recommendations?.length >= 0
                                          ? cancelButton({
                                              deleteFnk: (id) => removeRec(id),
                                              deleteId: recommendationIndex,
                                              iconStyle: {
                                                position: "absolute",
                                                right: "15px",
                                                top: "-2px",
                                              },
                                            })
                                          : cancelButton({
                                              deleteFnk: (id) => removeRec(id),
                                              deleteId: recommendationIndex,
                                              iconStyle: {
                                                position: "absolute",
                                                right: "2px",
                                                top: "0px",
                                              },
                                            })}
                                      </div>
                                    </>
                                  ),
                                )}
                                <ButtonCollection
                                  values={values}
                                  push={push}
                                  pushRec={pushRec}
                                  finding={finding}
                                />
                              </>
                            )}
                          </FieldArray>
                          {values?.category && values?.findings?.length > 0 ? (
                            cancelButton({
                              deleteFnk: (id) => remove(id),
                              deleteId: findingIndex,
                              iconStyle: { position: "absolute", right: "0", top: "0" },
                            })
                          ) : values?.findings?.length > 1 ? (
                            cancelButton({
                              deleteFnk: (id) => remove(id),
                              deleteId: findingIndex,
                              iconStyle: { position: "absolute", right: "0", top: "0" },
                            })
                          ) : (
                            <></>
                          )}
                        </div>
                      ))}
                      {values?.findings?.length > 0 ? (
                        <ButtonCollection
                          values={values}
                          push={push}
                          onlyFinding={!!(values?.findings?.length !== 1) ? true : false}
                        />
                      ) : (
                        <>
                          {!!Object.keys(searchObject)?.length && checkMethod && (
                            <Button
                              type="button"
                              variant="contained"
                              className="add-another__findings"
                              sx={{ marginTop: "2rem" }}
                              onClick={() =>
                                push({ description: "", risk_factor: "Low", attachments: [] })
                              }
                            >
                              Add Finding & Recommendation
                            </Button>
                          )}
                          {/* <Button
                            type="button"
                            variant="contained"
                            className="add-another__findings"
                            sx={{ marginTop: '2rem' }}
                            onClick={() =>
                              push({ description: '', risk_factor: 'Low', attachments: [] })
                            }>
                            Add Finding & Recommendation
                          </Button> */}
                        </>
                      )}
                    </>
                  )}
                </FieldArray>
              </div>

              <React.Fragment>
                <Box
                  borderBottom={"none"}
                  className="setting-form-group"
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    pt: 2,
                  }}
                >
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    variant="outlined"
                    type="button"
                    onClick={() => {
                      formikProps.resetForm();
                      // formikProps.setValues(formikProps.initialValues);
                      formikProps.setTouched({});
                      setClearData(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    // disabled={isSubmitting ? true : false}
                    // isSubmitting={isSubmitting}
                    //   onClick={handleS}
                    sx={{ mr: 1 }}
                  >
                    {param?.findingsAndRecommendationsId ? "Update" : "Save"} & Proceed
                    {isFormLoading && (
                      <CircularProgress color="inherit" size={18} sx={{ marginLeft: "10px" }} />
                    )}
                  </Button>
                </Box>
              </React.Fragment>

              {/* <button type="submit">Submit</button> */}
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default MyForm;
