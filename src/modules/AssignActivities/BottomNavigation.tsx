import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";
import {
  deleteAPiData,
  fetchApI,
  postApiData,
  putApiData,
} from "src/modules/apiRequest/apiRequest";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import MultiSelect from "src/components/CustomMultiSelect/version2";
import { Box } from "@mui/system";
import Filter from "./Form/Filter";
import Assign from "./BottomNavigation/Assign";
import { useSnackbar } from "notistack";
import { checkPermission } from "src/utils/permission";
import RestoreIcon from "@mui/icons-material/Restore";
import { deleteAPI } from "src/lib/axios";

const BottomNavigation = ({
  selectedData = [],
  domainName = "",
  activityStatus = [],
  filterValues,
  tableDataSet,
  deleteHandler,
  setSelectedData,
  urlUtils,
  tableIndicator,
  setterFunction,
  permissions,
  permission,
}: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [assignUser, setAssignUser] = useState<any>([]);
  const [userStatus, setUserStatus] = useState<any>({ id: "", name: "" });
  const [activeComponent, setActiveComponent] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = React.useState("");

  let { assignActivity, setAssignActivityData } = tableDataSet;

  useEffect(() => {
    if (selectedData?.length) {
      const queryParam = selectedData?.[0]?.rest
        ? selectedData
            ?.map(
              (data: any) =>
                `${data?.rest?.user_department
                  ?.map((depart: any) => `departments=${depart}`)
                  .join("&")}`,
            )
            .join("&")
        : selectedData
            ?.map(
              (data: any) =>
                `${data?.user_department?.map((depart: any) => `departments=${depart}`).join("&")}`,
            )
            .join("&");
      fetchApI({ setterFunction: setAssignUser, url: "activity/users-department", queryParam });
    }
  }, [selectedData]);

  const AssignBox = ({ loading }: any) => {
    const [selectedValues, setSelectedValues] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);

    return (
      <>
        {openModal && (
          <ConfirmationModal
            openModal={openModal}
            setOpenModal={() => {
              setOpenModal(!openModal);
              setSelectedData([]);
            }}
            handelConfirmation={async () => {
              setLoading(true);
              let tableVal = { ...assignActivity };
              // modal api
              const apiRequestStatus = await putApiData({
                values: {
                  activities_id: selectedData?.map((data: any) => data?.id),
                  users: selectedValues,
                },
                url: "activity/assign-activity/",
                domain: "Assign Activity",
                enqueueSnackbar: enqueueSnackbar,
              });
              const newData = selectedValues.map((it: any) => {
                const userData = assignUser.find((data: any) => data?.id === it);
                if (userData) {
                  return userData?.full_name;
                } else {
                  return;
                }
              });
              if (apiRequestStatus) {
                let selectedDataId: any = selectedData?.map((it: any) => it?.id);
                let filterItemList = tableVal.items.filter(
                  (item: any) => !selectedDataId.includes(item.id),
                );
                const updatedDatas = selectedData?.[0]?.rest
                  ? selectedData?.map((it: any) => ({
                      ...it?.rest,
                      users_obj: [...new Set([...it?.rest?.users_obj, ...newData])],
                    }))
                  : selectedData?.map((it: any) => ({
                      ...it,
                      users_obj: [...new Set([...it.users_obj, ...newData])],
                    }));
                let updatedData = [...updatedDatas, ...filterItemList];
                setAssignActivityData((prev: any) => ({ ...prev, items: updatedData }));
                setActiveComponent("");
                setSelectedData([]);
              }
              setLoading(false);
            }}
            confirmationHeading={`Assign Activity`}
            confirmationDesc={`Are you sure you want to assign activity to ${
              assignUser?.length &&
              assignUser
                .filter((user: { id: any }) => {
                  let data: any = { ...user };
                  return selectedValues?.includes(data.id);
                })
                ?.map((data: any) => data?.full_name)
                .join(", ")
            }`}
            status="warning"
            confirmationIcon="src/assets/icons/icon-feature.svg"
            loader={loading}
          />
        )}
        <div style={{ overflow: "hidden" }} className="assign__box-popup">
          <div style={{ width: "320px" }}>
            <DialogTitle className="popup__heading">
              Assign To
              <IconButton
                onClick={() => {
                  setActiveComponent("");
                }}
                className="close__icon"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <div className="content">
              <Typography className="sub__title">Select Assignee</Typography>
              <div className="select__wrapper">
                <Select
                  id="assign_users"
                  multiple
                  value={selectedValues}
                  onChange={async (e: any) => {
                    const {
                      target: { value },
                    } = e;
                    setSelectedValues(
                      // On autofill we get a stringified value.
                      typeof value === "string" ? value.split(",") : value,
                    );
                  }}
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 200 } },
                  }}
                >
                  {assignUser?.map((item: any, index: number) => (
                    <MenuItem key={item?.id} value={item.id}>
                      {item?.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            <DialogActions className="actions__container">
              <Button
                disabled={loading}
                onClick={() => {
                  setOpenModal(true);
                }}
                type="button"
                variant="contained"
                className="close__button"
              >
                Assign
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setActiveComponent("");
                }}
                variant="outlined"
                className="close__button"
              >
                Close
              </Button>
            </DialogActions>
          </div>
        </div>
      </>
    );
  };

  const ChangeStatusBox = () => {
    const [openModal, setOpenModal] = useState(false);
    return (
      <>
        {openModal && (
          <ConfirmationModal
            openModal={openModal}
            setOpenModal={() => {
              setOpenModal(!openModal);
              setSelectedData([]);
            }}
            handelConfirmation={async () => {
              setLoading(true);
              // modal api
              let apiRequestStatus = await putApiData({
                values: {
                  activities_id: selectedData?.map((data: any) => data?.id),
                  status: userStatus?.id,
                },
                url: "activity/change-status/",
                message: "Assign activity status has been changed succesfully",
                enqueueSnackbar: enqueueSnackbar,
              });

              if (apiRequestStatus) {
                let tableVal = { ...assignActivity };
                if (selectedData?.length) {
                  let selectedDataId: any = selectedData?.map((it: any) => it?.id);
                  let filterItemList = tableVal.items.filter(
                    (item: any) => !selectedDataId.includes(item.id),
                  );
                  const updatedDatas = selectedData?.[0]?.rest
                    ? selectedData?.map((it: any) => ({
                        ...it?.rest,
                        status: userStatus?.rest?.name,
                      }))
                    : selectedData?.map((it: any) => ({
                        ...it,
                        status: userStatus?.name,
                      }));
                  let updatedData = [...updatedDatas, ...filterItemList];
                  setAssignActivityData((prev: any) => ({ ...prev, items: updatedData }));
                }
                setActiveComponent("");
                setSelectedData([]);
              }
              setLoading(false);
            }}
            confirmationHeading={`Assign Activity Status`}
            confirmationDesc={`Are you sure you want to change status of ${selectedData
              ?.map((item: any) => item?.title)
              ?.join(", ")} to ${userStatus?.name}`}
            status="warning"
            confirmationIcon="src/assets/icons/icon-feature.svg"
            loader={loading}
          />
        )}
        <div className="status__box">
          <Box
            sx={{
              width: "150%",
              bgcolor: "background.paper",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow:
                "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
            }}
          >
            {activityStatus?.map((status: any) => {
              return (
                <List component="nav" aria-label="main mailbox folders" sx={{ py: "0" }}>
                  <ListItemButton
                    selected={status?.id == userStatus?.id}
                    className={`${status?.id == userStatus?.id ? "active__box" : ""}`}
                    onClick={(event) => {
                      setUserStatus({ id: status?.id, name: status?.name });
                    }}
                  >
                    <ListItemText primary={`${status?.name}`} />
                  </ListItemButton>
                </List>
              );
            })}
            <div style={{ padding: "16px" }}>
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                type="button"
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Apply
              </Button>
            </div>
          </Box>
        </div>
      </>
    );
  };

  const componentList: any = {
    assign: <AssignBox loading={loading} />,
    status: <ChangeStatusBox />,
  };
  async function duplicateRestoreAPI({
    values,
    enqueueSnackbar,
    setIsFormLoading,
    domain,
    url,
    setTableDatas,
    method = "re-store",
  }: any) {
    await postApiData({
      setterFunction: (data: any) => {
        if (method !== "duplicate") {
          setTableDatas((prev: any) => ({
            ...prev,
            items: prev?.items?.filter((it: any) => !values?.includes(it?.id)) || [],
          }));
        }
        setTableDatas((prev: any) => ({
          ...prev,
          items: [...(data?.data || []), ...prev?.items],
        }));
      },
      values: values,
      url:
        method === "duplicate"
          ? `/${url}/duplicate/${values?.id}`
          : method === "re-store"
          ? `/${url}/restore/`
          : "",
      enqueueSnackbar: enqueueSnackbar,
      domain: domain,
      setterLoading: setIsFormLoading,
    });
  }
  const deleteHandlerr = async (datas: object[], key: string = "name") => {
    let selectedIds = datas?.map((data: { id?: number }) => data?.id);
    let selectedName = datas?.map((data: any) => data?.[`${key}`]);
    try {
      await deleteAPI(`${tableIndicator?.backendUrl}/`, {
        config_ids: selectedIds,
      });
      enqueueSnackbar(
        `${
          selectedName?.length > 1 ? selectedName?.join(", ") : selectedName[0]
        } deleted successfully`,
        {
          variant: "success",
        },
      );
      setterFunction?.((prev: any) => {
        // if(prev?.items)
        // need to put logic for those that have no items
        const newItems = prev?.items?.filter(
          (item: { id?: number }) => !selectedIds.includes(item.id),
        );
        return {
          ...prev,
          items: newItems,
          archivedCount: Number(prev?.archivedCount || 0) + selectedIds?.length,
          total: Number(prev?.total || 0) - selectedIds?.length,
        };
      });
      setSelectedData([]);

      return true;
    } catch (error: any) {
      enqueueSnackbar(
        error.message ||
          `Unable to delete ${
            selectedName?.length > 1 ? selectedName?.join(", ") : selectedName[0]
          }`,
        { variant: "error" },
      );
      return true;
    }
  };

  return (
    <>
      <ConfirmationModal
        openModal={open}
        setOpenModal={() => {
          setOpen(!open);
          setSelectedData([]);
        }}
        handelConfirmation={async () => {
          setLoading(true);
          // modal api
          if (method === "delete") {
            // apiRequestStatus = await deleteAPiData({
            //   values: selectedData?.map((it: any) => it?.id),
            //   url: 'activity/',
            //   domain: 'Assign Activity',
            //   enqueueSnackbar: enqueueSnackbar,
            // });
            await deleteHandlerr([...selectedData]);
          }
          if (method === "re-store") {
            let selectedIds = selectedData?.map((data: { id?: number }) => data?.id);

            await duplicateRestoreAPI({
              values: [...(selectedData?.map((it: any) => it?.id) || [])],
              domain: tableIndicator?.buttonName,
              url: tableIndicator?.backendUrl,
              setTableDatas: setterFunction,
              enqueueSnackbar: enqueueSnackbar,
              method: "re-store",
            });
            setterFunction?.((prev: any) => {
              // if(prev?.items)
              // need to put logic for those that have no items
              const newItems = prev?.items?.filter(
                (item: { id?: number }) => !selectedIds.includes(item.id),
              );
              return {
                ...prev,
                items: newItems,
                archivedCount: Number(prev?.archivedCount || 0) - selectedIds?.length,
                total: Number(prev?.total || 0) - selectedIds?.length,
              };
            });
            setSelectedData([]);
          }

          // if (apiRequestStatus) {
          //   console.log(apiRequestStatus);
          //   let tableVal = { ...assignActivity };
          //   if (selectedData?.length) {
          //     let selectedDataId: any = selectedData?.map((it: any) => it?.id);
          //     let filterItemList = tableVal.items.filter(
          //       (item: any) => !selectedDataId.includes(item.id),
          //     );
          //     setAssignActivityData((prev: any) => ({ ...prev, items: filterItemList }));
          //     setSelectedData([]);
          //   }
          // }
          setLoading(false);
          setOpen(false);
        }}
        confirmationHeading={`Assign Activity`}
        confirmationDesc={`Are you sure you want to ${
          method === "re-store" ? "restore" : "archive"
        }  these ${selectedData?.length > 1 ? "activities" : "activity"}.`}
        status="warning"
        confirmationIcon="src/assets/icons/icon-feature.svg"
        loader={loading}
      />
      <AppBar
        className="bottomNavigation__container"
        position="sticky"
        color="primary"
        enableColorOnDark
        style={{ top: "auto", bottom: 0, borderRadius: "15px" }}
      >
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="left_items">
            <InfoIcon />
            <div
              className="no_of_selected_text"
              style={{
                fontWeight: "500",
                fontSize: "16px",
                marginLeft: "15px",
              }}
            >
              {selectedData.length} {domainName} Selected
            </div>
          </div>
          <div className="right_items myStyle__box">
            <div
              style={{ minWidth: "120px", position: "relative" }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {activeComponent === "assign" ? componentList?.[activeComponent] : <></>}
              <InputLabel
                shrink={false}
                htmlFor="my-select-label"
                className="custom__label-activity"
                onClick={() => {
                  setActiveComponent("assign");
                  // setOpen(true);
                }}
              >
                Assign To
              </InputLabel>
            </div>
            <div style={{ minWidth: "120px", position: "relative" }} className="status__container">
              {activeComponent === "status" ? componentList?.[activeComponent] : <></>}
              <InputLabel
                shrink={false}
                htmlFor="my-select-labels"
                className="custom__label-activity"
                style={{ background: "#C1C6D4" }}
                onClick={() => {
                  if (activeComponent === "status") {
                    setActiveComponent("");
                  } else {
                    setActiveComponent("status");
                  }
                }}
              >
                Change Status
              </InputLabel>
            </div>
            <div className="right_items" style={{ display: "flex", alignItems: "center" }}>
              {urlUtils?.archived === "true" &&
                checkPermission({
                  permissions,
                  permission: [permission?.add],
                }) && (
                  <Button
                    startIcon={<RestoreIcon />}
                    className="bottom__navigation-restore"
                    sx={{ color: "#fff", fontSize: "20px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMethod("re-store");
                      setOpen(true);
                    }}
                  ></Button>
                )}
              {urlUtils?.archived !== "true" &&
                checkPermission({
                  permissions,
                  permission: [permission?.delete],
                }) && (
                  <DeleteOutlineIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setMethod("delete");
                      setOpen(true);
                    }}
                  />
                )}
              <ClearIcon
                sx={{ marginLeft: "20px", cursor: "pointer" }}
                onClick={() => {
                  setSelectedData([]);
                }}
              />
            </div>
            {/* <div
              className="archive__container"
              style={{ cursor: 'pointer' }}
              onClick={() => setOpen(true)}>
              <p>{urlUtils?.archived ? 'Restore' : 'Archive'}</p>
            </div>
            <ClearIcon
              sx={{ marginLeft: '20px', cursor: 'pointer' }}
              onClick={() => {
                setSelectedData?.([]);
              }}
            /> */}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default BottomNavigation;
