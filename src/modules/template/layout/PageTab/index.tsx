import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useTemplateFieldsStore } from "src/store/zustand/templates/templateFieldsStore";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import LogoutIcon from "src/assets/icons/logout_icon.svg";
import { useSnackbar } from "notistack";
import { TextareaAutosize } from "@mui/material";
import { Tooltip } from "@mui/material";

const defaultText =
  " Title page is the first page of your inspection report. You can customise it below";

export const PageDescription = ({ dataItem }: any) => {
  const { setActivePageId, activePageId, deletePageHandler, updateTemplateDatasets } =
    useTemplateFieldsStore();
  const [pageDesc, setPageDesc] = useState(false);
  return (
    <div
      className="title_page_desc"
      onClick={(e) => {
        setPageDesc(true);
      }}
    >
      {" "}
      {pageDesc ? (
        <>
          <TextareaAutosize
            style={{ width: "100%" }}
            minRows={1}
            autoFocus
            id="w3review"
            className="text__area-style"
            name={`${dataItem?.id}`}
            value={dataItem.description || ""}
            onBlur={(e: any) => {
              e.stopPropagation();
              setPageDesc(false);
            }}
            onChange={(e: any) => {
              e.stopPropagation();
              updateTemplateDatasets({ id: dataItem?.id }, "description", e?.target?.value);
            }}
          />
        </>
      ) : (
        <span>{dataItem.description ? dataItem.description : defaultText}</span>
      )}
    </div>
  );
};

const PageTab = ({ it, selectedData, setSelectedData, index, setPageDeleteModal }: any) => {
  const [pageInput, setPageInput] = useState(false);

  const { setActivePageId, activePageId, deletePageHandler, updateTemplateDatasets } =
    useTemplateFieldsStore();

  let pageTitle = it?.label?.includes("Page")
    ? `${it?.label}  ${index + 1}`
    : it?.label
    ? it?.label
    : `${it?.placeholder} ${index + 1}`;

  return (
    <div
      className={`page-tab ${it.id === activePageId ? "active" : ""} ${
        !pageInput ? "wrap__text" : ""
      }`}
      onClick={() => {
        if (activePageId == it?.id) return;
        setActivePageId?.({ pageId: it?.id });
      }}
    >
      <div className="page-tab-inner">
        <div
          className="page-tab-title"
          onClick={(e: any) => {
            if (e.detail == 2) {
              setPageInput((prev) => true);
            }
          }}
        >
          {pageInput ? (
            <input
              type="text"
              value={it.label}
              autoFocus
              onBlur={(e: any) => {
                e.stopPropagation();
                setPageInput(false);
              }}
              onChange={(e: any) => {
                e.stopPropagation();
                updateTemplateDatasets({ id: it?.id }, "label", e?.target?.value);
              }}
            />
          ) : (
            <Tooltip title={pageTitle} placement="top-start">
              <span>{pageTitle}</span>
            </Tooltip>
          )}
        </div>
        <div
          className="page-tab-close"
          onClick={(e: any) => {
            e.stopPropagation();
          }}
        >
          <div
            className="icon"
            onClick={() => {
              setSelectedData(() => ({ id: it.id, index: `${index}` }));
              setPageDeleteModal(true);
            }}
          >
            <CloseIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = ({ onAddClick, pageItems }: any) => {
  const { setActivePageId, activePageId, deletePageHandler, updateTemplateDatasets } =
    useTemplateFieldsStore();
  const [pageDeleteModal, setPageDeleteModal] = useState(false);
  const [selectedData, setSelectedData] = useState({ id: "", index: "" });
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteConfirmation = () => {
    if (!selectedData?.id) return;

    deletePageHandler({ pageId: selectedData?.id });
    if (Number(selectedData?.index) > 0) {
      setActivePageId?.({ pageId: pageItems?.[Number(selectedData?.index) - 1]?.id });
    }
    setPageDeleteModal(false);
    enqueueSnackbar("Page Deleted Succesfully", { variant: "success" });
  };

  return (
    <>
      <div className="tab__page">
        <ConfirmationModal
          openModal={pageDeleteModal}
          setOpenModal={setPageDeleteModal}
          confirmationIcon={LogoutIcon}
          handelConfirmation={handleDeleteConfirmation}
          confirmationHeading={`Do you want to delete this page?`}
          confirmationDesc={`Entire page along with it's layouts will be removed permanently.`}
          status="warning"
        />
        <div>
          {pageItems?.map((it: any, index: number) => {
            return (
              <>
                <PageTab
                  key={index}
                  selectedData={selectedData}
                  setSelectedData={setSelectedData}
                  index={index}
                  it={it}
                  setPageDeleteModal={setPageDeleteModal}
                />
              </>
            );
          })}
        </div>

        <button type="button" className="tab__page-add-button" onClick={onAddClick}>
          <AddIcon />
        </button>
      </div>
      {(() => {
        let dataItem = pageItems?.find((it: any) => it.id === activePageId);
        return Object.keys(dataItem || {})?.length ? (
          <PageDescription dataItem={dataItem} />
        ) : (
          <></>
        );
      })()}
    </>
  );
};

export default Index;
