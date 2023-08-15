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
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import {
  AppBar,
  Button,
  Chip,
  Divider,
  Grid,
  lighten,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import { BASConfigTableProps, RegionProps } from "src/interfaces/configs";
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
// import './table.scss';
import { IndividualListDisplay } from "./PopUp";
import KebabIcon from "src/assets/icons/Kebab.png";
import { RadioOptions } from "src/utils/FindingsUtils";
import { GetShorterText } from "src/components/GetShortText";
import { ConfigTableUrlUtils } from "@src/modules/config/generalSettings";
import FilterModal from "src/components/FilterModal/FilterModal";
import { patchApiData, setErrorNotification } from "src/modules/apiRequest/apiRequest";
import AddModal from "src/components/AddModal/AddModal";
import GroupsIcon from "@mui/icons-material/Groups";
import VerticalIcon from "src/assets/icons/vertical_icon.png";
import DeletableChips from "src/modules/config/generalSettings/Filters/FilterChip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { postApiData, restoreAPIData } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";
import { checkPermission } from "src/utils/permission";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { permissionFilter } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { SwitchComponent } from "src/modules/config/Filters/CommonFilter";
import RestoreIcon from "@mui/icons-material/Restore";
import { debounce } from "lodash";
import QueryString from "qs";
import { AnyAaaaRecord } from "dns";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { checkDate, formatDate } from "src/utils/keyFunction";
import useAppStore from "src/store/zustand/app";
import DateRangeIcon from "@mui/icons-material/DateRange";

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
  label: any;
  action?: boolean;
  show: boolean;
  index: number;
  dataObject?: any;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell[];
  exclude?: string[];
  tableControls?: any;
  TABLECONTROLS?: any;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    tableControls,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    exclude = [],
    TABLECONTROLS,
  } = props;
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          {TABLECONTROLS?.requiredSelectIndication ? (
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
          ) : (
            <Box sx={{ py: 3 }} />
          )}
        </TableCell>
        {headCells.map((headCell) => {
          return (
            <React.Fragment key={headCell?.id}>
              {!headCell?.action && headCell?.show && (
                <TableCell
                  key={headCell?.id}
                  //   align={headCell.numeric ? "right" : "left"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                    IconComponent={() => {
                      // this is where we have to check if the incomming column will have sort
                      return !exclude?.includes(headCell?.id) ? (
                        <img src="src/assets/icons/arrow-up.svg" alt="sort" />
                      ) : (
                        <></>
                      );
                    }}
                  >
                    {headCell.label}
                    {/* {orderBy === headCell?.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null} */}
                  </TableSortLabel>
                </TableCell>
              )}
              {headCell.action && headCell.show && (
                <th key={headCell.id} style={{ textAlign: "end" }} className="pin">
                  <div
                    className="action_header"
                    style={{
                      position: "relative",
                      left: "-15px",
                    }}
                  >
                    {headCell.label}
                  </div>
                </th>
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
  onDataChange: ({ key, value }: any) => void;
  handleEditTable: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  handleFilterTable: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  archivedCount: number | undefined | null;
  tableTitle?: string;
  tableIndicator?: tableIndicatorProps;
  textTitleLength?: number;
  csvDownload?: boolean;
  isAddModal?: boolean;
  setOpenAddModal?: Function;
  searchValue?: string;
  allowFilter?: any;
  allowDateFilter?: any;
  buttonLabel?: string;
  tableHeaderContainer?: any;
  selectedData?: any;
  setSelectedData?: any;
  permissions?: any;
  permission?: any;
  filterChildren?: any;
  onAdd?: any;
  onAddButtonDisabled?: any;
  showAdd?: boolean;
  customButtons?: any;
  allowCustomButtons?: boolean;
  additionalHeaderBtn?: React.ReactNode;
  replaceHeaderBtn?: any;
  tableControls?: any;
  TABLECONTROLS?: any;
}

// these are used to show name, set the backend url for csv download, help in setting the
// frontend route to click. Field nam
export interface tableIndicatorProps {
  buttonName?: String;
  backendUrl?: String;
  frontEndUrl?: String;
  sectionTitle?: String;
  editFrontEndUrlGetter?: Function | null;
  deleteFieldName?: any;
  subSectionUrl?: Function | null;
  showAddButton?: boolean;
  popUpField?: {
    key: string;
    label: string;
    fieldName?: string;
    componentType?: string;
    titleFieldName?: string;
  };
}

function AddButton({
  tableIndicator,
  letterHandler,
  configName,
  location,
  isAddModal,
  onAdd,
  onAddButtonDisabled,
}: any) {
  return (
    <>
      {onAdd ? (
        <Button
          onClick={onAdd}
          disabled={onAddButtonDisabled ? true : false}
          variant="contained"
          startIcon={<img src="src/assets/icons/plus-white.svg" alt="plus" />}
        >
          Add{" "}
          {letterHandler({
            title: tableIndicator?.buttonName ? tableIndicator?.buttonName : configName,
          })}
        </Button>
      ) : (
        <Link
          to={`${
            tableIndicator?.frontEndUrl ? tableIndicator?.frontEndUrl : `${location?.pathname}/add`
          }`}
        >
          <Button
            variant="contained"
            startIcon={<img src="src/assets/icons/plus-white.svg" alt="plus" />}
          >
            Add{" "}
            {letterHandler({
              title: tableIndicator?.buttonName ? tableIndicator?.buttonName : configName,
            })}
          </Button>
        </Link>
      )}
    </>
  );
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    onDataChange,
    handleEditTable,
    handleFilterTable,
    configName,
    count,
    archivedCount,
    backendUrl,
    additionalEdit,
    tableTitle,
    tableIndicator,
    textTitleLength,
    csvDownload = true,
    isAddModal = false,
    searchValue,
    setOpenAddModal = () => {},
    allowFilter,
    allowDateFilter,
    buttonLabel,
    permissions = [],
    permission,
    filterChildren,
    onAdd,
    showAdd = true,
    customButtons,
    tableControls,
    allowCustomButtons,
    tableHeaderContainer,
    selectedData,
    setSelectedData,
    additionalHeaderBtn,
    replaceHeaderBtn,
    onAddButtonDisabled,
    TABLECONTROLS,
  } = props;

  const [param, setparam] = React.useState("");
  const [searchText, setSearchText] = React.useState("");

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

  const onDataTableChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(ev.target.value);
  };

  const debouncedResults = React.useMemo(() => {
    onDataChange({ key: "q", value: searchText });
    return debounce(onDataTableChange, 1000);
  }, [searchText]);

  React.useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  return (
    <>
      <Toolbar className="toolbar-table">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div className="left-block">
            <Typography variant="h5" component="h3">
              {GetShorterText({
                value: letterHandler({
                  title: tableTitle ? tableTitle : configName,
                }),
                length: textTitleLength,
              })}
              <Chip label={`${count} Total`} />
            </Typography>
            <Typography variant="body1" component="p">
              {TABLECONTROLS?.archieved && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{archivedCount ?? "0"} Archived</span>
                  <SwitchComponent
                    onChange={(data: any) => {
                      setSelectedData([]);
                      onDataChange?.({
                        key: "archived",
                        value: data ? "true" : "false",
                      });
                    }}
                  />
                </div>
              )}
            </Typography>
          </div>
          <div className="right-block">
            <Grid container spacing={2}>
              {checkPermission({
                permissions,
                permission: [permission?.export],
              }) ? (
                <Grid item>
                  {!!csvDownload && (
                    <Button
                      variant="outlined"
                      onClick={handleDownload}
                      startIcon={<img src="src/assets/icons/download.svg" alt="download" />}
                    >
                      Download CSV
                    </Button>
                  )}
                </Grid>
              ) : null}

              <Grid item>{allowCustomButtons && customButtons && customButtons}</Grid>
              <Grid item>{additionalHeaderBtn}</Grid>
              {checkPermission({
                permissions,
                permission: [permission?.add],
              }) ? (
                <Grid item>
                  {isAddModal ? (
                    <Button
                      onClick={() => {
                        setOpenAddModal(true);
                      }}
                      variant="contained"
                      startIcon={<img src="src/assets/icons/plus-white.svg" alt="plus" />}
                    >
                      {buttonLabel
                        ? buttonLabel
                        : `Add ${letterHandler({
                            title: tableIndicator?.buttonName
                              ? tableIndicator?.buttonName
                              : configName,
                          })}`}
                    </Button>
                  ) : tableHeaderContainer ? (
                    <Button
                      variant="contained"
                      startIcon={
                        tableHeaderContainer?.startIcon && (
                          <img src="src/assets/icons/plus-white.svg" alt="plus" />
                        )
                      }
                      onClick={() =>
                        tableHeaderContainer.headerButtonHandler(
                          selectedData?.length && [...selectedData],
                        )
                      }
                    >
                      {tableHeaderContainer?.buttonLabel}
                    </Button>
                  ) : replaceHeaderBtn ? (
                    replaceHeaderBtn?.(selectedData)
                  ) : (
                    showAdd && (
                      <AddButton
                        tableIndicator={tableIndicator}
                        letterHandler={letterHandler}
                        configName={configName}
                        location={location}
                        onAdd={onAdd}
                        onAddButtonDisabled={onAddButtonDisabled}
                      />
                    )
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "16px",
                  width: "100%",
                  paddingTop: "12px",
                }}
              >
                <Grid item>
                  <form className="search-form">
                    <OutlinedInput
                      placeholder={`Search for ${configName}`}
                      startAdornment={<img src="src/assets/icons/search.svg" alt="search" />}
                      // value={search}
                      fullWidth
                      sx={{
                        minWidth: 400,
                      }}
                      onChange={debouncedResults}
                      // onChange={(e: any) => {
                      //   onDataChange({ key: 'q', value: e.target.value });
                      // }}
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
                {allowFilter?.filter && (
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleFilterTable}
                      startIcon={<img src="src/assets/icons/filter.svg" alt="edit" />}
                    >
                      Filters
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ marginLeft: "12px" }}
                      disabled={allowFilter?.filteredOptionLength ? false : true}
                      className={`${allowFilter?.filteredOptionLength ? "" : "disabled"}`}
                      onClick={() => {
                        onDataChange({ key: "filterQuery", value: "" });
                      }}
                      startIcon={<FilterAltOffIcon />}
                    >
                      Clear All Filters
                    </Button>
                  </Grid>
                )}
                {/* date picker filter */}
                {allowDateFilter?.filter && (
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={allowDateFilter?.handleClearDateFilter}
                      startIcon={<FilterAltOffIcon />}
                    >
                      Clear Filters
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ marginLeft: "12px" }}
                      onClick={() => {
                        allowDateFilter?.dateFilterModal();
                      }}
                      startIcon={<DateRangeIcon />}
                    >
                      Filter By Date
                    </Button>
                  </Grid>
                )}

                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={handleEditTable}
                    startIcon={<img src="src/assets/icons/edit.svg" alt="edit" />}
                  >
                    Customize Table
                  </Button>
                </Grid>
              </div>
              {allowFilter?.filter && allowFilter?.filteredOptionLength > 0 ? (
                <div className="filtered__value">
                  {/* <FilterChip /> */}
                  <div className="filtered__text">Filtered By:</div>
                  {filterChildren}
                </div>
              ) : (
                ""
              )}
            </Grid>
          </div>
        </Stack>
      </Toolbar>
    </>
  );
}

