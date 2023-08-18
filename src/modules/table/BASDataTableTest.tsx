import * as React from "react";
import Box from "@mui/material/Box";
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
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { AppBar, Badge, Button, Chip, Grid, OutlinedInput, Stack } from "@mui/material";
import { BASConfigTableProps, RegionProps } from "src/src/interfaces/configs";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { deleteAPI, getAPI } from "src/lib/axios";
import { useConfigStore } from "src/store/zustand/globalStates/config";
import { Link } from "react-router-dom";
import TableColumns from "./TableColumns";
import moment from "moment";
import { useSnackbar } from "notistack";
import InfoIcon from "@mui/icons-material/Info";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PopUpCustom from "./PopUp";
import "./table.scss";
import { IndividualListDisplay } from "./PopUp";
import KebabIcon from "src/assets/icons/Kebab.png";
import { RadioOptions } from "src/modules/config/findingAndRecommendations/findingsAndRecommendationsForm/FindingsUtils";
import { GetShorterText } from "src/components/GetShortText";
import { checkPermission } from "src/utils/permission";

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
  const stabilizedThis = array?.map((el, index) => [el, index] as [T, number]);
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
            checkedIcon={<img src="/src/assets/icons/icon-check.svg" alt="check" />}
            icon={<img src="/src/assets/icons/icon-uncheck.svg" alt="uncheck" />}
            indeterminateIcon={
              <img src="/src/assets/icons/icon-check-remove.svg" alt="indeterminate" />
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
                    IconComponent={() => <img src="/src/assets/icons/arrow-up.svg" alt="sort" />}
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
                <TableCell key={headCell.id} sx={{ textAlign: "end" }}>
                  <div
                    style={{
                      position: "relative",
                      left: "-15px",
                    }}
                  >
                    {headCell.label}
                  </div>
                </TableCell>
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
  backendUrl: string;
  count: number;
  additionalEdit?: string;
  onDataChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditTable: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  archivedCount: number | undefined | null;
  tableTitle?: string;
  tableIndicator?: tableIndicatorProps;
  textTitleLength?: number;
  csvDownload?: boolean;
  permissions?: any;
  permission?: any;
}

// these are used to show name, set the backend url for csv download, help in setting the
// frontend route to click. Field nam
export interface tableIndicatorProps {
  buttonName?: String;
  backendUrl?: String;
  frontEndUrl?: String;
  sectionTitle?: String;
  editFrontEndUrlGetter?: Function | null;
  deleteFieldName?: string;
  subSectionUrl?: Function | null;
  popUpField?: {
    key: string;
    label: string;
  };
}

