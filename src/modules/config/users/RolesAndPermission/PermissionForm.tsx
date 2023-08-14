import _ from "lodash";
import React, { useState } from "react";

import styled from "@emotion/styled";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Tooltip } from "@mui/material";
import FacebookCircularProgress from "src/components/CircularLoader";
import { IOSSwitch } from "src/components/switch/IosSwitch";
import { Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { getAPI } from "src/lib/axios";
import * as Yup from "yup";
import { lockFields } from "src/utils/url";

const getParams = (arr: string[]) => {
  let params = "";
  (arr || []).forEach((item: string) => {
    if (!params) {
      params += `tags=${item}`;
    } else {
      params += `&tags=${item}`;
    }
  });
  return params;
};

const Center = styled("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const checker = (arr = [], target = []) => {
  return target.every((v) => arr.includes(v));
};

const RoleChecker = ({
  title = "",
  label = "",
  permissions = [],
  permission = [],
  setFieldValue,
  disabled,
  module = "",
  modules,
  allCheckerUnchecker,
  method,
}: any) => {
  const checked = checker(permissions, permission);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <span
      style={{
        display: "flex",
        gap: "2px",
        alignItems: "center",
        flexWrap: "nowrap",
      }}
    >
      {" "}
      {isLoading ? (
        <FacebookCircularProgress />
      ) : (
        <input
          style={{ cursor: "pointer" }}
          type="checkbox"
          checked={checked}
          disabled={disabled ? disabled : !setFieldValue}
          title={title}
          className={disabled ? "disabled" : ""}
          onClick={async (e) => {
            console.log("method", method);

            if (["add", "edit", "view"].includes(method)) {
              try {
                e.stopPropagation();
                let result: string[] = [];

                let correspondingPermissions: string[] = [];

                if (modules) {
                  setIsLoading(true);
                  const { data, status }: any = await getAPI(
                    `user-role/getting_corresponding_permission?${getParams(modules)}`,
                    undefined,
                    undefined,
                    enqueueSnackbar,
                  );
                  // console.log('modules status', status);
                  if (status === 200 || (status > 200 && status < 3000)) {
                    setIsLoading(false);
                    correspondingPermissions = data || [];
                  } else {
                    // notify
                    setIsLoading(false);
                    enqueueSnackbar(`Error: ${status}`, {
                      variant: "error",
                    });
                  }
                } else {
                  setIsLoading(true);
                  // console.log('requested module', module);
                  const { data, status }: any = await getAPI(
                    `user-role/getting_corresponding_permission?tags=${module}`,
                    undefined,
                    undefined,
                    enqueueSnackbar,
                  );

                  if (status === 200 || (status > 200 && status < 3000)) {
                    setIsLoading(false);
                    correspondingPermissions = data || [];
                  } else {
                    setIsLoading(false);
                    enqueueSnackbar(`Error: ${status}`, {
                      variant: "error",
                    });
                  }
                }
                setIsLoading(false);

                if (!checked) {
                  result = [...permissions, ...permission, ...(correspondingPermissions || [])];
                } else {
                  result = permissions.filter(
                    (role: any) =>
                      ![...permission, ...(correspondingPermissions || [])]?.includes(role),
                  );
                }

                setFieldValue && setFieldValue("permission", result);
              } catch (error: any) {
                console.log("caught error", error);
                setIsLoading(false);
                enqueueSnackbar(
                  `Failed to fetch corresponding permission (${error?.response?.data?.detail?.message})`,
                  {
                    variant: "error",
                  },
                );
              }
            } else {
              // if (allCheckerUnchecker) {
              setFieldValue &&
                setFieldValue(
                  "permission",
                  checked
                    ? permissions.filter((role: any) => !permission?.includes(role))
                    : [...permissions, ...permission],
                );
              // }
            }
          }}
        />
      )}
      {label}
    </span>
  );
};

export const PermissionTable = () => {};

