import React, { useEffect, useState, CSSProperties, useRef, RefObject } from "react";
import TextAnswer from "../TextAnswer/TextAnswer";
import tooltipItems from "constants/template/tooltipItems";
import Section from "../Section/Section";
import { itemTypes } from "src/modules/template/itemTypes/itemTypes";
import { useDrag } from "react-dnd";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  ListItemText,
  Slide,
  Snackbar,
  Stack,
} from "@mui/material";
import { GridMoreVertIcon } from "@mui/x-data-grid";
import { ExpandMore } from "@mui/icons-material";
import TemplateTitleAndDescription from "../TemplateTitleAndDescription/TemplateTitleAndDescription";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import DeleteIcon from "src/assets/iconsdelete.svg";
import MultiUploader from "src/components/MultiFileUploader/index";
import BASTooltip from "src/components/BASTooltip/BASTooltip";
import LogoutIcon from "src/assets/iconslogout_icon.svg";
import { TemplateDataStructure } from "./TemplateInitialDataStructure";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import { useTemplateStore } from "src/modules/template/store/templateStore";
import { useNavigate, useParams } from "react-router-dom";
import FullPageLoader from "src/components/FullPageLoader";
import TemplateImageContainer from "../TemplateImageContainer/TemplateImageContainer";
import ResponseInputLogicNew from "containers/template/components/InputComponents/ResponseInputLogicNew";
import DivSeperator from "../DivSeperator/index";
import TabPage from "containers/template/layout/PageTab";
import { PageDescription } from "containers/template/layout/PageTab";

