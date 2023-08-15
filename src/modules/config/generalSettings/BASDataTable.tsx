import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import InfoIcon from "@mui/icons-material/Info";
import { AppBar, Button, Chip, Grid, OutlinedInput, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import AddModal from "src/components/AddModal/AddModal";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import NoDataFound from "src/components/NoDataFound";
import { useAlertPopup } from "src/store/zustand/globalStates/alertPopup";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import { BASConfigTableProps, RegionProps } from "src/interfaces/configs";
import moment from "moment";
import { useSnackbar } from "notistack";
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deleteAPI, getAPI } from "src/lib/axios";
import { checkPermission } from "src/utils/permission";
import AddUserRole from "../users/RolesAndPermission/AddUserRole";
import { ConfigTableUrlUtils } from "./OrganizationConfiguration";
import TableColumns from "./TableColumns";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function isValidDate(d: string) {
  return moment(d).isValid();
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export interface HeadCell {
  id: string;
  label: string;
  action?: boolean;
  show: boolean;
  index: number;
}

export const letterHandler = (configName: string) => {
  let words = "";
  for (let i = 0; i < configName.length; i++) {
    if (configName.includes("-")) {
      let splitedWords = configName.split("-");
      for (let i = 0; i < splitedWords.length; i++) {
        splitedWords[i] = splitedWords[i].charAt(0).toUpperCase() + splitedWords[i].slice(1) + " ";
        words = splitedWords.join("");
      }
    } else {
      words = configName.charAt(0).toUpperCase() + configName.slice(1);
    }
  }
  return words;
};

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } =
    props;
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            checkedIcon={<img src="src/assets/icons/icon-check.svg" alt="check" />}
            icon={<img src="src/assets/icons/icon-uncheck.svg" alt="uncheck" />}
            indeterminateIcon={
              <img src="src/assets/icons/icon-check-remove.svg" alt="indeterminate" />
            }
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => {
          return (
            <React.Fragment key={headCell.id}>
              {!headCell?.action && headCell.show && (
                <TableCell
                  key={headCell.id}
                  //   align={headCell.numeric ? "right" : "left"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                    IconComponent={() => <img src="src/assets/icons/arrow-up.svg" alt="sort" />}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc" ? "sorted descending" : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              )}
              {headCell.action && headCell.show && (
                <TableCell key={headCell.id}>{headCell.label}</TableCell>
              )}
            </React.Fragment>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  configName: string;
  count: number;
  onDataChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditTable: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  archivedCount: number | undefined | null;
  searchValue: string | undefined;
  clearSelected: Function;
  setIsSuccess?: Function;
  permissions?: Array<string>;
  permission?: any;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const igonreDownloadButtons = ["notifications"];
  const {
    numSelected,
    onDataChange,
    handleEditTable,
    configName,
    count,
    archivedCount,
    searchValue,
    clearSelected,
    setIsSuccess,
    permissions = [],
    permission,
  } = props;

  // getting the alert popup from global state
  const { openModalBox, setOpenModalBox } = useAlertPopup();

  const [param, setparam] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  //Add Modal
  const [openAddModal, setOpenAddModal] = React.useState(false);

  React.useEffect(() => {
    // it needs to be resetted on tab change
    if (location?.pathname) {
      clearSelected();
    }
    if (location.pathname.includes("region")) {
      setparam("region");
      return;
    } else if (location.pathname.includes("country")) {
      setparam("country");
      return;
    } else if (location.pathname.includes("location")) {
      setparam("location");
      return;
    } else if (location.pathname.includes("territory")) {
      setparam("territory");
      return;
    }
  }, [location.pathname]);

  let returnedParams = location.pathname.split("/").slice(-1)?.join("");

  const handleDownload = async () => {
    const { status, data } = await getAPI(`${returnedParams}/export-csv`);

    if (status === 200) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${param}.csv`);
      document.body.appendChild(link);
      link.click();
    } else {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  return (
    <Toolbar className="toolbar-table">
      <AddModal
        openModal={openAddModal}
        setOpenModal={() => setOpenAddModal(!openAddModal)}
        confirmationHeading={"a New User Role"}
        confirmationDesc="Fill in the details to add the new user."
      >
        <AddUserRole setOpenAddModal={setOpenAddModal} setIsSuccess={setIsSuccess} />
      </AddModal>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div className="left-block">
          <Typography variant="h5" component="h3">
            All {letterHandler(configName)} <Chip label={`${count} Total`} />
          </Typography>
          <Typography variant="body1" component="p">
            {archivedCount ?? "0"} Archived
          </Typography>
        </div>
        <div className="right-block">
          <Grid container spacing={2}>
            {!igonreDownloadButtons.some((el) => location?.pathname.includes(el)) && (
              <>
                {checkPermission({
                  permissions,
                  permission: [permission?.export],
                }) ? (
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleDownload}
                      startIcon={<img src="src/assets/icons/download.svg" alt="download" />}
                    >
                      Download CSV
                    </Button>
                  </Grid>
                ) : null}{" "}
              </>
            )}
            {checkPermission({
              permissions,
              permission: [permission?.add],
            }) ? (
              <Grid item>
                {location.pathname === "/config/notifications" ? (
                  <Button
                    onClick={() => setOpenModalBox(true)}
                    variant="contained"
                    startIcon={<img src="src/assets/icons/plus-white.svg" alt="plus" />}
                  >
                    Add {configName}
                  </Button>
                ) : location.pathname === "/config/users/roles-and-permission" ? (
                  <>
                    <Button
                      onClick={() => setOpenAddModal(true)}
                      variant="contained"
                      startIcon={<img src="src/assets/icons/plus-white.svg" alt="plus" />}
                    >
                      Add {configName}
                    </Button>
                  </>
                ) : (
                  <Link to={`${location?.pathname}/add`}>
                    <Button
                      variant="contained"
                      startIcon={<img src="src/assets/icons/plus-white.svg" alt="plus" />}
                    >
                      Add{" "}
                      {location.pathname === "/config/notifications"
                        ? "Alert"
                        : letterHandler(configName)}
                    </Button>
                  </Link>
                )}
              </Grid>
            ) : null}
          </Grid>
        </div>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div className="left-block">{/* 1-4 of 12 regions */}</div>
        <div className="right-block">
          <Grid container spacing={2}>
            <Grid item>
              <form className="search-form">
                <OutlinedInput
                  placeholder={`Search for ${configName?.replaceAll("-", " ")}`}
                  startAdornment={<img src="src/assets/icons/search.svg" alt="search" />}
                  value={searchValue}
                  fullWidth
                  sx={{
                    minWidth: 400,
                  }}
                  onChange={onDataChange}
                />
              </form>
              {/* <SearchInput
                placeholder={`Search for ${configName}`}
                startAdornment={<img src="src/assets/icons/search.svg" alt="search" />}
                fullWidth
                sx={{
                  minWidth: 400,
                }}
                onChange={onDataChange}
                debounceDelay={500}
              /> */}
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleEditTable}
                startIcon={<img src="src/assets/icons/edit.svg" alt="edit" />}
              >
                Customize Table
              </Button>
            </Grid>
          </Grid>
        </div>
      </Stack>
    </Toolbar>
  );
}

// hide default table headers
const defaultDisable = ["created_at", "created_by", "updated_at", "updated_by"];

const transformHeaderCells = (headcells: { [key: string]: any }): HeadCell[] => {
  const tempArr: HeadCell[] = [];
  let index = 0;
  for (const key in headcells) {
    if (Object.prototype.hasOwnProperty.call(headcells, key)) {
      const element = headcells[key];
      if (key !== "id") {
        tempArr.push({
          id: key,
          index: index,
          label: element,
          show: defaultDisable?.some((el) => el === key) ? false : true,
        });
        index++;
      }
    }
  }
  return [
    ...tempArr,
    {
      id: "action",
      index: tempArr.length,
      label: "Actions",
      action: true,
      show: true,
    },
  ];
};

function hasHtmlTags(str: string) {
  const htmlRegex = /<\/?[a-z][\s\S]*>/i; // Regular expression to match against any HTML tags
  return htmlRegex.test(str); // Returns true if HTML tags are present in the string, false otherwise
}

// geting value
function GetValue({
  row,
  columnName,
  showNumber = 2,
  showText = false,
  popUpDisplay = false,
  onTitleNavigate,
  title,
}: any) {
  const value = row[columnName];
  const navigate = useNavigate();

  const [showAll, setShowAll] = React.useState(false);
  // Use state to keep track of whether the button has been clicked
  function handleShowAll() {
    setShowAll(true);
  }

  if (Array.isArray(value)) {
    // Determine which items to display based on whether the button has been clicked
    const displayedValue = showAll ? value : value.slice(0, showNumber);

    return (
      <div>
        {displayedValue.map((item) => (
          <div key={item.id}>{item}</div>
        ))}
        {/* Show the "Show More" button if there are more than 1 items */}
        {value?.length > showNumber && (
          <Typography
            variant="subtitle1"
            sx={{
              textDecoration: "underline",
              fontSize: "small",
              cursor: "pointer",
            }}
            component="div"
            onClick={(e) => {
              e.stopPropagation();
              handleShowAll();
            }}
          >
            Show More
          </Typography>
        )}
      </div>
    );
  }

  // Return the value as is if it's not an array
  return (
    <div
      onClick={(e) => {
        if (onTitleNavigate?.navigateColumnName == columnName) {
          e.stopPropagation();
          onTitleNavigate?.navigateTo?.(row?.id, value);
        }
      }}
      className={onTitleNavigate?.navigateColumnName == columnName ? "hover__effect-underline" : ""}
    >
      {hasHtmlTags(value)
        ? (() => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(value, "text/html");

            const plainTextContent: any = doc.body.textContent;

            return plainTextContent?.toString()?.length >= 80
              ? plainTextContent?.toString()?.slice(0, 80) + "..."
              : plainTextContent;
          })()
        : value?.length >= 80
        ? value?.toString().slice(0, 80) + "..."
        : value}
    </div>
  );
}

const BASDataTable: React.FC<{
  data: BASConfigTableProps;
  configName: string;
  deletePath: string;
  count: number;
  urlUtils?: ConfigTableUrlUtils;
  keyName?: string;
  onDataChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit?: Function;
  setIsSuccess?: (isSuccess: boolean) => void;
  permissions?: Array<string>;
  permission?: any;
}> = ({
  data,
  onDataChange,
  configName,
  count,
  deletePath,
  urlUtils,
  keyName,
  onEdit,
  setIsSuccess,
  permissions = [],
  permission,
}) => {
  const { deleteRegions } = useConfigStore();
  const location = useLocation();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [selectedId, setSelectedId] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<RegionProps[]>(data.items);
  const [isHeaderCellEdit, setIsHeaderCellEdit] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [key, setKey] = React.useState<number>(new Date().getTime());
  const { enqueueSnackbar } = useSnackbar();
  const [currentRegion, setCurrentRegion] = React.useState<RegionProps>({
    code: "",
    id: 1,
    name: "",
    status: "Active",
    notes: "",
    notification_email: [],
  });
  const [headCells, setHeadCells] = React.useState<HeadCell[]>(transformHeaderCells(data.headers));

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleDeleteRegion = (id: number) => {
    const region = data?.items?.find((rg) => Number(rg?.id) === Number(id));
    region && setCurrentRegion(region);
    setOpenModal(true);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }

    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string, id: any) => {
    const target = event.target as HTMLElement;

    if (target?.tagName?.includes("IMG") || target?.tagName?.includes("A")) return;

    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleTableCellVisibility = (id: string): string => {
    return headCells.some((hc) => hc.id == id && hc.show) ? "cell-visible" : "cell-hidden";
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const deleteRegion = async () => {
    setDeleteLoading(true);
    try {
      await deleteAPI(
        `${deletePath}/`,
        deletePath === "user-department"
          ? { config_ids: [currentRegion.id] }
          : { config_ids: [currentRegion.id] },
      );
      setOpenModal(!openModal);
      enqueueSnackbar(
        `${
          deletePath[0].toUpperCase() + deletePath.slice(1).replaceAll("-", " ")
        } deleted successfully`,
        {
          variant: "success",
        },
      );
      currentRegion.id && deleteRegions(currentRegion.id);
      setDeleteLoading(false);
      setRows(rows.filter((rg) => rg.id !== currentRegion.id));
    } catch (error: any) {
      enqueueSnackbar(
        error.message || `Unable to delete ${deletePath[0].toUpperCase() + deletePath.slice(1)}`,
        { variant: "error" },
      );
    }
  };

  const handleEditTable = (ev: React.MouseEvent<HTMLButtonElement>) => {
    setIsHeaderCellEdit(!isHeaderCellEdit);
  };

  const onUpdate = (headCells: HeadCell[]) => {
    setHeadCells(headCells);
    setIsHeaderCellEdit(false);
    setKey(new Date().getTime());
  };

  React.useEffect(() => {
    setRows(data.items);
    setHeadCells(transformHeaderCells(data.headers));
  }, [data.items]);

  const deleteSelectedRows = async () => {
    const { status } = await deleteAPI(`${deletePath}/`, {
      config_ids: selectedId,
    });

    if (status === 200) {
      enqueueSnackbar("Selected rows deleted successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  function clearSelected() {
    setSelected([]);
    setSelectedId([]);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <ConfirmationModal
          openModal={openModal}
          setOpenModal={() => setOpenModal(!openModal)}
          handelConfirmation={() => {
            deleteRegion();
            setOpenModal(false);
          }}
          confirmationHeading={`Do you want to delete ${
            location?.pathname === "/config/users/user"
              ? currentRegion?.full_name
              : currentRegion?.name
              ? currentRegion?.name
              : currentRegion?.[`${keyName as keyof RegionProps}`]
          } `}
          confirmationDesc={`This ${deletePath.replaceAll("-", " ")}  will be deleted.`}
          status="warning"
          confirmationIcon="src/assets/icons/icon-feature.svg"
          loader={deleteLoading}
        />
        <ConfirmationModal
          openModal={openDeleteModal}
          setOpenModal={() => {
            setOpenDeleteModal(!openDeleteModal);
            setSelectedId([]);
          }}
          handelConfirmation={() => {
            deleteSelectedRows();
            setOpenDeleteModal(false);
          }}
          confirmationHeading={`Do you want to delete these ${deletePath} ?`}
          confirmationDesc={`${selected.map((name) => name)}  will be deleted.`}
          status="warning"
          confirmationIcon="src/assets/icons/icon-feature.svg"
        />

        <TableColumns
          headCells={headCells}
          onHide={handleEditTable as any}
          modelOpen={isHeaderCellEdit}
          onUpdate={onUpdate}
        />
        <Paper sx={{ width: "100%", mb: 2 }} className="config-table-holder">
          <EnhancedTableToolbar
            count={count}
            configName={configName}
            numSelected={selected.length}
            onDataChange={onDataChange}
            handleEditTable={handleEditTable}
            archivedCount={data.archivedCount}
            searchValue={urlUtils?.q}
            clearSelected={clearSelected}
            setIsSuccess={setIsSuccess}
            permissions={permissions}
            permission={permission}
          />

          <TableContainer>
            {rows?.length > 0 && (
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
                key={key}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                  headCells={headCells}
                />
                <TableBody>
                  {stableSort(rows as any, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, index: number) => {
                      const isItemSelected = isSelected(row.name as string);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          onClick={(event) => {
                            handleClick(event, row.name as string, row.id);
                            setSelectedId((id: any) => [...selectedId, row.id]);
                          }}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          {/* checkbox */}
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checkedIcon={
                                <img src="src/assets/icons/icon-check.svg" alt="check" />
                              }
                              icon={<img src="src/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>

                          {[...headCells]?.map((hc, index) => {
                            if (hc.action) return;
                            if (hc.id === "created_at" || hc.id === "updated_at")
                              return (
                                <TableCell key={index} className={handleTableCellVisibility(hc.id)}>
                                  {moment(new Date(row[hc.id])).format("MMM Do YY")}
                                </TableCell>
                              );
                            if (hc.id === "status")
                              return (
                                <TableCell className={handleTableCellVisibility(hc.id)}>
                                  <Chip
                                    style={{
                                      backgroundColor:
                                        row[hc.id] === "Active" ? "#027A48;" : "#E5E5E5",
                                    }}
                                    color={row[hc.id] === "Active" ? "success" : "default"}
                                    icon={<FiberManualRecordIcon style={{ fontSize: "10px" }} />}
                                    label={row[hc.id] === "Active" ? "Active" : "Inactive"}
                                  />
                                </TableCell>
                              );
                            return (
                              <TableCell className={handleTableCellVisibility(hc.id)}>
                                {/* {row[hc.id]} */}
                                <GetValue row={row} columnName={hc?.id} title={hc?.label} />
                              </TableCell>
                            );
                          })}

                          <TableCell className={handleTableCellVisibility("action")}>
                            <div className="actions-btns-holder">
                              {checkPermission({
                                permissions,
                                permission: [permission?.delete],
                              }) ? (
                                <Button
                                  onClick={() => handleDeleteRegion(row.id)}
                                  startIcon={
                                    <img src="src/assets/icons/icon-trash.svg" alt="delete" />
                                  }
                                />
                              ) : null}
                              {/* ------------------ temporary editing ------------  */}
                              {/* ------------------ will be removed soon ----------- */}
                              {checkPermission({
                                permissions,
                                permission: [permission?.edit],
                              }) ? (
                                <>
                                  {location.pathname === "/config/users/user" ? (
                                    <Link to={`profile/${row.id}/settings`}>
                                      <Button
                                        startIcon={
                                          <img src="src/assets/icons/icon-edit.svg" alt="edit" />
                                        }
                                      />
                                    </Link>
                                  ) : (
                                    <Link
                                      to={onEdit ? "#" : `edit/${row.id}`}
                                      onClick={() => {
                                        onEdit && onEdit?.(row?.id);
                                      }}
                                    >
                                      <Button
                                        startIcon={
                                          <img src="src/assets/icons/icon-edit.svg" alt="edit" />
                                        }
                                      />
                                    </Link>
                                  )}
                                </>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* no data found */}
            {rows?.length === 0 && (
              <Box sx={{ pb: 4, width: "100%" }}>
                <NoDataFound
                  link={`${location.pathname}/add`}
                  title={`${letterHandler(deletePath)}`}
                />
              </Box>
            )}
          </TableContainer>
          <TablePagination
            className="table-pagination"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        {selected.length > 0 && (
          <AppBar
            position="sticky"
            color="primary"
            enableColorOnDark
            style={{ top: "auto", bottom: 0, borderRadius: "15px" }}
          >
            <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="left_items" style={{ display: "flex" }}>
                <InfoIcon />
                <div
                  className="no_of_selected_text"
                  style={{
                    fontWeight: "500",
                    fontSize: "16px",
                    marginLeft: "15px",
                  }}
                >
                  {selected.length} {configName} Selected
                </div>
              </div>
              <div className="right_items">
                <DeleteOutlineIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setOpenDeleteModal(true);
                  }}
                />
                <ClearIcon
                  sx={{ marginLeft: "20px", cursor: "pointer" }}
                  onClick={() => {
                    setSelected([]);
                  }}
                />
              </div>
            </Toolbar>
          </AppBar>
        )}
      </Box>
    </Box>
  );
};

export default BASDataTable;
