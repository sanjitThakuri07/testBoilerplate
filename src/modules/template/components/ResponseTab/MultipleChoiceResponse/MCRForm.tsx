import React, { FC, useEffect, useState } from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDrag, useDrop } from "react-dnd";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import chroma from "chroma-js";
import { v4 as uuidv4 } from "uuid";

import Select, { StylesConfig } from "react-select";
import { postApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import { useSnackbar } from "notistack";
import { getAPI } from "src/lib/axios";
import FullPageLoader from "src/components/FullPageLoader";
import NoDataFound from "src/components/NoDataFound";
import useApiOptionsStore from "containers/template/store/apiOptionsTemplateStore";

interface MCRColorProps {
  value: string;
  color: string;
  is_flagged?: boolean;
  score?: number;
}

interface MCRFormProps {
  data: MCRColorProps[];
  grsSubmitHandler?: any;
}

interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}
interface MCRFORMI {
  scoringData: boolean;
  responseSetId: number | null;
  setOpenModal?: any;
  updateState?: any;
  disabled?: any;
}

const MCRForm = ({ scoringData, responseSetId, setOpenModal, updateState, disabled }: MCRFORMI) => {
  const [count, setCount] = React.useState<number>(1);
  const [isNameBlur, setIsNameBlur] = useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { updateMultipleResponseData, postMultipleResponseData }: any = useApiOptionsStore();

  const [initialValues, setInitialValues] = React.useState<MCRFormProps>({
    data: [
      {
        value: "",
        color: "#666666",
        is_flagged: false,
        score: 0,
      },
    ],
  });
  const { enqueueSnackbar } = useSnackbar();

  const fetchEditData = async () => {
    setLoading(true);
    await getAPI(`multiple-response/${responseSetId}`).then((res: { data: any; status: any }) => {
      try {
        if (res.status === 200) {
          let data = res.data.options.map((item: any) => {
            return {
              value: item.name,
              color: item.color_code,
              is_flagged: item.is_flagged,
              score: item.score,
              id: item?.id || uuidv4(),
            };
          });

          setInitialValues({ data: data });
          setLoading(false);
        }
      } catch (e) {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    });
  };

  useEffect(() => {
    if (responseSetId) {
      fetchEditData();
    }
  }, [responseSetId]);

  const mcrSubmitHandler = async (values: any) => {
    let payload = values.data.map((item: any, index: number) => {
      return {
        name: item.value,
        color_code: item.color ?? "#666666",
        is_flagged: item.is_flagged ?? false,
        score: Number(item.score) || 0,
        id: item?.id ? item?.id : uuidv4(),
      };
    });

    let payloadFormatted = {
      options: payload,
    };

    if (responseSetId) {
      // (await putApiData({
      //   values: payloadFormatted,
      //   id: responseSetId,
      //   url: 'multiple-response',
      //   setterLoading: setLoading,
      //   enqueueSnackbar: enqueueSnackbar,
      //   setterFunction: (data: any) => {
      //     updateState?.(data);
      //   },
      //   domain: 'Multiple Response',
      // })) && setOpenModal();

      updateMultipleResponseData({
        values: payloadFormatted,
        id: responseSetId,
        updateState: updateState,
        enqueueSnackbar: enqueueSnackbar,
      }) && setOpenModal(false);
    } else {
      (await postMultipleResponseData({
        values: payloadFormatted,
        updateState,
        enqueueSnackbar,
      })) && setOpenModal(false);
      // (
      //   await postApiData({
      //     values: payloadFormatted,
      //     setterLoading: setLoading,
      //     url: '/multiple-response/',
      //     enqueueSnackbar: enqueueSnackbar,
      //     domain: 'Multiple Response',
      //     setterFunction: (data: any) => {
      //       updateState?.(data);
      //     },
      //   }),
      // ) &&
      // setOpenModal();
    }
  };

  const handleAddName = (arrayHelpers: any) => {
    arrayHelpers.push("");
    setCount(count + 1);
  };

  const handleRemoveName = (arrayHelpers: any, index: number) => {
    arrayHelpers.remove(index);
    setCount(count - 1);
  };

  const moveItem = (arrayHelpers: any, from: number, to: number) => {
    arrayHelpers.move(from, to);
  };

  const ItemTypes = {
    NAME: "name",
  };

  const Name: FC<{
    name: string;
    index: number;
    arrayHelpers: any;
    values: any;
    setFieldValue: any;
  }> = ({ name, index, arrayHelpers, values, setFieldValue }) => {
    const [{ isDragging }, drag] = useDrag({
      item: { index, type: ItemTypes.NAME },
      type: ItemTypes.NAME,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: ItemTypes.NAME,
      hover(item: { type: string; index: number }, monitor: any) {
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        moveItem(arrayHelpers, dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const colourOptions: readonly ColourOption[] = [
      { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
      { value: "blue", label: "Blue", color: "#0052CC" },
      { value: "purple", label: "Purple", color: "#5243AA" },
      { value: "red", label: "Red", color: "#FF5630", isFixed: true },
      { value: "orange", label: "Orange", color: "#FF8B00" },
      { value: "yellow", label: "Yellow", color: "#FFC400" },
      { value: "green", label: "Green", color: "#36B37E" },
      { value: "forest", label: "Forest", color: "#00875A" },
      { value: "slate", label: "Slate", color: "#253858" },
      { value: "silver", label: "Silver", color: "#666666" },
    ];

    const dot = (color = "transparent") => ({
      fontSize: "0px",
      marginTop: "-4px",

      ":before": {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: "block",
        marginRight: 8,
        height: 14,
        width: 14,
      },
    });

    const colourStyles: StylesConfig<ColourOption> = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "#ececec",

        // background: '#ececec',
        height: "40px",
        borderRadius: "0 4px 4px 0",
      }),
      menuList: (base) => ({
        ...base,
        maxHeight: "120px",
        width: "fit-content",
        background: "#ececec",
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
          ...styles,
          backgroundColor: isDisabled
            ? undefined
            : isSelected
            ? data.color
            : isFocused
            ? color.alpha(0.1).css()
            : undefined,
          color: isDisabled
            ? "#ccc"
            : isSelected
            ? chroma.contrast(color, "white") > 2
              ? "white"
              : "black"
            : data.color,
          cursor: isDisabled ? "not-allowed" : "default",

          ":active": {
            ...styles[":active"],
            border: "none",
            backgroundColor: !isDisabled
              ? isSelected
                ? data.color
                : color.alpha(0.3).css()
              : undefined,
          },
        };
      },
      input: (styles) => ({ ...styles, ...dot() }),
      placeholder: (styles) => ({ ...styles, ...dot("#ccc"), singleValue: "" }),
      singleValue: (styles, { data }) => ({
        ...styles,
        ...dot(data.color),
      }),
    };

    return (
      <div ref={drop} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div ref={drag}>
          <div id="custom_drag_text_field">
            <div className="draggable_icon">
              <IconButton>
                <img src="/assets/icons/dots.svg" alt="Drag" height={20} width={20} />
              </IconButton>
            </div>
            <div className="field_and_label">
              <Field
                onFocus={() => {
                  setIsNameBlur(true);
                }}
                required
                name={`data.${index}.value`}
              />

              <Select
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: "#33426a",
                  },
                })}
                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                options={colourOptions}
                styles={colourStyles}
                value={colourOptions.find((obj) => obj.color === values?.data?.[index]?.color)}
                onChange={(newValue: any) => {
                  setFieldValue(`data.${index}.color`, newValue?.color);
                }}
                name={`data.${index}.color`}
                isDisabled={disabled}
              />
            </div>

            <IconButton aria-label="delete" onClick={() => handleRemoveName(arrayHelpers, index)}>
              <DeleteOutlineIcon />
            </IconButton>
          </div>
          {isNameBlur && (
            <>
              <div
                className="flag_and_score_container"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
                  sx={{ marginLeft: "25px" }}
                  control={
                    <Checkbox
                      size="small"
                      defaultChecked={false}
                      name={`data.${index}.is_flagged`}
                      checked={values?.data?.[index]?.is_flagged}
                      onChange={(event) => {
                        setFieldValue(`data.${index}.is_flagged`, event.target.checked);
                      }}
                    />
                  }
                  label="Marked as flagged"
                />
                {scoringData && (
                  <div
                    className="score_text_wrapper"
                    style={{
                      marginRight: "33px",
                    }}
                  >
                    {" "}
                    Score &nbsp;
                    {values?.data?.[index]?.scoreStatus ? (
                      <Chip
                        label={values?.data?.[index]?.score}
                        size="small"
                        sx={{
                          marginRight: "10px",
                          marginLeft: "5px",
                          borderRadius: "5px",
                        }}
                        onDelete={() => setFieldValue(`data.${index}.scoreStatus`, false)}
                        deleteIcon={<DriveFileRenameOutlineIcon />}
                        variant="outlined"
                      />
                    ) : (
                      <TextField
                        variant="standard"
                        value={values?.data?.[index]?.score}
                        type="number"
                        sx={{
                          backgroundColor: "#f9fafb",
                          marginRight: "10px",
                        }}
                        InputProps={{
                          disableUnderline: true,
                        }}
                        onChange={(event) =>
                          setFieldValue(`data.${index}.score`, event.target.value)
                        }
                        onBlur={() => setFieldValue(`data.${index}.scoreStatus`, true)}
                      />
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div id="MCRForm">
      {loading && <FullPageLoader></FullPageLoader>}
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values) => {
          mcrSubmitHandler(values);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <label
              htmlFor={`Response`}
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                marginTop: "-1rem",
                marginLeft: "2rem",
              }}
            >
              Response
            </label>

            {values.data.length === 0 && !loading && (
              <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
                <NoDataFound title="Multiple Response Set" isButtonDisplayed={false} />
              </Stack>
            )}
            <FieldArray name="data">
              {(arrayHelpers: any) => (
                <>
                  {values.data.map((_, index) => (
                    <Name
                      key={index}
                      name={values.data[index]?.value}
                      index={index}
                      arrayHelpers={arrayHelpers}
                      values={values}
                      setFieldValue={setFieldValue}
                    />
                  ))}

                  <Button onClick={() => handleAddName(arrayHelpers)}>
                    {" "}
                    <span
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 500,
                        marginRight: "0.25rem",
                        marginTop: "-0.14rem",
                      }}
                    >
                      +
                    </span>{" "}
                    Add new response
                  </Button>
                </>
              )}
            </FieldArray>
            <Divider />

            <div className="footer_content">
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{
                  marginRight: "0.5rem",
                }}
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="small" variant="contained">
                {" "}
                Save and Apply
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MCRForm;