const StarterTemplate = ({ formikBags }: any) => {
  const navigate = useNavigate();
  const param = useParams();

  const postTemplate = useTemplateStore((state: any) => state?.postTemplate);
  const updateTemplate = useTemplateStore((state: any) => state?.updateTemplate);
  const isLoading = useTemplateStore((state: any) => state?.isLoading);
  const getTemplate = useTemplateStore((state: any) => state?.getTemplate);
  const template = useTemplateStore((state: any) => state?.template);

  const {
    templateDatasets,
    templateHeading,
    setTemplateDatasets,
    addTitleAndDescription,
    setTemplateHeading,
    activeLogicBlocks,
    selectedDataset,
    activePageId,
  } = useTemplateFieldsStore();

  useEffect(() => {
    if (param?.templateId) {
      getTemplate(param?.templateId);
    }
  }, [param?.templateId]);

  useEffect(() => {
    if (template) {
      setTemplateDatasets(template?.fields);
      setTemplateHeading("templateDescription", template?.description);
      setTemplateHeading("templateTitle", template?.name);
      setTemplateHeading("headerImage", template?.photo);
    }
  }, [template]);

  const [open, setOpen] = React.useState(true);

  const [removeId, setRemoveId] = useState<any>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [pageDeleteModal, setPageDeleteModal] = useState(false);
  const [snackSuccessMessage, setSnackSuccessMessage] = useState<string>("");
  const { addNewPageHandler, deleteTemplateContents } = useTemplateFieldsStore();

  const handleClick = () => {
    setOpen(!open);
  };

  const datasetDefault = [...TemplateDataStructure];

  const [dataset, setDataset] = useState<any>(datasetDefault || []);

  const templateDataObject: {
    rootItems: [];
    pageItems: [];
    activePage: any;
    logicDataSet: [];
    childDataSet: [];
  } = templateDatasets.reduce(
    (acc: any, curr: any) => {
      if (curr.parent === null && curr.component !== "page" && curr.component !== "logic") {
        acc.rootItems.push(curr);
      } else if (curr.parent === null && curr.component === "page" && curr.component !== "logic") {
        acc.pageItems.push(curr);
        if (activePageId === curr?.id) {
          acc.activePage = { ...curr };
        }
      } else if (curr.component === "logic") {
        acc.logicDataSet.push(curr);
      } else if (curr.parent && curr.component !== "logic") {
        acc.childDataSet.push(curr);
      }

      return acc;
    },
    { rootItems: [], pageItems: [], activePage: {}, logicDataSet: [], childDataSet: [] },
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
  });

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  // deleting the template stuffs
  const templateDeleteHandler = (id: any) => {
    setPageDeleteModal(true);
    setRemoveId(id);
  };

  const handleDeleteConfirmation = () => {
    deleteTemplateContents(removeId);
    setPageDeleteModal(false);
    setSnackOpen(true);
    setSnackSuccessMessage("Content Deleted Successfully");
  };

  const handleSubmit = () => {
    !param?.templateId
      ? postTemplate(
          {
            name: templateHeading?.templateTitle,
            description: templateHeading?.templateDescription || "",
            photo: templateHeading?.headerImage || "",
            fields: templateDatasets,
          },
          navigate,
        )
      : updateTemplate(
          param?.templateId,
          {
            name: templateHeading?.templateTitle,
            description: templateHeading?.templateDescription || "",
            photo: templateHeading?.headerImage || "",
            fields: templateDatasets,
          },
          navigate,
        );
  };

  const [openSection, setOpenSection] = useState(() => new Map());

  const isOpenSection = (item: any) => openSection.get(item.id) ?? true;
  const toggleSection = (item: any) =>
    setOpenSection((m) => new Map(m).set(item.id, !isOpenSection(item)));

  return (
    <>
      {!!isLoading && <FullPageLoader></FullPageLoader>}

      {/* <TemplateHeading formikBag={formikBags} /> */}

      <ConfirmationModal
        openModal={pageDeleteModal}
        setOpenModal={setPageDeleteModal}
        confirmationIcon={LogoutIcon}
        handelConfirmation={handleDeleteConfirmation}
        confirmationHeading={`Do you want to delete this page?`}
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
          sx={{ py: 1.5, px: 2 }}
        >
          <div>Queries</div>
          <div
            style={{
              background: "#F9FAFB",
              height: "30px",
              width: "30px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <GridMoreVertIcon />
          </div>
        </Stack>
      </div>
      <Divider />
      {/* <Button onClick={() => handleSubmit()}>
        {param?.templateId ? 'EDIT & PUBLISH' : 'Publish'}
      </Button> */}
      <div>
        <div className="template__content" style={{ marginTop: "16px" }}>
          <TabPage onAddClick={createNewPageHandler} pageItems={templateDataObject?.pageItems} />
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
                        {/* forms */}
                        {templateDataObject?.rootItems
                          .filter(
                            (item: any) => item.parentPage === templateDataObject?.activePage?.id,
                          )
                          .map((rootItem: any, index: any) => (
                            <TreeNode
                              isOpenSection={isOpenSection}
                              toggleSection={toggleSection}
                              formikBags={formikBags}
                              key={rootItem.id}
                              id={rootItem.id}
                              item={rootItem}
                              rootItems={templateDataObject?.rootItems}
                              items={templateDatasets}
                              index={index}
                              handleAddTitleDesctiption={handleAddTitleDesctiption}
                              uploadImageHandler={uploadImageHandler}
                              templateDeleteHandler={templateDeleteHandler}
                              templateDataObject={templateDataObject}
                            />
                          ))}
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
  );
};

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
  templateDataObject,
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
  const { activeLogicBlocks } = useTemplateFieldsStore();
  // child nesting
  const childItems = items?.filter(
    (child: any) => child.parent?.toString() === item.id?.toString(),
  );

  // find the parent logic
  const logic = templateDataObject?.logicDataSet?.find((lg: any) => lg.id === item.logicId);
  const [alignment, setAlignment] = React.useState<string | null>("left");
  // image uploader
  const [OpenImageUPloadModal, setOpenImageUploadModal] = React.useState<boolean>(
    item?.isImageOpened,
  );

  const [clearData, setClearData] = React.useState<boolean>(false);

  console.log({ templateDatasets });

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
  const clickHandler = (tooltipIndex: number) => {
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
        templateDeleteHandler(id);
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
        className={`${item.component !== "logic" ? `template__${item.component}-block` : ""} ${
          item.component !== "logic" && item.parent ? "nested__block" : ""
        }`}
        style={{
          display: "flex",
          // borderLeft: item.parent === null ? '' : '1px solid gray',
        }}
      >
        {item.parent === null ? (
          <DivSeperator item={item}></DivSeperator>
        ) : (
          <DivSeperator item={item} sameBlock={sameBlock} />
        )}

        <div style={{ flex: 1 }}>
          <Box ref={containerRef}>
            <Slide
              // style={{ transitionDelay: '1000ms' }}
              direction="up"
              in={true}
              container={containerRef?.current}
            >
              <Box>
                {item.component === "question" && !item?.logicReferenceId && (
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
                    />
                    {logic?.id ? (
                      (() => {
                        let childItems = templateDataObject?.childDataSet?.filter(
                          (child: any) => child.parent === logic.id,
                        );
                        return (
                          <>
                            {/* <ResponseInputLogicNew dataItem={logic} ref={addLogicRef} item={item} /> */}
                            {!!childItems?.length &&
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
                                      toggleSection={toggleSection}
                                      templateDataObject={templateDataObject}
                                    />
                                  </>
                                );
                              })}
                          </>
                        );
                      })()
                    ) : (
                      <></>
                    )}
                  </>
                )}

                <>
                  {item.component === "question" &&
                    item.logicReferenceId !== null &&
                    (() => {
                      let checkOne = activeLogicBlocks?.[
                        `${item?.logicReferenceId?.split("[logicParentId]")?.[0]}`
                      ]?.[
                        `${item?.logicReferenceId?.split("[logicParentId]")?.reverse()?.[0]}`
                      ]?.includes(item?.id);
                      let checkTwo =
                        activeLogicBlocks.hasOwnProperty(
                          item?.globalLogicReferenceId?.split("[logicParentId]")?.[0],
                        ) &&
                        activeLogicBlocks[
                          `${item?.globalLogicReferenceId?.split("[logicParentId]")?.[0]}`
                        ]?.hasOwnProperty(
                          `${
                            item?.globalLogicReferenceId?.split("[logicParentId]")?.reverse()?.[0]
                          }`,
                        );

                      return (
                        <>
                          {checkOne && checkTwo ? (
                            <TextAnswer
                              responseTypeID={"11"}
                              textValue="Question 1"
                              clickHandler={clickHandler}
                              alignment={alignment}
                              dataItem={item}
                              handleAlignment={handleAlignment}
                              tooltipItems={tooltipItems}
                              onAddLogicClick={AddLogicImplementation}
                            />
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    })()}
                </>

                {/* {item.component === 'logic' && item.logicReferenceId === null && (
                  <>
                    <ResponseInputLogicNew dataItem={item} ref={addLogicRef} />
                  </>
                )} */}

                {/* {item.component === 'logic' &&
                  item.logicReferenceId !== null &&
                  (() => {
                    let checkOne = activeLogicBlocks?.[
                      `${item?.logicReferenceId?.split('[logicParentId]')?.[0]}`
                    ]?.[
                      `${item?.logicReferenceId?.split('[logicParentId]')?.reverse()?.[0]}`
                    ]?.includes(item?.parent);
                    let checkTwo =
                      activeLogicBlocks.hasOwnProperty(
                        item?.globalLogicReferenceId?.split('[logicParentId]')?.[0],
                      ) &&
                      activeLogicBlocks[
                        `${item?.globalLogicReferenceId?.split('[logicParentId]')?.[0]}`
                      ]?.hasOwnProperty(
                        `${item?.globalLogicReferenceId?.split('[logicParentId]')?.reverse()?.[0]}`,
                      );
                    return (
                      <>
                        {checkOne && checkTwo ? <ResponseInputLogicNew dataItem={item} /> : <></>}
                      </>
                    );
                  })()} */}

                {item.component === "section" && item.logicReferenceId === null && (
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
                      handleUploadImage={function (image: File): Promise<void> {
                        throw new Error("Function not implemented.");
                      }}
                      loading={false}
                      sectionShowHide={{
                        showHideHandler: setOpenSection,
                        openSection: openSection,
                      }}
                    />
                  </div>
                )}

                <>
                  {item.component === "section" &&
                    item.logicReferenceId !== null &&
                    (() => {
                      let checkOne = activeLogicBlocks?.[
                        `${item?.logicReferenceId?.split("[logicParentId]")?.[0]}`
                      ]?.[
                        `${item?.logicReferenceId?.split("[logicParentId]")?.reverse()?.[0]}`
                      ]?.includes(item?.id);
                      let checkTwo =
                        activeLogicBlocks.hasOwnProperty(
                          item?.globalLogicReferenceId?.split("[logicParentId]")?.[0],
                        ) &&
                        activeLogicBlocks[
                          `${item?.globalLogicReferenceId?.split("[logicParentId]")?.[0]}`
                        ]?.hasOwnProperty(
                          `${
                            item?.globalLogicReferenceId?.split("[logicParentId]")?.reverse()?.[0]
                          }`,
                        );
                      return (
                        <>
                          {checkOne && checkTwo ? (
                            <div>
                              <Section
                                formikBags={formikBags}
                                id={id}
                                templateDeleteHandler={templateDeleteHandler}
                                item={item}
                                wholeDataSets={items}
                                index={index}
                                isViewOnly={false}
                                handleUploadImage={function (image: File): Promise<void> {
                                  throw new Error("Function not implemented.");
                                }}
                                loading={false}
                                sectionShowHide={{
                                  showHideHandler: setOpenSection,
                                  openSection: openSection,
                                }}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    })()}
                </>

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
            </Slide>
          </Box>
          {(() => {
            if (item?.isLast) {
              return <></>;
            }
          })()}
          {/* child recursion */}
          {isOpenSection(item) &&
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
                    toggleSection={toggleSection}
                    templateDataObject={templateDataObject}
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