// entry = [[GeneralSettings][{Country:{},Location:{}}]]
export const PermissionAccordion = ({ entry, permissions, setFieldValue, disabled }: any) => {
  let codes: any = [];
  let moduleName: string = "";
  // let codesDetail = [];
  let methods = new Set();

  const title = entry[0]; // General Setting

  Object.entries(entry[1])?.map((entry: any) => {
    moduleName = entry[0];
    codes.push(entry[0]); // Location
    // codesDetail.push(entry[1]); // {add:'add_Location', delete:'delete_location', label:'Location'}
    Object.keys(entry[1])?.map((key) => {
      if (key !== "label") {
        methods.add(key);
      } else {
        return;
      }
    });
  });

  const [isActive, setIsActive] = useState(true);

  let accordionPermission: any = [];

  Object.values(entry[1])?.map((entry: any) => {
    // entry =  {add:'add_Location', delete:'delete_location', label:'Location'}
    let filterObject = { ...entry };
    delete filterObject.label;
    accordionPermission = [...accordionPermission, ...Object.values(filterObject)];
  });

  return (
    // <div style={{ marginBottom: '1rem' }}>
    // <Grid bgcolor={'#EAECF0'}>
    // <div className="role_table heading_table">
    <table>
      <thead>
        <tr>
          <th style={{ position: "relative" }}>
            <RoleChecker
              modules={codes}
              permission={accordionPermission}
              permissions={permissions}
              setFieldValue={setFieldValue}
              label={_.startCase(_.toLower(title))}
              disabled={disabled}
            />
            <FontAwesomeIcon
              icon={faChevronDown as IconProp}
              cursor={"pointer"}
              onClick={(pre) => setIsActive(!isActive)}
              style={{
                position: "absolute",
                right: "10px",
                top: "30%",
              }}
            />
          </th>
          {Array.from(methods)?.map((method: any) => {
            return (
              <>
                {method !== "label" && (
                  <th>
                    <Center>
                      <RoleChecker
                        method={method}
                        modules={codes}
                        permission={accordionPermission.filter((item: any) =>
                          item.includes(`${method}_`),
                        )}
                        permissions={permissions}
                        setFieldValue={setFieldValue}
                        disabled={disabled}
                        //     label={_.startCase(_.toLower(method))}
                      />
                    </Center>
                  </th>
                )}
              </>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {isActive && (
          <>
            {Object.entries(entry[1])?.map((entry: any) => {
              let buildPermission: any = [];
              // console.log('model', entry[0]);
              let filterObject = { ...entry[1] };
              delete filterObject.label;
              buildPermission = [...buildPermission, ...Object.values(filterObject)];

              return (
                <>
                  <tr>
                    <th
                      style={{
                        position: "relative",
                      }}
                    >
                      <div>
                        <RoleChecker
                          module={entry[0]}
                          permission={buildPermission}
                          permissions={permissions}
                          setFieldValue={setFieldValue}
                          label={entry[1].label || ""}
                          disabled={disabled}
                        />
                      </div>
                      <Tooltip
                        title={`Manage ${_.startCase(_.toLower(entry[0]))}`}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "30%",
                        }}
                      >
                        <FontAwesomeIcon icon={faCircleInfo as IconProp} cursor={"pointer"} />
                      </Tooltip>
                    </th>
                    {Array.from(methods)?.map((method) => {
                      const permission = `${method}_${entry[0]}`;
                      return (
                        <>
                          {Object.entries(entry[1])?.map(
                            (list) =>
                              list[0] === method &&
                              list[0] !== "label" && (
                                <td>
                                  <Center>
                                    <RoleChecker
                                      method={method}
                                      module={entry[0]}
                                      title={permission}
                                      permission={[permission]}
                                      permissions={permissions}
                                      setFieldValue={setFieldValue}
                                      disabled={disabled}
                                    />
                                  </Center>
                                </td>
                              ),
                          )}
                        </>
                      );
                    })}
                  </tr>
                </>
              );
            })}
          </>
        )}
      </tbody>
    </table>
    // {/* </div> */}
    // </Grid>
    // </div>
  );
};

const PermissionForm = ({
  isSubmitting,
  formData,
  onCreate,
  onEdit,
  onBack,
  permissions = [],
  permissionsModels = [],
  disabled,
}: any) => {
  // const [roleName, setRoleName] = useState<any>(null)
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSuccessMessage, setSnackSuccessMessage] = useState<string>("");
  let params = useParams();
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };
  const result: any = {};

  const [isActive, setIsActive] = useState(true);

  permissions.forEach((obj: any) => {
    const { module_id, method, code } = obj;
    if (!result[module_id]) {
      result[module_id] = {};
    }
    result[module_id][method] = code;
  });

  const initialValues = {
    permission: formData.permissions?.map((item: any) => {
      return item.code;
    }),
    name: formData.name,
    status: formData.status,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Role is required"),
  });

  let permissionMap: any = {};

  permissions &&
    permissions?.map((item: any) => {
      permissionMap[item.code] = item.id;
    });

  var dynamic_permission_obj: any = {};
  let allRoles: Array<any> = [];

  permissions?.map((list: any) => {
    const app = list.app_id;
    const code = list.code;
    const method = list.method;
    const permission = list.name;
    const model = list.module_id;

    allRoles = [...allRoles, permission];

    dynamic_permission_obj = {
      ...dynamic_permission_obj,
      [`${app}`]: {
        ...(dynamic_permission_obj?.[`${app}`] || {}),
        [`${model}`]: {
          ...(dynamic_permission_obj?.[`${app}`]?.[`${model}`] || {}),
          [`${method}`]: code,
          label: list?.label,
        },
      },
    };
  });
  let accordionPermissions: any = [];

  Object.values(dynamic_permission_obj)?.length &&
    Object.values(dynamic_permission_obj)?.map((entry: any) => {
      Object.values(entry || [])?.map((entrys: any) => {
        let filterObject = { ...entrys };
        delete filterObject.label;

        accordionPermissions = [...accordionPermissions, ...Object.values(filterObject)];
      });
    });

  // console.log({ dynamic_permission_obj });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(props, otherProps) => {
        let { permission, ...values } = props;
        const permissions = permission
          ?.map((item: any) => permissionMap[item])
          ?.filter((per: any) => Boolean(per));

        let put_datas = {
          name: values.name,
          status: values.status,
          permissions: permissions,
        };

        onEdit(put_datas);

        // putAPI
        // putAPI(
        //   `user-role/${params.roleID}`, put_datas
        // ).then(response => {
        //   setSnackSuccessMessage(response.data.message)

        // }).catch(err => {

        // })

        // putAPI()

        //   formData
        //     ? onEdit(
        //         {
        //           ...values,
        //           permissions: permission?.map(
        //             (item: any) => permissionMap[item]
        //           ),
        //         },
        //         otherProps
        //       )
        //     : onCreate(
        //         {
        //           ...values,
        //           permissions: permission?.map(
        //             (item: any) => permissionMap[item]
        //           ),
        //         },
        //         otherProps
        //       );
      }}
    >
      {(props: any) => {
        const {
          values,
          errors,
          handleChange,
          resetForm,
          setFieldValue,
          isValid,
          dirty,
          handleBlur,
          touched,
        } = props;
        return (
          <Form>
            {/* <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={snackOpen}
              autoHideDuration={3000}
              onClose={handleClose}>
              <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                {snackSuccessMessage}
              </Alert>
            </Snackbar> */}
            {/* <FacebookCircularProgress /> */}

            <Grid
              container
              className="formGroupItem"
              alignItems={"center"}
              margin={"0"}
              padding={"10px"}
            >
              <Grid
                container
                xs={6}
                gap={2}
                className="formGroupItem"
                alignItems={"center"}
                padding={"0 !important"}
                margin={"0 !important"}
              >
                <Grid item xs={4} alignItems={"center"}>
                  <InputLabel htmlFor="status">
                    <div className="label-heading  align__label">User Role</div>
                  </InputLabel>
                </Grid>
                <Grid item xs={4}>
                  <OutlinedInput
                    id="name"
                    type="text"
                    placeholder="User Role"
                    size="small"
                    fullWidth
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    error={Boolean(touched.name && errors.name)}
                    disabled={lockFields.includes(values.name) ? true || disabled : disabled}
                    className={disabled ? "disabled" : ""}
                  />
                  {Boolean(touched.name && errors.name) && (
                    <FormHelperText error>{errors.name}</FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container xs={6} alignItems={"center"}>
                <Grid item xs={4}>
                  <InputLabel htmlFor="status">
                    <div className="label-heading  align__label">Status</div>
                  </InputLabel>
                </Grid>

                <Grid item xs={6}>
                  <IOSSwitch
                    value={values.status}
                    id="status"
                    name="status"
                    checked={values?.status === "Active" ? true : false}
                    onChange={(e: any) => {
                      const dat = e.target.checked ? "Active" : "Inactive";
                      setFieldValue("status", dat);
                    }}
                    disabled={lockFields.includes(values.name) ? true || disabled : disabled}
                    disableText
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid border={"1px solid #F2F4F7"} borderRadius={"8px"}>
              <Grid item xs={12} className="custom_scrollbar">
                <div className="role_table heading_table">
                  {" "}
                  <table>
                    <thead
                      style={{ background: "white", zIndex: "100", position: "sticky", top: "0" }}
                    >
                      <tr>
                        <th
                          style={{
                            position: "relative",
                          }}
                        >
                          <RoleChecker
                            permission={accordionPermissions}
                            permissions={values.permission}
                            setFieldValue={setFieldValue}
                            label={"Modules"}
                            allCheckerUnchecker
                            disabled={disabled}
                          />
                          {/* <input
                            style={{ cursor: 'pointer' }}
                            type="checkbox"
                            checked={true}
                            className={disabled ? 'disabled' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />{' '}
                          Modules */}
                        </th>

                        <th>Create</th>
                        <th>Read</th>
                        <th>Delete</th>
                        <th>Edit</th>
                        <th>Export</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(dynamic_permission_obj)?.map((entry: any, index: number) => {
                        return (
                          <>
                            <tr key={index}>
                              <td colSpan={6} className="individual__table">
                                <PermissionAccordion
                                  entry={entry}
                                  permissions={values.permission}
                                  setFieldValue={setFieldValue}
                                  disabled={disabled}
                                />
                              </td>
                            </tr>
                            {Object.entries(dynamic_permission_obj)?.length - 1 !== index && (
                              <tr className="empty__tr"></tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Grid>
              <Grid container>
                {/* <Grid item xs={12}>
                <RoleChecker
                  permission={allRoles}
                  permissions={values.permission}
                  setFieldValue={setFieldValue}
                  label={"All Permissions"}
                />
              </Grid> */}

                {/* <Grid item xs={12}>
                  {Object.entries(dynamic_permission_obj)?.map((entry) => {
                    return (
                      <PermissionAccordion
                        entry={entry}
                        permissions={values.permission}
                        setFieldValue={setFieldValue}
                        disabled={disabled}
                      />
                    );
                  })}
                </Grid> */}
              </Grid>
            </Grid>

            <Grid item xs={12} marginTop="1rem">
              <div
                className="clear mt-3"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="outlined"
                  type="submit"
                  onClick={() => {
                    onBack();
                    resetForm();
                  }}
                >
                  Cancel
                </Button>

                {!disabled && (
                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Save & Proceed"}
                  </Button>
                )}
              </div>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PermissionForm;
