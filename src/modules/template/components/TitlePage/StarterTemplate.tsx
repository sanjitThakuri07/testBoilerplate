import React, { useEffect, useState, useRef, RefObject } from "react";
import TextAnswer from "../TextAnswer/TextAnswer";
import tooltipItems from "constants/template/tooltipItems";
import Section from "../Section/Section";

import {
  Alert,
  Box,
  Button,
  Divider,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import TemplateTitleAndDescription from "../TemplateTitleAndDescription/TemplateTitleAndDescription";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import MultiUploader from "src/components/MultiFileUploader/index";
import LogoutIcon from "src/assets/icons/logout_icon.svg";
import { TemplateDataStructure } from "./TemplateInitialDataStructure";
import { useTemplateFieldsStore } from "src/modules/template/store/templateFieldsStore";
import { useTemplateStore } from "src/modules/template/store/templateStore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import TemplateHeading from '../TemplateHeading/TemplateHeading';
import FullPageLoader from "src/components/FullPageLoader";
import TemplateImageContainer from "../TemplateImageContainer/TemplateImageContainer";
import ResponseInputLogicNew from "src/modules/template/components/InputComponents/ResponseInputLogicNew";
import DivSeperator from "../DivSeperator/index";
import TabPage from "src/modules/template/layout/PageTab";

import { FlattenObject } from "src/modules/utils";
import withScrolling from "react-dnd-scrolling";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { searchParamObject } from "src/modules/utils/index";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import useApiOptionsStore from "src/modules/template/store/apiOptionsTemplateStore";
import { useSnackbar } from "notistack";
import useUndoRedo from "hooks/useUndoRedo";
import FnrModal from "./FnRModal";
import CustomBottomNavigation from "src/modules/template/container/layout/bottombar";
import { MobileIndex, MobilePreview } from "src/modules/template/components/index";

const ScrollingComponent = withScrolling("div");

const StarterTemplate: any = React.forwardRef(
  ({ formikBags, setInitialTemplate, children: any }: any, templateHeadingRef: any) => {
    const navigate = useNavigate();
    const param = useParams();

    const {
      postTemplate,
      updateTemplate,
      isLoading,
      getTemplate,
      template,
      postTemplateDraft,
      updateTemplateDraft,
    }: any = useTemplateStore();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchObject = searchParamObject(searchParams);

    const {
      multipleResponseData,
      globalResponseData,
      fetchMultipleResponseData,
      fetchGlobalResponseData,
      fetchTemplateInternalResponseData,
    }: any = useApiOptionsStore();

    const fetchResponseData = async () => {
      await fetchMultipleResponseData({});
      await fetchGlobalResponseData({});
      await fetchTemplateInternalResponseData({});
    };
    useEffect(() => {
      fetchResponseData();
    }, []);
    const [undo, redo] = useUndoRedo("");

    useEffect(() => {
      const handleKeyDown = (event: any) => {
        if (event.ctrlKey && event.key === "z") {
          event.preventDefault();
          undo();
        } else if (event.ctrlKey && event.key === "y") {
          event.preventDefault();
          redo();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [undo, redo]);

    const [internalResponseData, setInternalResponseData] = React.useState<any>([]);
    const [externalResponseData, setExternalResponseData] = React.useState<any>([]);

    const handleSearchInternalResponse = async () => {
      await fetchApI({
        setterFunction: setInternalResponseData,
        url: `internal-response/`,
      });
    };

    useEffect(() => {
      handleSearchInternalResponse();
    }, []);

    const handleSearchExternalResponse = async () => {
      await fetchApI({
        setterFunction: setExternalResponseData,
        url: `external-response/?page=1&size=50`,
      });
    };

    useEffect(() => {
      handleSearchExternalResponse();
    }, []);

    const {
      templateDatasets,
      templateHeading,
      setTemplateDatasets,
      addTitleAndDescription,
      setTemplateHeading,
      activeLogicBlocks,
      activePageId,
      resetTemplateValues,
      addTemplateQuestion,
      addTemplateSection,
    } = useTemplateFieldsStore();
    // button refrence

    const { setButtonReference } = userDataStore();
    const saveButton = useRef<any>(null);

    useEffect(() => {
      if (param?.templateId && !Object.keys(searchObject || {})?.length) {
        getTemplate(param?.templateId);
      }
    }, [param?.templateId]);

    useEffect(() => {
      if (saveButton?.current) {
        setButtonReference?.(saveButton?.current?.getAttribute("id"));
      }
    }, [saveButton?.current]);

    useEffect(() => {
      if (template && !Object.keys(searchObject || {})?.length) {
        setTemplateDatasets(template?.fields);
        setInitialTemplate((prev: any) => ({ ...prev, name: template?.name }));
        setTemplateHeading("templateDescription", template?.description);
        setTemplateHeading("templateTitle", template?.name);
        setTemplateHeading("headerImage", template?.photo);
      }
    }, [template]);

    //  tooltip callback function
    const handleAddTemplateQuestion = (item: any, id: any) => {
      addTemplateQuestion(item, id);
    };
    const handleAddTemplateSection = (item: any, id: any) => {
      addTemplateSection(item, id, item?.logicReferenceId, item?.globalLogicReferenceId);
    };
    const clickHandler = (tooltipIndex: number, item: any) => {
      switch (tooltipIndex) {
        case 0:
          handleAddTemplateQuestion(item, item?.id);
          break;
        case 1:
          // onAddSection(item, item?.id);
          handleAddTemplateSection(item, item?.id);
          break;

        default:
      }
    };

    const [open, setOpen] = React.useState(true);

    const [removeId, setRemoveId] = useState<any>(null);
    const [snackOpen, setSnackOpen] = useState(false);
    const [pageDeleteModal, setPageDeleteModal] = useState(false);
    const [snackSuccessMessage, setSnackSuccessMessage] = useState<string>("");
    const { addNewPageHandler, deleteTemplateContents, currentStateIndex, updateData }: any =
      useTemplateFieldsStore();
    const handleClick = () => {
      setOpen(!open);
    };
    const datasetDefault = [...TemplateDataStructure];

    const [dataset, setDataset] = useState<any>(datasetDefault || []);

    const templateDataObject: { rootItems: []; pageItems: []; activePage: any } =
      templateDatasets.reduce(
        (acc: any, curr: any) => {
          if (curr.parent === null && curr.component !== "page") {
            acc.rootItems.push(curr);
          } else if (curr.parent === null && curr.component === "page") {
            acc.pageItems.push(curr);
            if (activePageId === curr?.id) {
              acc.activePage = { ...curr };
            }
          }
          return acc;
        },
        { rootItems: [], pageItems: [], activePage: {} },
      );

    // add title and description
    const handleAddTitleDesctiption = (item: any, id: any) => {
      addTitleAndDescription(item, id);
    };

    //  ======= Uploading the image starts here =========
    const uploadImageHandler = (item: any, id: number) => {
      let newImageState = templateDatasets.map((data: any) => {
        if (data.id === item.id) {
          return {
            ...data,
            isImageOpened: !item.isImageOpened,
          };
        }
        return data;
      });
      setTemplateDatasets([...newImageState]);
    };

    const createNewPageHandler = () => {
      addNewPageHandler();
    };

    useEffect(() => {
      localStorage.setItem("template", JSON.stringify(dataset));
      resetTemplateValues();
    }, []);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setSnackOpen(false);
    };

    // deleting the template stuffs
    const templateDeleteHandler = (id: any, title?: string) => {
      setPageDeleteModal(true);
      setRemoveId({ id, title });
    };

    const handleDeleteConfirmation = () => {
      deleteTemplateContents(removeId?.id);
      setPageDeleteModal(false);
      setSnackOpen(true);
      setSnackSuccessMessage("Content Deleted Successfully");
    };

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async () => {
      if (!templateHeadingRef?.current) return;
      templateHeadingRef?.current?.click();
      if (!templateHeading?.templateTitle) return;
      if (!param?.templateId) {
        const response = await postTemplate(
          {
            name: templateHeading?.templateTitle,
            description: templateHeading?.templateDescription || "",
            photo: templateHeading?.headerImage || "",
            fields: templateDatasets,
          },
          navigate,
          enqueueSnackbar,
        );
        if (response) {
          resetTemplateValues();
        }
      } else {
        updateTemplate(
          param?.templateId,
          {
            name: templateHeading?.templateTitle,
            description: templateHeading?.templateDescription || "",
            photo: templateHeading?.headerImage || "",
            fields: templateDatasets,
          },
          navigate,
          enqueueSnackbar,
        );
      }
    };
    const handleDraft = async () => {
      if (!templateHeadingRef?.current) return;
      templateHeadingRef?.current?.click();
      if (!templateHeading?.templateTitle) return;
      if (!param?.templateId) {
        const response = await postTemplateDraft(
          {
            name: templateHeading?.templateTitle,
            description: templateHeading?.templateDescription || "",
            photo: templateHeading?.headerImage || "",
            fields: templateDatasets,
          },
          navigate,
          enqueueSnackbar,
        );
        if (response) {
          resetTemplateValues();
        }
      } else {
        updateTemplateDraft(
          param?.templateId,
          {
            name: templateHeading?.templateTitle,
            description: templateHeading?.templateDescription || "",
            photo: templateHeading?.headerImage || "",
            fields: templateDatasets,
          },
          enqueueSnackbar,
        );
      }
    };

    const [openSection, setOpenSection] = useState(() => new Map());
    const isOpenSection = (item: any) => openSection.get(item.id) ?? true;

    const toggleSection = (item: any, logic: any) => {
      return setOpenSection((m) => new Map(m).set(item.id, !isOpenSection(item)));
    };

    // active question
    const [activeQuestion, setActiveQuestion] = useState(() => new Map());

    const isOpenQuestionLg = (item: any) => {
      return activeQuestion.get(item?.id) ? true : item?.parent === null ? true : false;
    };

    const getActiveLogicQuestion = () => {
      return activeQuestion.get("activeQuestion");
    };

    const toggleQuestionLg = ({
      item,
      state,
      lastItem,
      collectionOfQuestions,
      indicator = "question",
    }: any) => {
      const updatedMap = new Map(activeQuestion);
      if (indicator !== "question") {
        // here we also keep track of the questions to be displayed inside the logics
        if (!collectionOfQuestions?.length) return;
        collectionOfQuestions.forEach((qn: any) => {
          updatedMap.set(qn, true);
        });
        setActiveQuestion(updatedMap);
        return;
      }
      updatedMap.set("activeQuestion", [item?.id, item?.parent]);

      setActiveQuestion((m) => {
        let updates = new Map(m).set(item?.id, !isOpenQuestionLg(item));
        return new Map([...updates, ...updatedMap]);
      });
    };

    const isActiveLogicBlock: Function = (item: any) => {
      if (item?.logicReferenceId === null) {
        return true;
      }
      const activeIds = FlattenObject(activeLogicBlocks);

      let checkOne = activeIds?.includes(item?.id);

      let checkTwo = activeIds?.includes(
        `${item?.globalLogicReferenceId?.split("[logicParentId]")?.reverse()?.[0]}`,
      );

      return !!checkOne && !!checkTwo;
    };

    const [activeNav, setActiveNav] = useState("TEMPLATE");

    return (
      <>
        {!!isLoading && <FullPageLoader></FullPageLoader>}

        {/* <TemplateHeading formikBag={formikBags} /> */}
        <>
          {activeNav !== "Mobile Preview" ? (
            <>
              <ConfirmationModal
                openModal={pageDeleteModal}
                setOpenModal={setPageDeleteModal}
                confirmationIcon={LogoutIcon}
                handelConfirmation={handleDeleteConfirmation}
                confirmationHeading={`Do you want to delete this ${
                  removeId?.title ? removeId?.title : ""
                }?`}
                confirmationDesc={`Entire page along with it's layouts will be removed permanently.`}
                status="warning"
              />
              {/* success toaster  */}
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackOpen}
                autoHideDuration={3000}
                onClose={handleClose}
              >
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                  {snackSuccessMessage}
                </Alert>
              </Snackbar>
              <div>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ py: 1, px: 2 }}
                >
                  <div>Queries</div>
                  <div
                    style={{
                      // background: '#F9FAFB',
                      height: "30px",
                      width: "30px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    {/* <GridMoreVertIcon /> */}
                  </div>
                </Stack>
              </div>
              <Divider />
              <>
                <Button
                  onClick={() => handleDraft()}
                  // ref={saveButton}
                  id={"draft-template"}
                  sx={{ display: "none" }}
                >
                  {"Draft"}
                </Button>
                <Button
                  onClick={() => handleSubmit()}
                  ref={saveButton}
                  id={"template__button"}
                  sx={{ display: "none" }}
                >
                  {param?.templateId ? "Re-Build" : "Build"}
                </Button>
              </>

              <div className="template__container-box">
                <div className="template__content" style={{ paddingTop: "10px" }}>
                  <TabPage
                    onAddClick={createNewPageHandler}
                    pageItems={templateDataObject?.pageItems}
                  />
                  <div id="TitlePage">
                    {/* <div className="title_page_desc">
              Title page is the first page of your inspection report. You can customise it below.{' '}
            </div> */}
                    <>
                      {/* =============== need to mapped the form components here  ==========*/}
                      <div id="StarterForm">
                        <div className="StarterForm_wrapper">
                          <div className="StarterForm_card">
                            <Box className="starter_card_container">
                              <Box>
                                {!templateDataObject?.rootItems.filter(
                                  (item: any) =>
                                    item.parentPage === templateDataObject?.activePage?.id,
                                ).length && (
                                  <div id="" className={"top"}>
                                    <ToggleButtonGroup
                                      // value={alignment}
                                      className="template_HoverItems"
                                      orientation="horizontal"
                                      exclusive
                                      // onChange={handleAlignment}
                                      aria-label="text alignment"
                                    >
                                      {tooltipItems.slice(0, 2).map((item: any, index: any) => (
                                        <Tooltip
                                          title={item.title}
                                          placement="right"
                                          arrow
                                          key={index}
                                          onClick={() =>
                                            clickHandler(
                                              index,
                                              (item = {
                                                id: uuidv4(),
                                                parent: null,
                                                parentPage: templateDataObject?.activePage?.id,
                                                globalLogicReferenceId: null,
                                                logicReferenceId: null,
                                              }),
                                            )
                                          }
                                        >
                                          <ToggleButton
                                            value={index}
                                            aria-label="left aligned"
                                            disabled={item.disabled}
                                          >
                                            <img src={item.icon} alt={item.title} />
                                          </ToggleButton>
                                        </Tooltip>
                                      ))}
                                    </ToggleButtonGroup>
                                  </div>
                                )}

                                <ScrollingComponent className="scroll__container">
                                  {templateDataObject?.rootItems
                                    .filter(
                                      (item: any) =>
                                        item.parentPage === templateDataObject?.activePage?.id,
                                    )
                                    .map((rootItem: any, index: any) => {
                                      const show = isActiveLogicBlock(rootItem);
                                      return show ? (
                                        <>
                                          <DivSeperator></DivSeperator>
                                          <TreeNode
                                            isOpenSection={isOpenSection}
                                            toggleSection={toggleSection}
                                            formikBags={formikBags}
                                            // key={rootItem.id}
                                            key={`${rootItem?.id}-index`}
                                            id={rootItem.id}
                                            item={rootItem}
                                            rootItems={templateDataObject?.rootItems}
                                            items={templateDatasets}
                                            index={index}
                                            handleAddTitleDesctiption={handleAddTitleDesctiption}
                                            uploadImageHandler={uploadImageHandler}
                                            templateDeleteHandler={templateDeleteHandler}
                                            multipleResponseData={multipleResponseData}
                                            globalResponseData={globalResponseData}
                                            internalResponseData={internalResponseData}
                                            externalResponseData={externalResponseData}
                                            questionLogicShow={{
                                              isOpenQuestionLg,
                                              toggleQuestionLg,
                                              activeQuestion,
                                              getActiveLogicQuestion,
                                            }}
                                            activeLogic={{ isActiveLogicBlock }}
                                          />
                                        </>
                                      ) : (
                                        <></>
                                      );
                                    })}
                                </ScrollingComponent>
                              </Box>
                            </Box>
                          </div>
                        </div>
                      </div>
                    </>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <MobilePreview
                children={
                  <div>
                    <MobileIndex />
                  </div>
                }
              />
            </>
          )}
        </>

        <CustomBottomNavigation navigationActive={{ activeNav, setActiveNav }} />

        {/* {children} */}
      </>
    );
  },
);

function TreeNode({
  formikBags,
  id,
  item,
  rootItems,
  items,
  index,
  handleAddTitleDesctiption,
  templateDeleteHandler,
  uploadImageHandler,
  isOpenSection,
  toggleSection,
  sameBlock,
  questionLogicShow,
  activeLogic,
  multipleResponseData,
  globalResponseData,
  internalResponseData,
  externalResponseData,
  set,
}: any) {
  const addTemplateQuestion = useTemplateFieldsStore((state: any) => state.addTemplateQuestion);
  const [imageLabel, setImageLabel] = useState("");
  const { updateTemplateDatasets, templateDatasets } = useTemplateFieldsStore();
  const addTemplateSection = useTemplateFieldsStore((state: any) => state.addTemplateSection);
  const [openSection, setOpenSection] = useState(true);
  const [toggle, setToggle] = useState(true);
  const addLogicRef: RefObject<HTMLButtonElement> = useRef<HTMLButtonElement | null>(null);

  const handleAddTemplateQuestion = (item: any, id: any) => {
    addTemplateQuestion(item, id);
  };
  const handleAddTemplateSection = (item: any, id: any) => {
    addTemplateSection(item, id, item?.logicReferenceId, item?.globalLogicReferenceId);
  };

  // child nesting
  const childItems = items?.filter(
    (child: any) => child.parent?.toString() === item.id?.toString(),
  );
  // find parent logic
  const logic = templateDatasets?.find((lg: any) => lg.id === item.logicId);

  const [alignment, setAlignment] = React.useState<string | null>("left");
  // image uploader
  const [OpenImageUPloadModal, setOpenImageUploadModal] = React.useState<boolean>(
    item?.isImageOpened,
  );

  const [clearData, setClearData] = React.useState<boolean>(false);
  useEffect(() => {
    if (item?.isImageOpened) {
      setOpenImageUploadModal(item?.isImageOpened);
    }
  }, [item?.isImageOpened]);

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

  // for transition animation
  const containerRef = React.useRef<any>(null);

  //  tooltip callback function
  const clickHandler = (tooltipIndex: number, title?: string) => {
    switch (tooltipIndex) {
      case 0:
        handleAddTemplateQuestion(item, item?.id);
        break;
      case 1:
        // onAddSection(item, item?.id);
        handleAddTemplateSection(item, item?.id);
        break;
      case 2:
        uploadImageHandler(item, item?.id);
        break;
      case 3:
        handleAddTitleDesctiption(item, item?.id);
        break;
      case 5:
        templateDeleteHandler(id, title);
        break;
      default:
    }
  };

  useEffect(() => {
    // updating the image label
    // updateTemplateDatasets(item, 'imageLabel', imageLabel);
  }, [imageLabel]);

  function AddLogicImplementation() {
    if (addLogicRef?.current) {
      addLogicRef?.current?.click();
    }
  }

  let logicHead = null;
  let logicBody = null;

  const location = useLocation();

  const [showFnrField, setShowFnrField] = useState(
    location.pathname.includes("edit") ? false : true,
  );

  if (logic?.id) {
    const logicComponentProps = {
      dataItem: logic,
      ref: addLogicRef,
      activeLogic,
    };

    logicHead = ResponseInputLogicNew({
      dataItem: logic,
      ref: addLogicRef,
      activeLogic,
      questionLogicShow,
      toggleSection,
      LOGIC: logic,
      setShowFnrField: setShowFnrField,
    })?.["head"];
    logicBody = ResponseInputLogicNew({
      dataItem: logic,
      ref: addLogicRef,
      activeLogic,
      questionLogicShow,
      toggleSection,
      LOGIC: logic,
      setShowFnrField: setShowFnrField,
    })?.["body"];
  }

  return (
    <>
      <MultiUploader
        setOpenMultiImage={() => {
          item.isImageOpened = !item.isImageOpened;
          setOpenImageUploadModal(!OpenImageUPloadModal);
        }}
        openMultiImage={OpenImageUPloadModal}
        getFileData={(files: [{ documents: any[]; title: string }]) => {
          updateTemplateDatasets(item, "imageImg", files);
        }}
        requireDescription={false}
        defaultViewer={false}
        initialData={[]}
        clearData={clearData}
        setClearData={setClearData}
        accept={{
          "image/jpeg": [".jpeg", ".jpg"],
          "image/png": [".png"],
          "application/pdf": [".pdf"],
        }}
        maxFileSize={2}
      />

      <div
        className={`${item.component !== "logic" ? `template__${item.component}-block ` : ""} ${
          item.component !== "logic" && item.parent ? "nested__block" : ""
        }`}
        style={{
          display: "flex",
          width: `${item.component !== "logic" && item?.parent === null ? "90%" : "100%"}`,
          // borderLeft: item.parent === null ? '' : '1px solid gray',
        }}
      >
        {/* {item.parent === null ? (
          <DivSeperator item={item}></DivSeperator>
        ) : (
          )} */}
        <DivSeperator item={item} sameBlock={sameBlock} />

        <div style={{ flex: 1 }} className="box__container">
          <Box ref={containerRef}>
            <div
            // style={{ transitionDelay: '1000ms' }}
            // direction="down"
            // in={true}

            // container={containerRef?.current}
            >
              <Box>
                {item.component === "question" && activeLogic?.isActiveLogicBlock(item) && (
                  <>
                    <TextAnswer
                      responseTypeID={"11"}
                      textValue="Question 1"
                      clickHandler={clickHandler}
                      alignment={alignment}
                      dataItem={item}
                      handleAlignment={handleAlignment}
                      tooltipItems={tooltipItems}
                      onAddLogicClick={AddLogicImplementation}
                      logic={logic}
                      questionLogicShow={questionLogicShow}
                      toggleSection={toggleSection}
                      multipleResponseData={multipleResponseData}
                      globalResponseData={globalResponseData}
                      internalResponseData={internalResponseData}
                      externalResponseData={externalResponseData}
                      isOpenSection={isOpenSection}
                      fnrAction={{ setShowFnrField, showFnrField }}
                    >
                      <>
                        {isOpenSection(item) && questionLogicShow.isOpenQuestionLg(logic) && (
                          <>
                            {["instruction"].includes(item?.type) ? null : logicHead}
                            {logicBody}
                          </>
                        )}
                      </>
                    </TextAnswer>
                  </>
                )}
                {item.component === "section" && activeLogic?.isActiveLogicBlock(item) && (
                  <div
                    className={`${item?.parent === null ? "section__styling-withoutparent" : ""}`}
                  >
                    <Section
                      formikBags={formikBags}
                      id={id}
                      templateDeleteHandler={templateDeleteHandler}
                      item={item}
                      wholeDataSets={items}
                      setToggle={() => setToggle(!toggle)}
                      toggleSection={toggleSection}
                      index={index}
                      isViewOnly={false}
                      logic={logic}
                      handleUploadImage={function (image: File): Promise<void> {
                        throw new Error("Function not implemented.");
                      }}
                      isOpenSection={isOpenSection}
                      loading={false}
                      sectionShowHide={{
                        showHideHandler: setOpenSection,
                        openSection: openSection,
                      }}
                    />
                  </div>
                )}
                {item.component === "titleDescription" && (
                  <TemplateTitleAndDescription item={item} />
                )}
                {/* template image handling */}
                {!!item.imageImg && (
                  // <TemplateImageContainer
                  //   dataItem={item}
                  //   imgSrc={item?.imageFields?.[0]?.documents?.[0]?.preview}
                  // />
                  <TemplateImageContainer
                    imgPreview={item?.imageImg?.[0]?.documents?.[0]?.preview}
                    imageLabel={imageLabel}
                    setImageLabel={setImageLabel}
                    replaceImageHandler={() => {
                      setOpenImageUploadModal(!OpenImageUPloadModal);
                      item.isImageOpened = !item.isImageOpened;
                    }}
                    removeImageHandler={() => {
                      // setImgContainer(null);
                      item.imageImg = null;
                      setClearData(true);
                    }}
                    dataItem={item}
                    editorKey="imageDesc"
                  />
                )}
              </Box>
            </div>
          </Box>
          {(() => {
            if (item?.isLast) {
              return <></>;
            }
          })()}
          {/* child recursion */}
          {activeLogic?.isActiveLogicBlock(item) &&
            isOpenSection(item) &&
            !!childItems?.length &&
            childItems.map((child: any, index: any) => {
              let sameBlock = true;
              let prevItem = index > 0 ? childItems[index - 1] : {};
              if (Object.keys(prevItem)?.length) {
                sameBlock = prevItem?.parent === child?.parent;
              } else {
                sameBlock = true;
              }

              return (
                <>
                  <TreeNode
                    key={child.id}
                    item={child}
                    items={items}
                    id={child.id}
                    index={index}
                    handleAddTitleDesctiption={handleAddTitleDesctiption}
                    uploadImageHandler={uploadImageHandler}
                    templateDeleteHandler={templateDeleteHandler}
                    sameBlock={sameBlock}
                    isOpenSection={isOpenSection}
                    multipleResponseData={multipleResponseData}
                    globalResponseData={globalResponseData}
                    internalResponseData={internalResponseData}
                    externalResponseData={externalResponseData}
                    toggleSection={toggleSection}
                    questionLogicShow={questionLogicShow}
                    activeLogic={activeLogic}
                  />
                </>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default StarterTemplate;