function AddButton({
  tableIndicator,
  letterHandler,
  configName,
  location,
  permissions,
  permission,
}: any) {
  return (
    <Link
      to={`${
        tableIndicator?.frontEndUrl ? tableIndicator?.frontEndUrl : `${location?.pathname}/add`
      }`}
    >
      {checkPermission({ permissions, permission: [permission?.add] }) && (
        <Button
          variant="contained"
          startIcon={<img src="/src/assets/icons/plus-white.svg" alt="plus" />}
        >
          Add{" "}
          {letterHandler({
            title: tableIndicator?.buttonName ? tableIndicator?.buttonName : configName,
          })}
        </Button>
      )}
    </Link>
  );
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    onDataChange,
    handleEditTable,
    configName,
    count,
    archivedCount,
    backendUrl,
    additionalEdit,
    tableTitle,
    tableIndicator,
    textTitleLength,
    permissions,
    permission,
    csvDownload = true,
  } = props;

  const [param, setparam] = React.useState("");

  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  // csv download
  const handleDownload = async () => {
    const { status, data } = await getAPI(`${backendUrl}/export-csv`);

    if (status === 200) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      let fileName = configName?.toString().split("/").slice(-1)?.join("") || "";
      link.setAttribute("download", `${fileName || "untitled"}.csv`);
      document.body.appendChild(link);
      link.click();
    } else {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const letterHandler = ({ title }: any) => {
    let words = "";
    let tableHead = title;
    for (let i = 0; i < tableHead?.length; i++) {
      if (tableHead?.includes("-")) {
        let splitedWords = tableHead?.split("-");
        for (let i = 0; i < splitedWords.length; i++) {
          splitedWords[i] =
            splitedWords[i].charAt(0).toUpperCase() + splitedWords[i].slice(1) + " ";
          words = splitedWords.join("");
        }
      } else {
        words = tableHead?.charAt(0).toUpperCase() + tableHead?.slice(1);
      }
    }
    return `${title ? "" : "All "} ${words}`;
  };

  return (
    <>
      <Toolbar className="toolbar-table">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div className="left-block">
            <Typography variant="h5" component="h3">
              {GetShorterText({
                value: letterHandler({ title: tableTitle ? tableTitle : configName }),
                length: textTitleLength,
              })}
              <Chip label={`${count} Total`} />
            </Typography>
            <Typography variant="body1" component="p">
              {archivedCount ?? "0"} Archived
            </Typography>
          </div>
          <div className="right-block">
            <Grid container spacing={2}>
              <Grid item>
                {!!csvDownload && (
                  <Button
                    variant="outlined"
                    onClick={handleDownload}
                    startIcon={<img src="/src/assets/icons/download.svg" alt="download" />}
                  >
                    Download CSV
                  </Button>
                )}
              </Grid>
              <Grid item>
                <AddButton
                  tableIndicator={tableIndicator}
                  letterHandler={letterHandler}
                  configName={configName}
                  location={location}
                  permissions={permissions}
                  permission={permission}
                />
                {/* <Link
                to={`${
                  tableIndicator?.frontEndUrl
                    ? tableIndicator?.frontEndUrl
                    : `${location?.pathname}/add`
                }`}>
                <Button
                  variant="contained"
                  startIcon={<img src="/src/assets/icons/plus-white.svg" alt="plus" />}>
                  Add {letterHandler({ title: configName })}
                </Button>
              </Link> */}
              </Grid>
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
                    placeholder={`Search for ${configName}`}
                    startAdornment={<img src="/src/assets/icons/search.svg" alt="search" />}
                    fullWidth
                    sx={{
                      minWidth: 400,
                    }}
                    onChange={onDataChange}
                  />
                </form>
                {/* <SearchInput
                placeholder={`Search for ${configName}`}
                startAdornment={<img src="/src/assets/icons/search.svg" alt="search" />}
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
                  startIcon={<img src="/src/assets/icons/edit.svg" alt="edit" />}
                >
                  Customize Table
                </Button>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Toolbar>
    </>
  );
}

const transformHeaderCells = (
  headcells: { [key: string]: any },
  defaultDisable: Array<string>,
): HeadCell[] => {
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

// creating a popup

// getting value component
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

  if (columnName === "attachments") {
    return <></>;
  }

  if (Array.isArray(value)) {
    // Determine which items to display based on whether the button has been clicked
    const displayedValue = showAll ? value : value.slice(0, showNumber);

    return (
      <ol>
        {displayedValue?.map((item: any, index: number) => {
          if (item instanceof Object) {
            const MAX_CHARACTERS = 100;
            const isTruncated = item?.description?.length > MAX_CHARACTERS;
            return (
              <IndividualListDisplay
                key={item?.id}
                navigate={navigate}
                id={item?.id}
                individualData={item}
                domain={title}
              >
                <p>
                  {item?.description?.toString()?.length >= MAX_CHARACTERS
                    ? item?.description.toString().slice(0, MAX_CHARACTERS) + "..."
                    : item?.description}
                </p>
              </IndividualListDisplay>
            );
          } else {
            return (
              <div key={item}>
                {/* Display each item in the array */}
                {item}
              </div>
            );
          }
        })}
        {/* Show the "Show More" button if there are more than 1 items */}
        {!popUpDisplay ? (
          value?.length > showNumber && (
            <Typography
              variant="subtitle1"
              sx={{ fontSize: "small", cursor: "pointer" }}
              component="div"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle the showAll state when the button is clicked
                setShowAll(!showAll);
              }}
            >
              {showText
                ? showAll
                  ? "Show Less"
                  : `Show ${value?.length - showNumber} more`
                : showAll
                ? "Show less"
                : "..."}
            </Typography>
          )
        ) : (
          <></>
        )}
      </ol>
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
      {columnName?.toLowerCase() === "risk_factor" ? (
        <div
          style={{
            display: "inline-block",
            background: RadioOptions?.[`${value}`]?.backgroundColor,
            padding: "8px 12px",
            paddingLeft: "30px",
            borderRadius: "20px",
            position: "relative",
            color: RadioOptions?.[`${value}`]?.textColor,
          }}
          className="badge__creator"
        >
          <span style={{ background: RadioOptions?.[`${value}`]?.dotColor }}></span>
          {value}
        </div>
      ) : columnName?.toLowerCase() === "website" ? (
        <a href={value} target="_blank">
          {value}
        </a>
      ) : (
        value
      )}
    </div>
  );
}