export const defaultDisable = ["created_at", "created_by", "updated_at", "updated_by", "fields"];

const transformHeaderCells = (headcells: { [key: string]: any }, prevHeaders?: any): any => {
  const tempArr: any = [];
  let index = 0;
  for (const key in headcells) {
    let findDisableHeaders: any = {};
    if (defaultDisable?.includes(key)) {
      findDisableHeaders = prevHeaders?.find((header: any) => header?.id === key);
    }
    if (Object.prototype.hasOwnProperty.call(headcells, key)) {
      const element = headcells[key];
      if (element instanceof Object && key !== "id") {
        tempArr.push({
          id: key,
          index: index,
          label: element?.label,
          show:
            findDisableHeaders?.show || false
              ? true
              : defaultDisable?.some((el) => el === key)
              ? false
              : true,
          fetchDataObject: { ...element },
        });
        index++;
      } else if (key !== "id" && !(element instanceof Object)) {
        tempArr.push({
          id: key,
          index: index,
          label: element,
          show:
            findDisableHeaders?.show || false
              ? true
              : defaultDisable?.some((el) => el === key)
              ? false
              : true,
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

// checking if we have html content
function hasHtmlTags(str: string) {
  const htmlRegex = /<\/?[a-z][\s\S]*>/i; // Regular expression to match against any HTML tags
  return htmlRegex.test(str); // Returns true if HTML tags are present in the string, false otherwise
}

export function converText(str: string, maxCharacters?: number) {
  const parser = new DOMParser();
  if (hasHtmlTags(str)) {
    const doc = parser.parseFromString(str, "text/html");

    const plainTextContent: any = doc.body.textContent;

    return plainTextContent?.toString()?.length >= (maxCharacters || 10)
      ? plainTextContent?.toString()?.slice(0, maxCharacters || 10) + "..."
      : plainTextContent;
  } else {
    return str?.length >= (maxCharacters || 10)
      ? str?.toString().slice(0, maxCharacters || 10) + "..."
      : str;
  }
}

function ProgressGenerator(fixValue: any, userValue: any) {
  return (
    <>
      {JSON.stringify(userValue)} - {JSON.stringify(fixValue)}
    </>
  );
}

// getting value component
function GetValue({
  row,
  columnName,
  showNumber = 2,
  showText = false,
  popUpDisplay = false,
  onTitleNavigate,
  title,
  tableOptions,
  enqueueSnackbar,
  navigateTitle,
  columnDisplay,
  tableIndicator,
  maxCharacters = 60,
  headers,
}: any) {
  const fetchData: any = headers?.[columnName] || "";
  let value: any;
  if (fetchData instanceof Object) {
    let dataObject = row?.[fetchData?.obj_name];
    if (Array?.isArray(dataObject)) {
      let finalData = dataObject?.reduce((acc: any, curr: any) => {
        if (Array.isArray(curr?.[fetchData?.field_name])) {
          let val = curr?.[fetchData?.field_name]?.map((it: any) => {
            return checkDate(it) ? formatDate({ date: it }) : it;
          });

          acc.push(...(val || []));
        } else {
          let val = checkDate(curr?.[fetchData?.field_name])
            ? formatDate({ date: curr?.[fetchData?.field_name] })
            : curr?.[fetchData?.field_name];

          acc.push(val);
        }
        return acc;
      }, []);
      value = finalData;
    } else if (dataObject instanceof Object) {
      value = dataObject?.[fetchData?.field_name] || "";
    }
  } else {
    value = row?.[columnName] || "";
  }
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = React.useState<any>();
  const [showAll, setShowAll] = React.useState(Number(maxCharacters) ? false : true);
  // Use state to keep track of whether the button has been clicked

  if (columnName === "attachments") {
    return <></>;
  }

  // if (tableOptions?.[`${columnName?.toLowerCase()}`]?.select) {
  //   setSelectedOptions(value);
  // }

  if (Array.isArray(value)) {
    // Determine which items to display based on whether the button has been clicked
    const displayedValue = showAll ? value : value.slice(0, showNumber);

    return (
      <ol className={`${tableIndicator?.popUpField?.oneLine ? "one__line" : ""}`}>
        {displayedValue?.map((item: any, index: number) => {
          if (item instanceof Object) {
            const MAX_CHARACTERS: any = Number(maxCharacters) ? maxCharacters : "none" || 80;
            const isTruncated = item?.description?.length > MAX_CHARACTERS;
            let keyName = tableIndicator?.popUpField?.fieldName || "description";
            return (
              <IndividualListDisplay
                key={item?.id}
                navigate={navigate}
                id={item?.id}
                individualData={item}
                domain={title}
              >
                <Tooltip title={item?.[`${keyName}`]} placement="top" arrow>
                  <p
                    style={{
                      color: item?.color_code,
                    }}
                  >
                    {item?.[`${keyName}`]?.toString()?.length >= MAX_CHARACTERS
                      ? item?.[`${keyName}`].toString().slice(0, MAX_CHARACTERS) + "..."
                      : item?.[`${keyName}`]}
                  </p>
                </Tooltip>
              </IndividualListDisplay>
            );
          } else {
            const MAX_CHARACTERS: any = Number(maxCharacters) ? maxCharacters : "none" || 80;

            return (
              <div key={item}>
                {/* Display each item in the array */}
                {item?.toString()?.length >= MAX_CHARACTERS
                  ? item?.toString().slice(0, MAX_CHARACTERS) + "..."
                  : item}
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
  const getClassName =
    onTitleNavigate?.navigateColumnName == columnName || navigateTitle?.column === columnName
      ? "hover__effect-underline"
      : "";

  if (value instanceof Object) {
    return <></>;
  }
  return (
    <div
      onClick={(e) => {
        const mode = navigateTitle?.navigateMode || "edit";
        if (onTitleNavigate?.navigateColumnName == columnName) {
          e.stopPropagation();
          onTitleNavigate?.navigateTo?.(row?.id, value);
        } else if (navigateTitle?.navigate) {
          if (navigateTitle?.column === columnName) {
            e.stopPropagation();
            if (navigateTitle?.routePath) {
              navigateTitle?.routePath({ data: row });
            } else {
              navigate(`${mode}/${row?.id}`);
            }
          }
        } else if (!navigateTitle?.navigate) {
          navigateTitle?.handleCustomNavigate(row);
        }
      }}
      className={getClassName}
    >
      {(() => {
        switch (columnName?.toLowerCase()) {
          case "website":
            return (
              <a href={value} target="_blank" rel="noreferrer">
                {converText(value, maxCharacters)}
              </a>
            );
          case "due_date":
            if (row?.status !== "Completed") {
              let finalDate = +moment(value).unix();
              let currentDate = +moment().unix();
              const currentDateMoment = moment();

              let status = moment(value).isSameOrAfter(moment()) ? "Remaining" : "Over Due";
              const diffInSeconds: any = moment(value).isSameOrAfter(moment())
                ? moment.duration(finalDate - currentDate, "seconds")
                : moment.duration(currentDate - finalDate, "seconds");

              const finalDateRange = moment(value).format("LL");
              const currentDateRange = moment().format("LL");

              const createdAtMoment = moment(row["created_at"]);

              function getUserFriendlyDate({ Day, Minute, Hours, Seconds }: any) {
                let days, hours, minutes;
                if (Day) {
                  days = Math.floor(Day);
                  hours = Math.floor((Day - days) * 24);
                  minutes = Math.floor(((Day - days) * 24 - hours) * 60);
                } else if (Hours) {
                  hours = Math.floor(Hours);
                  minutes = Math.floor((Hours - hours) * 60);
                } else if (Minute) {
                  minutes = Minute;
                }
                // Format the duration as a human-readable string
                let durationString = "";
                if (Number(days) > 0) {
                  durationString += `${days} day${Number(days) > 1 ? "s" : ""} `;
                }

                return durationString;
              }

              // Determine the appropriate unit to display the duration in
              let unit, diff;
              if (Number(diffInSeconds) >= 0) {
                if (diffInSeconds.asDays() >= 1) {
                  unit = "days";
                  diff = getUserFriendlyDate({ Day: diffInSeconds.asDays() });
                } else if (diffInSeconds.asHours() >= 1) {
                  unit = "hours";
                  diff = getUserFriendlyDate({
                    Hours: diffInSeconds.asHours(),
                  });
                } else if (diffInSeconds.asMinutes() >= 1) {
                  unit = "minutes";
                  diff = getUserFriendlyDate({
                    Minute: diffInSeconds.asMinutes(),
                  });
                } else {
                  unit = "seconds";
                  diff = diffInSeconds.asSeconds();
                }
              }
              const getValue = status.includes("Over Due")
                ? `${status} ${diff}`
                : `${createdAtMoment.format("LL")} - ${finalDateRange}`;

              // Calculate the elapsed time since the task was created as a Moment duration object
              const elapsedTimeDuration: any = moment.duration(currentDateMoment.diff(value));

              // Calculate the total time between the created date and the due date as a Moment duration object
              const totalTimeDuration: any = moment.duration(moment(createdAtMoment).diff(value));
              // Calculate the percentage of completion
              const percentage = (1 - elapsedTimeDuration / totalTimeDuration) * 100;

              const exceedTime = status?.includes("Over Due") ? (percentage * -1) / 100 : 0;
              const ProgressBar = () => {
                return (
                  <div className="progress__container">
                    <div className="progress__bar">
                      <span
                        style={{
                          width: `${percentage}%`,
                          background: percentage < 100 && percentage >= 0 ? "#33426A" : "#b42318",
                        }}
                      ></span>
                    </div>
                    <span
                      className="delay__indicator"
                      style={{
                        display: exceedTime > 0 ? "block" : "none",
                        right: `calc(100% - (100% - ${exceedTime + 15}%))`,
                      }}
                    ></span>
                  </div>
                );
              };

              return (
                <div className="progress__box">
                  <ProgressBar />
                  {getValue}
                </div>
              );
            } else {
              const dateTimeString = row?.due_date;
              const dateTime = new Date(dateTimeString);
              if (isNaN(dateTime.getTime())) {
              }
              const date_ = new Date(row?.due_date);

              const options: Intl.DateTimeFormatOptions = {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "UTC",
              };
              const due_date = date_.toLocaleDateString("en-US", options);
              return <span>{due_date}</span>;
            }
            return;
          default:
            let TABLEOPTIONSCOLUMN: any = {};
            if (typeof tableOptions?.[columnName?.toLowerCase()] === "function") {
              let data = tableOptions?.[`${columnName?.toLowerCase()}`]?.(row);
              TABLEOPTIONSCOLUMN = { [`${columnName?.toLowerCase()}`]: data };
            } else {
              TABLEOPTIONSCOLUMN = tableOptions;
            }
            if (
              !TABLEOPTIONSCOLUMN?.[`${columnName?.toLowerCase()}`]?.select &&
              TABLEOPTIONSCOLUMN?.chipOptionsName?.includes(columnName?.toLowerCase()) &&
              row?.[columnName]?.toLowerCase()
            ) {
              return (
                <>
                  <div
                    style={{
                      display: "inline-block",
                      background: RadioOptions?.[`${value}`]
                        ? RadioOptions?.[`${value}`].backgroundColor
                        : RadioOptions?.[`default`].backgroundColor,
                      padding: "4px 12px",
                      paddingLeft: "30px",
                      borderRadius: "20px",
                      position: "relative",
                      color: RadioOptions?.[`${value}`]
                        ? RadioOptions?.[`${value}`]?.textColor
                        : RadioOptions?.[`default`]?.textColor,
                    }}
                    className="badge__creator"
                  >
                    <span
                      style={{
                        background: RadioOptions?.[`${value}`]
                          ? RadioOptions?.[`${value}`]?.dotColor
                          : RadioOptions?.[`default`]?.dotColor,
                      }}
                    ></span>
                    {converText(value, maxCharacters)}
                  </div>
                </>
              );
            }

            if (TABLEOPTIONSCOLUMN?.[`${columnName?.toLowerCase()}`]) {
              const keyName = `${
                TABLEOPTIONSCOLUMN[`${columnName?.toLowerCase()}`]?.displayKeyName
              }`;
              const backendDataSetKeyName = `${
                TABLEOPTIONSCOLUMN[`${columnName?.toLowerCase()}`]?.setKeyName
              }`;
              const options = { [keyName]: value };
              const chipTrue =
                TABLEOPTIONSCOLUMN?.chipOptionsName?.indexOf(columnName) !== -1 ? true : false;

              const getStyle = function (item: any) {
                const active = selectedOptions?.[keyName]
                  ? selectedOptions?.[keyName] === item?.[keyName]
                    ? true
                    : false
                  : options?.[keyName] === item?.[keyName]
                  ? true
                  : false;
                return {
                  background: active ? "rgba(144, 202, 249, 0.16)" : "transparent",
                };
              };

              return (
                <div
                  style={{ overflow: "hidden" }}
                  className="parent__box"
                  onClick={(e: any) => {
                    e.stopPropagation();
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      background: RadioOptions?.[`${value}`]
                        ? RadioOptions?.[`${value}`].backgroundColor
                        : RadioOptions?.[`default`].backgroundColor,
                      padding: "8px 12px",
                      paddingLeft: "30px",
                      borderRadius: "20px",
                      position: "relative",
                      color: RadioOptions?.[`${value}`]
                        ? RadioOptions?.[`${value}`]?.textColor
                        : RadioOptions?.[`default`]?.textColor,
                    }}
                    className="badge__creator"
                  >
                    <span
                      style={{
                        background: RadioOptions?.[`${value}`]
                          ? RadioOptions?.[`${value}`]?.dotColor
                          : RadioOptions?.[`default`]?.dotColor,
                      }}
                    ></span>
                    {selectedOptions?.[keyName] ? selectedOptions?.[keyName] : options?.[keyName]}
                  </div>
                  {TABLEOPTIONSCOLUMN[`${columnName?.toLowerCase()}`]?.select && (
                    <Select
                      MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                      id={`${TABLEOPTIONSCOLUMN[`${columnName?.toLowerCase()}`]?.field}`}
                      size="small"
                      multiple={
                        TABLEOPTIONSCOLUMN[`${columnName?.toLowerCase()}`]?.multiple || false
                      }
                      fullWidth
                      data-testid="address_type"
                      placeholder="Select here"
                      autoComplete="off"
                      name={`${TABLEOPTIONSCOLUMN[`${columnName?.toLowerCase()}`]?.field}`}
                      value={
                        selectedOptions?.[keyName] ? selectedOptions?.[keyName] : options?.[keyName]
                      }
                      className={chipTrue ? "hide__select" : ""}
                      renderValue={(val) => {
                        return val;
                      }}
                      // defaultValue={options?.[keyName]}
                      onChange={(e: any) => {
                        e?.stopPropagation();

                        setSelectedOptions(e?.target?.value);
                        if (
                          !TABLEOPTIONSCOLUMN[`${columnName?.toLowerCase()}`]?.multiple &&
                          !TABLEOPTIONSCOLUMN[`${columnName?.toLowerCase()}`]?.backendAction
                        ) {
                          (async function apiHit() {
                            const apiResponse = await patchApiData({
                              values: {
                                status: e.target.value?.id,
                              },
                              id: row[
                                TABLEOPTIONSCOLUMN?.[`${columnName?.toLowerCase()}`]?.api?.columnId
                              ],
                              url: TABLEOPTIONSCOLUMN?.[`${columnName?.toLowerCase()}`]?.api?.api,
                              enqueueSnackbar: enqueueSnackbar,
                              domain: "Status",
                              setterLoading: TABLEOPTIONSCOLUMN?.setIsLoading,
                            });
                            if (!apiResponse) {
                              const findData = TABLEOPTIONSCOLUMN?.[
                                `${columnName?.toLowerCase()}`
                              ]?.options?.find(
                                (it: any) => it?.[keyName] == selectedOptions?.[keyName],
                              );
                              setSelectedOptions({ ...findData });
                            }
                          })();
                        } else {
                          TABLEOPTIONSCOLUMN[`${columnName?.toLowerCase()}`]?.backendAction?.(
                            e?.target?.value,
                          );
                        }
                      }}
                    >
                      {TABLEOPTIONSCOLUMN?.[`${columnName?.toLowerCase()}`]?.options?.map(
                        (item: any, index: number) => (
                          <MenuItem
                            key={`${item?.[`${keyName}`]}`}
                            value={item}
                            style={{ ...getStyle(item) }}
                          >
                            {item?.[`${keyName}`]}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  )}
                </div>
              );
            }

            return converText(value, maxCharacters);
        }
      })()}
    </div>
  );
}

// duplicate
async function duplicateRestoreAPI({
  values,
  enqueueSnackbar,
  setIsFormLoading,
  domain,
  url,
  setTableDatas,
  method = "duplicate",
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

// async function restoreAPI({
//   values,
//   enqueueSnackbar,
//   setIsFormLoading,
//   domain,
//   url,
//   setTableDatas,
// }: any) {
//   await postApiData({
//     setterFunction: (data: any) => {
//       setTableDatas((prev: any) => ({
//         ...prev,
//         items: [...(data?.data || []), ...prev?.items],
//       }));
//     },
//     values: values,
//     url: `/${url}/duplicate/${values?.id}`,
//     enqueueSnackbar: enqueueSnackbar,
//     domain: domain,
//     setterLoading: setIsFormLoading,
//   });
// }

const TableDotActions = ({
  tableIndicator,
  row,
  handleTableCellVisibility,
  rowEditLink,
  handleIndividualDelete,
  buttonLabel,
  dotModeOptions,
  optionButtonLabel,
  type,
  permission,
  permissions,
  viewIcon,
  setIsCopyID,
  setCopyModal,
  onEdit,
  duplicate,
  urlUtils,
  onView,
  tableControls,
  selectedData,
}: any) => {
  // let {view, edit, add, delete} = tableControls || { view:true, edit:true, delete:true}

  const location = useLocation();
  const [verticalAnchorEl, setVerticalAnchorEl] = React.useState<any>(null);
  const open = Boolean(verticalAnchorEl);
  const verticalId = open ? "simple-popover" : undefined;
  // vertical popup on actions
  const handleVerticalPopup = (event: any) => {
    setVerticalAnchorEl(event.currentTarget);
  };
  const isAccessRuleExist = "access_rule" in row;

  const TABLECONTROLS = typeof tableControls === "function" ? tableControls(row) : tableControls;

  return (
    <>
      {type === "dot" ? (
        <>
          <th>
            <div
              aria-describedby={row?.id}
              onClick={(e) => {
                e.stopPropagation();
                handleVerticalPopup(e);
              }}
              className="actions-btns-holder"
              style={{
                display: "flex",
                justifyContent: "end",
                cursor: "pointer",
                marginRight: "30px",
              }}
            >
              <Box
                sx={{
                  padding: "8px 13px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "#fff",
                    borderRadius: "50px",
                    transition: "all 0.3s ease",
                    border: "1px solid #384874",
                  },
                }}
              >
                <img
                  src={VerticalIcon}
                  alt="vertical"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </Box>
            </div>
          </th>

          <Popover
            id={verticalId}
            open={open}
            anchorEl={verticalAnchorEl}
            onClose={() => setVerticalAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Stack direction="column" sx={{ width: "200px" }}>
              {/* edit */}
              {TABLECONTROLS?.edit &&
              urlUtils?.archived !== "true" &&
              checkPermission({
                permissions,
                permission: [permission?.edit],
              }) &&
              !isAccessRuleExist ? (
                <Link
                  to={`${
                    onEdit
                      ? "#"
                      : tableIndicator?.editFrontEndUrlGetter
                      ? tableIndicator?.editFrontEndUrlGetter(row?.id)
                      : rowEditLink
                      ? `edit/${rowEditLink}`
                      : `edit/${row?.id}`
                  }`}
                  onClick={() => {
                    onEdit && onEdit?.(row?.id);
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      padding: "10px",
                      cursor: "pointer",
                      "&:hover": {
                        background: "#f9fafb",
                      },
                    }}
                  >
                    <img src="src/assets/icons/icon-edit.svg" alt="edit" />

                    <span>Edit</span>
                  </Stack>
                </Link>
              ) : checkPermission({
                  permissions,
                  permission: [permission?.edit],
                }) &&
                isAccessRuleExist &&
                [2, 3].includes(row?.access_rule) ? (
                <Link
                  to={`${
                    onEdit
                      ? "#"
                      : tableIndicator?.editFrontEndUrlGetter
                      ? tableIndicator?.editFrontEndUrlGetter(row?.id)
                      : rowEditLink
                      ? `edit/${rowEditLink}`
                      : `edit/${row?.id}`
                  }`}
                  onClick={() => {
                    onEdit && onEdit?.(row?.id);
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      padding: "10px",
                      cursor: "pointer",
                      "&:hover": {
                        background: "#f9fafb",
                      },
                    }}
                  >
                    <img src="src/assets/icons/icon-edit.svg" alt="edit" />

                    <span>Edit</span>
                  </Stack>
                </Link>
              ) : null}
              <Divider />
              {/* delete */}
              {TABLECONTROLS?.delete &&
              checkPermission({
                permissions,
                permission: [permission?.delete],
              }) &&
              !isAccessRuleExist ? (
                <Stack
                  direction="row"
                  alignItems="center"
                  onClick={() => {
                    let isObject = tableIndicator?.deleteFieldName instanceof Object || false;
                    let name =
                      row?.[
                        `${
                          isObject
                            ? tableIndicator?.deleteFieldName?.value
                            : tableIndicator?.deleteFieldName
                        }`
                      ] || row?.name;
                    handleIndividualDelete(row.id, name);
                  }}
                  spacing={2}
                  sx={{
                    padding: "10px",
                    cursor: "pointer",
                    "&:hover": {
                      background: "#f9fafb",
                    },
                  }}
                >
                  <img src="src/assets/icons/icon-trash.svg" alt="delete" />
                  <span>Delete</span>
                </Stack>
              ) : checkPermission({
                  permissions,
                  permission: [permission?.delete],
                }) &&
                isAccessRuleExist &&
                [3].includes(row?.access_rule) ? (
                <Stack
                  direction="row"
                  alignItems="center"
                  onClick={() => {
                    let isObject = tableIndicator?.deleteFieldName instanceof Object || false;
                    let name =
                      row?.[
                        `${
                          isObject
                            ? tableIndicator?.deleteFieldName?.value
                            : tableIndicator?.deleteFieldName
                        }`
                      ] || row?.name;
                    handleIndividualDelete(row.id, name);
                  }}
                  spacing={2}
                  sx={{
                    padding: "10px",
                    cursor: "pointer",
                    "&:hover": {
                      background: "#f9fafb",
                    },
                  }}
                >
                  <img src="src/assets/icons/icon-trash.svg" alt="delete" />
                  <span>Delete</span>
                </Stack>
              ) : null}
              <Divider />
              {urlUtils?.archived !== "true" &&
              checkPermission({
                permissions,
                permission: [permission?.add],
              }) &&
              duplicate ? (
                <>
                  <Stack
                    direction="row"
                    alignItems="center"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setIsCopyID(row);
                      setCopyModal(true);
                    }}
                    spacing={2}
                    sx={{
                      padding: "10px",
                      cursor: "pointer",
                      "&:hover": {
                        background: "#f9fafb",
                      },
                    }}
                  >
                    <ContentCopyIcon sx={{ width: "20px", height: "20px" }} />
                    <span>Duplicate</span>
                  </Stack>
                  <Divider />
                </>
              ) : (
                <></>
              )}

              {TABLECONTROLS?.add &&
                urlUtils?.archived === "true" &&
                checkPermission({
                  permissions,
                  permission: [permission?.add],
                }) && (
                  <>
                    <Stack
                      direction="row"
                      alignItems="center"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        let isObject = tableIndicator?.deleteFieldName instanceof Object || false;
                        let name =
                          row?.[
                            `${
                              isObject
                                ? tableIndicator?.deleteFieldName?.value
                                : tableIndicator?.deleteFieldName
                            }`
                          ] || row?.name;
                        handleIndividualDelete(row.id, name, "re-store");
                      }}
                      spacing={2}
                      sx={{
                        padding: "10px",
                        cursor: "pointer",
                        "&:hover": {
                          background: "#f9fafb",
                        },
                      }}
                    >
                      <RestoreIcon sx={{ width: "20px", height: "20px" }} />
                      <span>Restore</span>
                    </Stack>
                    <Divider />
                  </>
                )}
              {(() => {
                let value: any =
                  (typeof dotModeOptions === "function" && dotModeOptions?.(row)) || dotModeOptions;

                return value
                  ?.filter((item: any) => permissionFilter({ item, permissions }))
                  ?.map(({ label, handleButtonClick, Icon, permission }: any) => {
                    return !isAccessRuleExist ? (
                      <>
                        {row?.[optionButtonLabel?.status] === optionButtonLabel?.buttonValue &&
                        // optionButtonLabel?.userRole !== 'Customer' ? (
                        //   <>
                        //     {optionButtonLabel?.buttonAssets?.label && (
                        //       <Stack
                        //         direction="row"
                        //         alignItems="center"
                        //         sx={{
                        //           padding: '10px',
                        //           cursor: 'pointer',
                        //           '&:hover': {
                        //             background: '#f9fafb',
                        //           },
                        //         }}
                        //         spacing={1}>
                        //         <Box>
                        //           <div
                        //             onClick={(e: any) => {
                        //               e.stopPropagation();
                        //             }}>
                        //             <Button
                        //               variant="contained"
                        //               onClick={() =>
                        //                 optionButtonLabel?.buttonAssets?.handleOpenModal(row)
                        //               }>
                        //               {optionButtonLabel?.buttonAssets?.label}
                        //             </Button>
                        //           </div>
                        //         </Box>
                        //       </Stack>
                        //     )}
                        //   </>
                        // ) :

                        optionButtonLabel?.userRole === "Customer" ? (
                          <Stack
                            direction="row"
                            alignItems="center"
                            sx={{
                              padding: "10px",
                              cursor: "pointer",
                              "&:hover": {
                                background: "#f9fafb",
                              },
                            }}
                            spacing={2}
                            onClick={() => {
                              handleButtonClick(row, handleIndividualDelete);
                            }}
                          >
                            {!!Icon && Icon}

                            <span>{label || ""}</span>
                          </Stack>
                        ) : optionButtonLabel?.rejectButtonValue?.includes(
                            row?.[optionButtonLabel?.status],
                          ) ? (
                          ""
                        ) : (
                          <Stack
                            direction="row"
                            alignItems="center"
                            sx={{
                              padding: "10px",
                              cursor: "pointer",
                              "&:hover": {
                                background: "#f9fafb",
                              },
                            }}
                            spacing={2}
                            onClick={() => {
                              handleButtonClick(row, handleIndividualDelete);
                            }}
                          >
                            {!!Icon && Icon}

                            <span>{label || ""}</span>
                          </Stack>
                        )}
                      </>
                    ) : isAccessRuleExist && [2, 3].includes(row?.access_rule) ? (
                      <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                          padding: "10px",
                          cursor: "pointer",
                          "&:hover": {
                            background: "#f9fafb",
                          },
                        }}
                        spacing={2}
                        onClick={() => {
                          handleButtonClick(row, handleIndividualDelete);
                        }}
                      >
                        {!!Icon && Icon}

                        <span>{label || ""}</span>
                      </Stack>
                    ) : null;
                  });
              })()}
            </Stack>
          </Popover>
        </>
      ) : (
        <th className={handleTableCellVisibility("action")}>
          <div className="actions-btns-holder">
            {TABLECONTROLS?.view && (
              <Button
                startIcon={<RemoveRedEyeOutlinedIcon />}
                onClick={async (e: any) => {
                  e.stopPropagation();
                  onView?.(row);
                }}
              ></Button>
            )}
            {TABLECONTROLS?.duplicate &&
            urlUtils?.archived !== "true" &&
            checkPermission({
              permissions,
              permission: [permission?.add],
            }) &&
            duplicate ? (
              <Button
                startIcon={<ContentCopyIcon />}
                onClick={async (e: any) => {
                  e.stopPropagation();
                  setIsCopyID(row);
                  setCopyModal(true);
                }}
              ></Button>
            ) : (
              <></>
            )}

            {TABLECONTROLS?.add &&
              urlUtils?.archived === "true" &&
              checkPermission({
                permissions,
                permission: [permission?.add],
              }) && (
                <Button
                  disabled={selectedData?.length}
                  startIcon={<RestoreIcon />}
                  className={"table__row-restore"}
                  onClick={async (e: any) => {
                    e.stopPropagation();
                    let isObject = tableIndicator?.deleteFieldName instanceof Object || false;
                    let name =
                      row?.[
                        `${
                          isObject
                            ? tableIndicator?.deleteFieldName?.value
                            : tableIndicator?.deleteFieldName
                        }`
                      ] || row?.name;
                    handleIndividualDelete(row.id, name, "re-store");
                  }}
                ></Button>
              )}

            {TABLECONTROLS?.edit &&
            urlUtils?.archived !== "true" &&
            checkPermission({
              permissions,
              permission: [permission?.edit],
            }) ? (
              <Link
                to={`${
                  onEdit
                    ? "#"
                    : tableIndicator?.editFrontEndUrlGetter
                    ? tableIndicator?.editFrontEndUrlGetter(row?.id)
                    : rowEditLink
                    ? `edit/${rowEditLink}`
                    : `edit/${row?.id}`
                }`}
                onClick={() => {
                  onEdit && onEdit?.(row?.id);
                }}
              >
                <Button startIcon={<img src="src/assets/icons/icon-edit.svg" alt="edit" />} />
              </Link>
            ) : null}

            {urlUtils?.archived === "true" ? null : (
              // <Link to={'#'}>
              <>
                {TABLECONTROLS?.delete &&
                checkPermission({
                  permissions,
                  permission: [permission?.delete],
                }) ? (
                  <Button
                    disabled={selectedData?.length}
                    onClick={() => {
                      let isObject = tableIndicator?.deleteFieldName instanceof Object || false;
                      let name =
                        row?.[
                          `${
                            isObject
                              ? tableIndicator?.deleteFieldName?.value
                              : tableIndicator?.deleteFieldName
                          }`
                        ] || row?.name;
                      handleIndividualDelete(row.id, name);
                    }}
                    startIcon={<img src="src/assets/icons/icon-trash.svg" alt="delete" />}
                  />
                ) : null}
              </>
              // </Link>
            )}

            {!!viewIcon && (
              <Link
                to={`${
                  tableIndicator?.editFrontEndUrlGetter
                    ? tableIndicator?.editFrontEndUrlGetter(row?.id)
                    : rowEditLink
                    ? `users/view/${rowEditLink}`
                    : `users/view/${row?.id}`
                }`}
              >
                <Button startIcon={<GroupsIcon />} />
              </Link>
            )}
          </div>
        </th>
      )}
    </>
  );
};

const BASDataTable: React.FC<{
  data: BASConfigTableProps;
  configName: string;
  deletePath: string;
  count: number;
  backendUrl: string;
  additionalEdit?: string;
  onDataChange: ({ key, value }: any) => void;
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
  isAddModal?: boolean;
  openAddModal?: boolean;
  setOpenAddModal?: Function;
  handleSearch?: Function;
  urlUtils?: ConfigTableUrlUtils;

  allowFilter?: any;
  allowDateFilter?: any;
  tableOptions?: any;
  children?: any;
  navigateTitle?: {
    column: any;
    navigate: any;
    routePath?: Function;
    navigateMode?: String;
    handleCustomNavigate?: any;
  };
  buttonLabel?: string;
  tableHeaderContainer?: any;
  permissions?: Array<string>;
  permission?: any;
  FilterComponent?: any;
  defaultTemplateActions?: any;
  actionViewMode?: any;
  viewIcon?: any;
  filterChildren?: any;
  onEdit?: Function | null;
  onAdd?: Function | null;
  onAddButtonDisabled?: any;
  showEdit?: boolean;
  showDelete?: boolean;
  showAdd?: boolean;
  columnDisplay?: any;
  duplicate?: boolean;
  maxCharacters?: any;
  allowCustomButtons?: boolean;
  customButtons?: any;
  additionalHeaderBtn?: React.ReactNode;
  replaceHeaderBtn?: any;
  onView?: any;
  tableControls?: any;
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
  urlUtils,
  onView,
  tableIndicator,
  textTitleLength,
  keyName = "name",
  csvDownload = true,
  isAddModal = false,
  setOpenAddModal = () => {},
  openAddModal,
  allowFilter = { filter: false },
  allowDateFilter = { filter: false },
  tableOptions,
  children,
  navigateTitle,
  buttonLabel,
  tableHeaderContainer,
  permissions = [],
  permission,
  FilterComponent,
  defaultTemplateActions,
  actionViewMode = {
    type: "default",
    optionButtonLabel: "",
    dotModeOptions: [],
  },
  filterChildren,
  viewIcon,
  onEdit,
  onAdd,
  onAddButtonDisabled,
  showEdit = true,
  showDelete = true,
  showAdd,
  columnDisplay,
  duplicate,
  maxCharacters = 80,
  allowCustomButtons = false,
  customButtons,
  handleSearch,
  additionalHeaderBtn,
  replaceHeaderBtn,
  tableControls = {
    add: true,
    edit: true,
    delete: true,
    duplicate: true,
    view: true,
    requiredSelectIndication: true,
    archieved: true,
  },
}) => {
  const TABLECONTROLS = typeof tableControls === "function" ? tableControls() : tableControls;
  const { deleteRegions } = useConfigStore();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("");
  const { systemParameters }: any = useAppStore();

  //  ------ Selected Row For Multiple Delete Start --------
  const [selected, setSelected] = React.useState<readonly object[]>([]);
  const [selectedData, setSelectedData] = React.useState<readonly object[]>([]);
  // ------ Selected Row For Multiple Delete End --------
  // const [page, setPage] = React.useState((urlUtils?.page || 1) - 1 || 0);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  // const [rowsPerPage, setRowsPerPage] = React.useState(urlUtils?.size || 5);
  const [rowsPerPage, setRowsPerPage] = React.useState(systemParameters?.rows_count || 5);
  const [rows, setRows] = React.useState<RegionProps[]>(data.items);
  const [isHeaderCellEdit, setIsHeaderCellEdit] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [copyModal, setCopyModal] = React.useState(false);

  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [key, setKey] = React.useState<number>(new Date().getTime());
  const location = useLocation();
  const [copyID, setIsCopyID] = React.useState<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { type = "default", optionButtonLabel = "", dotModeOptions = [] } = actionViewMode;

  const [headCells, setHeadCells] = React.useState<HeadCell[]>(
    transformHeaderCells(data.headers, []),
  );
  const [filterModal, setFilterModal] = React.useState(false);
  const [method, setMethod] = React.useState("");

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    onDataChange({ key: `sortBy`, value: isAsc ? property : `-${property}` });
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleIndividualDelete = (id: number, name: string, method: string = "delete") => {
    setMethod(method);
    const foundData = data.items.find((rg) => rg.id === id);
    foundData && setSelected([{ id, ...foundData }]);

    setOpenModal(true);
  };

  // on every item click
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      let isObject = tableIndicator?.deleteFieldName instanceof Object || false;
      const newSelected = rows
        .filter((tableData: any) => {
          const checkCheckBoxStatus =
            typeof tableControls === "function" ? tableControls(tableData) : tableControls;
          return checkCheckBoxStatus?.requiredSelectIndication;
        })
        .map((n: any) => {
          return {
            name: tableIndicator?.deleteFieldName
              ? n?.[
                  isObject
                    ? tableIndicator?.deleteFieldName?.value
                    : tableIndicator?.deleteFieldName
                ]
              : n.name,
            id: n.id,
            rest: { ...n },
          };
        });
      setSelectedData(newSelected);
      setSelected(newSelected);
      return;
    }

    setSelectedData([]);
  };

  // on row click
  const handleClick = (event: React.MouseEvent<unknown>, name: string, id: any, data: any) => {
    const target = event.target as HTMLElement;

    if (target?.tagName?.includes("IMG") || target?.tagName?.includes("A")) return;
    const findData = selectedData?.find((data: any) => data?.name === name);
    // const SelectedDataIndex = selectedData.findIndex(
    //   (data: { name?: string }) => data?.name === name,
    // );
    const SelectedDataIndex = selectedData.findIndex(
      (data: { deleteProp?: { id: any; name: any } }) => data?.deleteProp?.name === name,
    );
    let newSelected: readonly object[] = [];
    if (SelectedDataIndex === -1) {
      // newSelected = newSelected.concat(selectedData, { name, id });
      newSelected = newSelected.concat(selectedData, {
        ...data,
        deleteProp: { name, id },
      });
    } else if (SelectedDataIndex === 0) {
      newSelected = newSelected.concat(selectedData.slice(1));
    } else if (SelectedDataIndex === selectedData?.length - 1) {
      newSelected = newSelected.concat(selectedData.slice(0, -1));
    } else if (SelectedDataIndex > 0) {
      newSelected = newSelected.concat(
        selectedData.slice(0, SelectedDataIndex),
        selectedData.slice(SelectedDataIndex + 1),
      );
    }
    setSelected(newSelected);

    setSelectedData(newSelected);
  };

  const handleTableCellVisibility = (id: string): string => {
    return headCells.some((hc) => {
      return hc.id == id && hc.show;
    })
      ? "cell-visible"
      : "cell-hidden";
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    onDataChange({ key: "page", value: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    onDataChange({ key: "size", value: event.target.value });
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => {
    let hasTableDeleteIndication =
      tableIndicator?.deleteFieldName instanceof Object || tableIndicator?.deleteFieldName?.length;

    return (
      selectedData.findIndex((data: any) => {
        // data: { deleteProp?: { id: any; name: any } }
        if (!data?.deleteProp) {
          return hasTableDeleteIndication
            ? data?.name?.toString() === name?.toString()
            : data?.id?.toString() === name?.toString();
        }
        return data?.deleteProp?.name?.toString() === name?.toString();
      }) !== -1
    );
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleEditTable = (ev: React.MouseEvent<HTMLButtonElement>) => {
    setIsHeaderCellEdit(!isHeaderCellEdit);
  };
  const handleFilterTable = (ev: React.MouseEvent<HTMLButtonElement>) => {
    setFilterModal(true);
  };

  const onUpdate = (headCells: HeadCell[]) => {
    setHeadCells(headCells);
    setIsHeaderCellEdit(false);
    setKey(new Date().getTime());
  };

  // handle delete
  const deleteHandler = async (datas: object[], key: string = "name") => {
    let selectedIds = datas?.map((data: { id?: number }) => data?.id);
    let selectedName = datas?.map((data: any) => data?.[`${key}`]);
    try {
      await deleteAPI(`${tableIndicator?.backendUrl ? tableIndicator?.backendUrl : backendUrl}/`, {
        config_ids: selectedIds,
      });
      enqueueSnackbar(
        `${
          (selectedName?.length > 1 ? selectedName?.join(", ") : selectedName[0]) || "Data"
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

      return true;
    } catch (error: any) {
      setErrorNotification(error, enqueueSnackbar);
      return false;
    }
  };

  React.useEffect(() => {
    if (data?.items) {
      setRows(data.items);
      if (data?.headers) {
        // && !Object.keys(staticHeader || {})?.length
        setHeadCells((prev) => {
          // const headersLength = Object?.keys(data?.headers)?.length;
          // return prev?.filter((headCell: any) => headCell?.label !== 'Actions')?.length
          //   ? prev
          //   : transformHeaderCells(data.headers);
          return transformHeaderCells(data?.headers, headCells);
        });
      }
    }
  }, [data.items]);

  React.useEffect(() => {
    if (Object.keys(staticHeader)?.length) {
      // setRows([]);
      setHeadCells?.(transformHeaderCells(staticHeader, headCells));
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

  React.useEffect(() => {
    if (!systemParameters?.rows_count) return;
    setRowsPerPage(systemParameters?.rows_count || 5);
  }, [systemParameters]);

  const tablePaginationData: any = systemParameters?.rows_count
    ? [systemParameters?.rows_count, 5, 10, 15, 25]?.sort((a, b) => a - b)
    : [5, 10, 15, 25];
  const tablePaginationOptions: any = [...new Set(tablePaginationData)];

  return (
    <Box sx={{ width: "100%" }} style={{ position: "relative" }}>
      <Box>
        <AddModal openModal={openAddModal} setOpenModal={setOpenAddModal}>
          {children}
        </AddModal>
        <ConfirmationModal
          openModal={openModal}
          setOpenModal={() => {
            setOpenModal(!openModal);
          }}
          handelConfirmation={async () => {
            // deleteRegion
            // const isDeleted = await onDelete?.([...selected]);
            setDeleteLoading(true);
            let isObject = tableIndicator?.deleteFieldName instanceof Object;
            if (method === "delete") {
              await deleteHandler(
                [...selected],
                isObject ? tableIndicator?.deleteFieldName?.key : "name",
              );
            } else if (method === "re-store") {
              let selectedIds = selectedData?.map((data: { id?: number }) => data?.id);

              await duplicateRestoreAPI({
                values: [...(selected?.map((it: any) => it?.id) || [])],
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
                  archivedCount: Number(prev?.archivedCount || 0) - 1,
                  total: Number(prev?.total || 0) - 1,
                };
              });
            }
            setDeleteLoading(false);
            setOpenModal(false);
            setSelected([]);
          }}
          confirmationHeading={`Do you want to ${
            method === "delete" ? method : "restore"
          } ${selected?.map((data: { name?: string }) => data.name).join(" ")}?`}
          confirmationDesc={`This ${deletePath.replaceAll("-", " ")}  will be ${
            method === "delete" ? "deleted" : "restored"
          }.`}
          status="warning"
          confirmationIcon="src/assets/icons/icon-feature.svg"
          loader={deleteLoading}
        />
        <ConfirmationModal
          openModal={copyModal}
          setOpenModal={() => setCopyModal(!copyModal)}
          handelConfirmation={async () => {
            // deleteRegion
            // const isDeleted = await onDelete?.([...selected]);
            setDeleteLoading(true);
            copyID &&
              (await duplicateRestoreAPI({
                values: {
                  id: copyID?.id,
                },
                domain: tableIndicator?.buttonName,
                url: tableIndicator?.backendUrl,
                setTableDatas: setterFunction,
                enqueueSnackbar: enqueueSnackbar,
              }));
            setDeleteLoading(false);
            setCopyModal(false);
          }}
          confirmationHeading={`Are you sure to perform this action`}
          confirmationDesc={`It will make the copy of ${copyID?.name || ""}`}
          status="warning"
          confirmationIcon="src/assets/icons/icon-feature.svg"
          loader={deleteLoading}
        />
        <ConfirmationModal
          openModal={openDeleteModal}
          setOpenModal={() => {
            setOpenDeleteModal(!openDeleteModal);
            setSelectedData([]);
          }}
          loader={deleteLoading}
          handelConfirmation={async () => {
            // deleteSelectedRows
            // await onDelete?.([...selectedData]);
            setDeleteLoading(true);
            if (method === "delete") {
              await deleteHandler([...selectedData]);
            } else if (method === "re-store") {
              let selectedIds = selectedData?.map((data: { id?: number }) => data?.id);

              await duplicateRestoreAPI({
                values: [...(selected?.map((it: any) => it?.id) || [])],
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
            }
            setDeleteLoading(false);
            setOpenDeleteModal(false);
            setSelectedData([]);
          }}
          confirmationHeading={`Do you want to ${
            method === "delete" ? method : "restore"
          } these ${deletePath} ?`}
          // confirmationDesc={`${selectedData?.map(
          //   (data: { name?: string }) => data?.name,
          // )}  will be  ${method === 'delete' ? 'deleted' : 'restored'}.`}
          confirmationDesc={`Selected data will be  ${
            method === "delete" ? "deleted" : "restored"
          }.`}
          status="warning"
          confirmationIcon="src/assets/icons/icon-feature.svg"
        />
        <FilterModal
          openModal={filterModal}
          setOpenModal={() => {
            setFilterModal(!filterModal);
            setSelectedData([]);
          }}
          setFilterModal={setFilterModal}
          className={allowFilter.className ? allowFilter?.className : ""}
          // handelConfirmation={async () => {
          //   // deleteSelectedRows
          //   // await onDelete?.([...selectedData]);
          //   await deleteHandler([...selectedData]);
          //   setOpenDeleteModal(false);
          //   setSelectedData([]);
          // }}
          confirmationHeading={`Apply Filter`}
          FilterComponent={({ filterModal, setFilterModal }: any) => {
            return FilterComponent?.({ filterModal, setFilterModal });
          }}
        >
          {children}
        </FilterModal>

        <TableColumns
          headCells={headCells}
          onHide={handleEditTable as any}
          modelOpen={isHeaderCellEdit}
          onUpdate={onUpdate}
        />
        <Paper sx={{ width: "100%", mb: 2 }} className="config-table-holder">
          <EnhancedTableToolbar
            count={data.total}
            configName={configName}
            numSelected={selectedData?.length}
            onDataChange={onDataChange}
            handleEditTable={handleEditTable}
            handleFilterTable={handleFilterTable}
            archivedCount={data.archivedCount}
            backendUrl={backendUrl}
            tableTitle={tableTitle}
            tableIndicator={tableIndicator}
            textTitleLength={textTitleLength}
            csvDownload={csvDownload}
            isAddModal={isAddModal}
            setOpenAddModal={setOpenAddModal}
            // searchValue={urlUtils?.q}
            allowFilter={allowFilter}
            allowDateFilter={allowDateFilter}
            buttonLabel={buttonLabel}
            tableHeaderContainer={tableHeaderContainer}
            permissions={permissions}
            permission={permission}
            filterChildren={filterChildren}
            customButtons={customButtons}
            allowCustomButtons={allowCustomButtons}
            onAdd={onAdd}
            onAddButtonDisabled={onAddButtonDisabled}
            showAdd={showAdd}
            additionalHeaderBtn={additionalHeaderBtn}
            replaceHeaderBtn={replaceHeaderBtn}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            tableControls={tableControls}
            TABLECONTROLS={TABLECONTROLS}
          />

          <TableContainer className="my__custom-table">
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              key={key}
            >
              <EnhancedTableHead
                numSelected={selectedData?.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={headCells}
                exclude={data?.exclude || []}
                tableControls={tableControls}
                TABLECONTROLS={TABLECONTROLS}
              />
              <TableBody className="table__body">
                {
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  // stableSort(rows as any, getComparator(order, orderBy))
                  rows.slice(0, rows?.length).map((row: any, index: number) => {
                    let isObject = tableIndicator?.deleteFieldName instanceof Object || false;
                    let name =
                      row?.[
                        `${
                          isObject
                            ? tableIndicator?.deleteFieldName?.value
                            : tableIndicator?.deleteFieldName
                        }`
                      ] || row?.name;
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
                          handleClick(event, name, row.id, row);
                        }}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        className="active__row"
                      >
                        {/* checkbox */}
                        <TableCell padding="checkbox">
                          {(() => {
                            const TABLECONTROLSS =
                              typeof tableControls === "function"
                                ? tableControls(row)
                                : tableControls;

                            return (
                              <>
                                {TABLECONTROLSS?.requiredSelectIndication && (
                                  <Checkbox
                                    color="primary"
                                    checkedIcon={
                                      <img src="src/assets/icons/icon-check.svg" alt="check" />
                                    }
                                    icon={
                                      <img src="src/assets/icons/icon-uncheck.svg" alt="uncheck" />
                                    }
                                    checked={isItemSelected}
                                    inputProps={{
                                      "aria-labelledby": labelId,
                                    }}
                                  />
                                )}
                              </>
                            );
                          })()}
                        </TableCell>

                        {[...headCells]?.map((hc, index) => {
                          if (hc.action) return;
                          if (
                            hc.id === "created_at" ||
                            hc.id === "updated_at" ||
                            hc.id === "start_date" ||
                            hc.id === "end_date" ||
                            hc.id === "begin_date"
                          )
                            return (
                              <TableCell key={index} className={handleTableCellVisibility(hc.id)}>
                                {moment(new Date(row[hc.id])).format("Do MMM, YYYY")}
                              </TableCell>
                            );

                          const dayOptions: any = {
                            "1": { label: "Sun", color: "#E5BE01" },
                            "2": { label: "Mon", color: "#8D948D" },
                            "3": { label: "Tue", color: "#E55137" },
                            "4": { label: "Wed", color: "#E7EBDA" },
                            "5": { label: "Thu", color: "#1F3A3D" },
                            "6": { label: "Fri", color: "#4D5645" },
                            "7": { label: "Sat", color: "#EA899A" },
                          };

                          if (hc.id === "repeat_days") {
                            return (
                              <TableCell key={index} className={handleTableCellVisibility(hc.id)}>
                                {row[hc.id]?.map((day: any) => {
                                  const dayOption: any = dayOptions[day];
                                  const lightColor = lighten(dayOption.color, 0.2);

                                  return (
                                    <span key={day}>
                                      {dayOption ? (
                                        <Chip
                                          label={dayOption.label}
                                          size="small"
                                          style={{
                                            backgroundColor: lightColor,
                                            color: "#fff",
                                            marginRight: "2px",
                                          }}
                                        />
                                      ) : null}
                                    </span>
                                  );
                                })}
                              </TableCell>
                            );
                          }

                          if (hc.id === "submit_after_due_date") {
                            return (
                              <TableCell key={index} className={handleTableCellVisibility(hc.id)}>
                                {moment(new Date(row[hc.id])).format("MMM Do YY")}
                              </TableCell>
                            );
                          }

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
                                tableOptions={tableOptions}
                                enqueueSnackbar={enqueueSnackbar}
                                navigateTitle={navigateTitle}
                                columnDisplay={columnDisplay}
                                tableIndicator={tableIndicator}
                                maxCharacters={maxCharacters}
                                headers={data?.headers}
                              />
                              {tableIndicator?.popUpField?.key === hc?.id && (
                                <>
                                  <PopUpCustom
                                    data={row[tableIndicator?.popUpField?.key]}
                                    title={
                                      tableIndicator?.popUpField?.label ||
                                      row?.[tableIndicator?.popUpField?.titleFieldName || ""]
                                    }
                                    ID={row?.id}
                                    tableIndicator={tableIndicator}
                                  />
                                </>
                              )}
                              {hc?.id === "attachments" && (
                                <PopUpCustom
                                  data={row[hc?.id]?.map((data: any) => data?.attachment)}
                                  ID={row?.id}
                                  title="View Attachments"
                                  tableIndicator={tableIndicator}
                                  openInNewWindow={true}
                                />
                              )}
                              {defaultTemplateActions?.display && hc?.id === "default_status" && (
                                <div
                                  onClick={(e: any) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Switch
                                    checked={row?.default_status}
                                    onChange={(e: any) => {
                                      defaultTemplateActions?.handleDefaultTemplateChange(row);
                                    }}
                                  />
                                </div>
                              )}
                              {hc?.id === "is_issue" && (
                                <div>
                                  <SwitchComponent value={row?.is_issue} disabled={true} />
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableDotActions
                          tableIndicator={tableIndicator}
                          row={row}
                          handleTableCellVisibility={handleTableCellVisibility}
                          rowEditLink={rowEditLink}
                          handleIndividualDelete={handleIndividualDelete}
                          dotModeOptions={dotModeOptions}
                          buttonLabel={buttonLabel}
                          optionButtonLabel={optionButtonLabel}
                          type={type}
                          permission={permission}
                          permissions={permissions}
                          viewIcon={viewIcon}
                          setIsCopyID={setIsCopyID}
                          setCopyModal={setCopyModal}
                          onEdit={onEdit}
                          duplicate={duplicate}
                          urlUtils={urlUtils}
                          onView={onView}
                          tableControls={tableControls}
                          TABLECONTROLS={TABLECONTROLS}
                        />
                      </TableRow>
                    );
                  })
                }
                {/* {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            className="table-pagination"
            rowsPerPageOptions={tablePaginationOptions}
            component="div"
            count={data.total || 0}
            // count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        {selectedData?.length > 0 && (
          <>
            {tableOptions?.bottomNavigation ? (
              tableOptions?.bottomNavigation({
                selectedData,
                setSelectedData,
              })
            ) : (
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
                      {selectedData?.length} {configName} Selected
                    </div>
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
                            setOpenDeleteModal(true);
                          }}
                        ></Button>
                      )}
                    {urlUtils?.archived !== "true" &&
                      TABLECONTROLS?.delete &&
                      checkPermission({
                        permissions,
                        permission: [permission?.delete],
                      }) && (
                        <DeleteOutlineIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            setMethod("delete");
                            setOpenDeleteModal(true);
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
                </Toolbar>
              </AppBar>
            )}
          </>
        )}
        {/* {!!(data?.items?.length === 0) && showAdd && (
          <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
            {checkPermission({
              permissions,
              permission: [permission?.add],
            }) ? (
              <Link
                to={`${
                  tableIndicator?.frontEndUrl
                    ? tableIndicator?.frontEndUrl
                    : `${location?.pathname}/add`
                }`}>
                <Button variant="contained">
                  + Add{' '}
                  {(tableIndicator?.buttonName ? tableIndicator?.buttonName : configName) || ''}
                </Button>
              </Link>
            ) : (
              <></>
            )}
          </Box>
        )} */}
      </Box>
    </Box>
  );
};

export default BASDataTable;