const BASDataTable: React.FC<{
  data: BASConfigTableProps;
  configName: string;
  deletePath: string;
  count: number;
  backendUrl: string;
  additionalEdit?: string;
  onDataChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete?: (id: object[]) => void;
  setterFunction?: Function;
  popUpDisplay?: Boolean;
  staticHeader?: any;
  onTitleNavigate?: any;
  tableTitle?: string;
  tableIndicator?: tableIndicatorProps;
  textTitleLength?: number;
  keyName?: string;
  csvDownload?: boolean;
  defaultDisable: Array<string>;
  permissions: Array<string>;
  permission?: any;
}> = ({
  data,
  onDataChange,
  configName,
  count,
  deletePath,
  backendUrl,
  onDelete,
  additionalEdit,
  setterFunction,
  popUpDisplay = false,
  staticHeader = {},
  onTitleNavigate,
  tableTitle,
  tableIndicator,
  textTitleLength,
  keyName = "name",
  csvDownload = true,
  defaultDisable = [],
  permissions = [],
  permission,
}) => {
  const { deleteRegions } = useConfigStore();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("");
  //  ------ Selected Row For Multiple Delete Start --------
  const [selected, setSelected] = React.useState<readonly object[]>([]);
  const [selectedData, setSelectedData] = React.useState<readonly object[]>([]);
  // ------ Selected Row For Multiple Delete End --------
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<RegionProps[]>(data.items);
  const [isHeaderCellEdit, setIsHeaderCellEdit] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [key, setKey] = React.useState<number>(new Date().getTime());
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const [headCells, setHeadCells] = React.useState<HeadCell[]>(
    transformHeaderCells(data.headers, defaultDisable),
  );

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleIndividualDelete = (id: number, name: string) => {
    const foundData = data.items.find((rg) => rg.id === id);
    foundData && setSelected([{ id, name }]);
    setOpenModal(true);
  };

  // on every item click
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => ({ name: n.name, id: n.id }));
      setSelectedData(newSelected);
      return;
    }

    setSelectedData([]);
  };

  // on row click
  const handleClick = (event: React.MouseEvent<unknown>, name: string, id: any) => {
    const target = event.target as HTMLElement;

    if (target?.tagName?.includes("IMG") || target?.tagName?.includes("A")) return;

    const SelectedDataIndex = selectedData.findIndex(
      (data: { name?: string }) => data?.name === name,
    );

    let newSelected: readonly object[] = [];

    if (SelectedDataIndex === -1) {
      newSelected = newSelected.concat(selectedData, { name, id });
    } else if (SelectedDataIndex === 0) {
      newSelected = newSelected.concat(selectedData.slice(1));
    } else if (SelectedDataIndex === selectedData.length - 1) {
      newSelected = newSelected.concat(selectedData.slice(0, -1));
    } else if (SelectedDataIndex > 0) {
      newSelected = newSelected.concat(
        selectedData.slice(0, SelectedDataIndex),
        selectedData.slice(SelectedDataIndex + 1),
      );
    }
    setSelectedData(newSelected);
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

  // const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const isSelected = (name: string) =>
    selectedData.findIndex((data: { name?: string }) => data?.name === name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleEditTable = (ev: React.MouseEvent<HTMLButtonElement>) => {
    setIsHeaderCellEdit(!isHeaderCellEdit);
  };

  const onUpdate = (headCells: HeadCell[]) => {
    setHeadCells(headCells);
    setIsHeaderCellEdit(false);
    setKey(new Date().getTime());
  };

  // handle delete
  const deleteHandler = async (datas: object[]) => {
    let selectedIds = datas?.map((data: { id?: number }) => data?.id);
    let selectedName = datas?.map((data: { name?: string }) => data?.name);
    try {
      await deleteAPI(`${tableIndicator?.backendUrl ? tableIndicator?.backendUrl : backendUrl}/`, {
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
          archivedCount: Number(prev?.archivedCount || 0) + 1,
        };
      });

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

  React.useEffect(() => {
    if (data?.items) {
      setRows(data.items);
      if (data?.headers) {
        setHeadCells(transformHeaderCells(data.headers, defaultDisable));
      }
    }
  }, [data.items]);

  React.useEffect(() => {
    if (Object.keys(staticHeader)?.length) {
      // setRows([]);
      setHeadCells?.(transformHeaderCells(staticHeader, defaultDisable));
    }
  }, [staticHeader]);

  // function
  function clearSelected() {
    setSelected([]);
    setSelectedData([]);
  }

  const searchParams = new URLSearchParams(location.search);
  const searchObject = Object.fromEntries(searchParams.entries());

  React.useEffect(() => {
    if (location?.pathname || Object?.keys(searchObject)?.length) {
      clearSelected();
    }
  }, [location?.pathname, Object?.keys(searchObject)?.length]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <ConfirmationModal
          openModal={openModal}
          setOpenModal={() => setOpenModal(!openModal)}
          handelConfirmation={async () => {
            // deleteRegion
            // const isDeleted = await onDelete?.([...selected]);
            await deleteHandler([...selected]);
            setOpenModal(false);
            setSelected([]);
          }}
          confirmationHeading={`Do you want to delete ${selected
            ?.map((data: { name?: string }) => data.name)
            .join(" ")}?`}
          confirmationDesc={`This ${deletePath.replaceAll("-", " ")}  will be deleted.`}
          status="warning"
          confirmationIcon="/src/assets/icons/icon-feature.svg"
          loader={deleteLoading}
        />
        <ConfirmationModal
          openModal={openDeleteModal}
          setOpenModal={() => {
            setOpenDeleteModal(!openDeleteModal);
            setSelectedData([]);
          }}
          handelConfirmation={async () => {
            // deleteSelectedRows
            // await onDelete?.([...selectedData]);
            await deleteHandler([...selectedData]);
            setOpenDeleteModal(false);
            setSelectedData([]);
          }}
          confirmationHeading={`Do you want to delete these ${deletePath} ?`}
          confirmationDesc={`${selectedData?.map(
            (data: { name?: string }) => data?.name,
          )}  will be deleted.`}
          status="warning"
          confirmationIcon="/src/assets/icons/icon-feature.svg"
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
            numSelected={selectedData.length}
            onDataChange={onDataChange}
            handleEditTable={handleEditTable}
            archivedCount={data.archivedCount}
            backendUrl={backendUrl}
            tableTitle={tableTitle}
            tableIndicator={tableIndicator}
            textTitleLength={textTitleLength}
            csvDownload={csvDownload}
            permissions={permissions}
            permission={permission}
          />

          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              key={key}
            >
              <EnhancedTableHead
                numSelected={selectedData.length}
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
                    let name = row?.[`${tableIndicator?.deleteFieldName}`] || row?.name;
                    const isItemSelected = isSelected(name as string);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    let rowEditLink = "";
                    if (additionalEdit) {
                      rowEditLink = `${row?.id}?address=${
                        row[`${additionalEdit}`]?.length ? row[`${additionalEdit}`][0].id : ""
                      }`;
                    } else {
                      rowEditLink = `${row?.id}`;
                    }
                    return (
                      <TableRow
                        hover
                        onClick={(event) => {
                          handleClick(event, name, row.id);
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
                            checkedIcon={<img src="/src/assets/icons/icon-check.svg" alt="check" />}
                            icon={<img src="/src/assets/icons/icon-uncheck.svg" alt="uncheck" />}
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
                              {/* {GetValue(row, hc?.id)} */}
                              <GetValue
                                row={row}
                                columnName={hc?.id}
                                popUpDisplay={
                                  tableIndicator?.popUpField?.key === hc?.id ? popUpDisplay : false
                                }
                                onTitleNavigate={onTitleNavigate}
                                title={hc?.label}
                              />
                              {tableIndicator?.popUpField?.key === hc?.id && (
                                <PopUpCustom
                                  data={row[tableIndicator?.popUpField?.key]}
                                  title={tableIndicator?.popUpField?.label}
                                  ID={row?.id}
                                  tableIndicator={tableIndicator}
                                />
                              )}
                              {/* {hc?.id === 'findings' && (
                                <PopUpCustom
                                  data={row[hc?.id]}
                                  title="All Findings"
                                  ID={row?.id}
                                  tableIndicator={tableIndicator}
                                />
                              )}
                              {hc?.id === 'recommendations' && (
                                <PopUpCustom
                                  data={row[hc?.id]}
                                  ID={row?.id}
                                  title="All Recommendations"
                                  tableIndicator={tableIndicator}
                                />
                              )} */}
                              {hc?.id === "attachments" && (
                                <PopUpCustom
                                  data={row[hc?.id]?.map((data: any) => data?.attachment)}
                                  ID={row?.id}
                                  title="View Attachments"
                                  tableIndicator={tableIndicator}
                                  openInNewWindow={true}
                                />
                              )}
                            </TableCell>
                          );
                        })}

                        <TableCell className={handleTableCellVisibility("action")}>
                          <div className="actions-btns-holder" style={{ justifyContent: "end" }}>
                            {checkPermission({ permissions, permission: [permission?.delete] }) &&
                              [3].includes(row?.access_rule) && (
                                <Button
                                  onClick={() => {
                                    let name =
                                      row?.[`${tableIndicator?.deleteFieldName}`] || row?.name;
                                    handleIndividualDelete(row.id, name);
                                  }}
                                  startIcon={
                                    <img src="/src/assets/icons/icon-trash.svg" alt="delete" />
                                  }
                                />
                              )}
                            {checkPermission({ permissions, permission: [permission?.edit] }) && (
                              <Link
                                to={`${
                                  tableIndicator?.editFrontEndUrlGetter
                                    ? tableIndicator?.editFrontEndUrlGetter(row?.id)
                                    : rowEditLink
                                    ? `edit/${rowEditLink}`
                                    : `edit/${row?.id}`
                                }`}
                              >
                                {[2, 3].includes(row?.access_rule) && (
                                  <Button
                                    startIcon={
                                      <img src="/src/assets/icons/icon-edit.svg" alt="edit" />
                                    }
                                  />
                                )}
                              </Link>
                            )}
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
        {selectedData.length > 0 && (
          <AppBar
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
                  {selectedData.length} {configName} Selected
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
                    setSelectedData([]);
                  }}
                />
              </div>
            </Toolbar>
          </AppBar>
        )}
        {!!(data?.items?.length === 0) && (
          <Box sx={{ textAlign: "center", marginTop: "50px" }}>
            {/* <AddButton
              tableIndicator={tableIndicator}
              configName={configName}
              location={location}
            /> */}
            {checkPermission({ permissions, permission: [permission?.add] }) && (
              <Link
                to={`${
                  tableIndicator?.frontEndUrl
                    ? tableIndicator?.frontEndUrl
                    : `${location?.pathname}/add`
                }`}
              >
                <Button variant="contained">
                  + Add{" "}
                  {(tableIndicator?.buttonName ? tableIndicator?.buttonName : configName) || ""}
                </Button>
              </Link>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BASDataTable;
