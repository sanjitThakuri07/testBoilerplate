import React, { FC, useEffect } from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import { useDrag, useDrop } from "react-dnd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSnackbar } from "notistack";
import { getAPI } from "src/lib/axios";
import { Stack } from "@mui/system";
import NoDataFound from "src/components/NoDataFound";
import FullPageLoader from "src/components/FullPageLoader";
import { v4 as uuidv4 } from "uuid";

export interface GRSFormProps {
  data: string[];
  heading?: string;
  grsSubmitHandler?: any;
  initialValues: any;
  setInitialValues: any;
  setAltInitialValues: any;
  altInitialValues: any;
  setQuestionValue: any;
  disabled?: boolean;
  setOpenModal?: any;
}

interface ResponseSetIdI {
  responseSetId: number | null;
  updateState?: Function;
}

const GRSForm = ({
  grsSubmitHandler,
  responseSetId,
  setInitialValues,
  initialValues,
  setAltInitialValues,
  altInitialValues,
  setQuestionValue,
  setOpenModal,
  updateState,
  disabled,
}: GRSFormProps & ResponseSetIdI) => {
  const [count, setCount] = React.useState<number>(1);
  const [searchText, setSearchText] = React.useState<string>("");
  const [responseData, setResponseData] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();

  let newArr: any = [];

  const fetchEditData = async () => {
    setLoading(true);
    await getAPI(`global-response/${responseSetId}`).then((res: { data: any; status: any }) => {
      try {
        if (res.status === 200) {
          res?.data?.options?.map((item: any) => {
            newArr.push(item);
          });

          setInitialValues({ data: newArr, heading: res?.data?.name });
          setAltInitialValues({ data: newArr, heading: res?.data?.name });
          setQuestionValue(res?.data?.name);
          setLoading(false);
        }
      } catch (e) {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    });
  };

  useEffect(() => {
    if (!searchText) {
      setInitialValues(altInitialValues);
    } else {
      let filteredSearch = initialValues.data.filter((item: any) =>
        item?.name?.toLowerCase().includes(searchText.toLowerCase()),
      );
      setInitialValues({ data: filteredSearch, heading: altInitialValues.heading });
    }
  }, [searchText]);

  useEffect(() => {
    if (responseSetId) {
      fetchEditData();
    } else {
      setQuestionValue("Untitled Response Set");
      setInitialValues({ data: ["New Response Set"], heading: "" });
      setInitialValues({ data: ["New Response Set"], heading: "" });
    }
  }, [responseSetId]);

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

  const Name: FC<{ name: string; index: number; arrayHelpers: any; disabled?: boolean }> = ({
    name,
    index,
    arrayHelpers,
    disabled,
  }) => {
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

    return (
      <div ref={drop} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div ref={drag}>
          <div id="custom_drag_text_field">
            {!disabled && (
              <div className="draggable_icon">
                <IconButton>
                  <img src="/assets/icons/dots.svg" alt="Drag" height={20} width={20} />
                </IconButton>
              </div>
            )}
            <Field
              required
              name={`data.${index}.name`}
              value={name}
              disabled={disabled}
              className={disabled ? "disabled" : ""}
              style={{ width: "100%", borderRadius: "10px" }}
            />
            {!disabled && (
              <IconButton aria-label="delete" onClick={() => handleRemoveName(arrayHelpers, index)}>
                <DeleteOutlineIcon />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="GRSForm">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values) => {
          grsSubmitHandler && grsSubmitHandler(values);
        }}
      >
        {({ values }) => {
          return (
            <Form>
              {responseSetId && (
                <TextField
                  fullWidth
                  id="fullWidth"
                  placeholder="Search here"
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  onKeyPress={(e) => {
                    e.key === "Enter" && e.preventDefault();
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              <FieldArray name="data">
                {(arrayHelpers: any) => (
                  <>
                    {values.data.map((_: any, index: any) => (
                      <>
                        <Name
                          key={index}
                          name={values.data[index]?.name}
                          index={index}
                          arrayHelpers={arrayHelpers}
                          disabled={disabled}
                        />
                      </>
                    ))}

                    {loading && <FullPageLoader></FullPageLoader>}

                    {values.data.length === 0 && !loading && (
                      <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
                        <NoDataFound title="Global Response Set" isButtonDisplayed={false} />
                      </Stack>
                    )}

                    {!disabled && (
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
                    )}
                  </>
                )}
              </FieldArray>
              <Divider
                style={{
                  marginTop: "1rem",
                }}
              />

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
                {!disabled && (
                  <Button type="submit" size="small" variant="contained">
                    {" "}
                    Save and Apply
                  </Button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default GRSForm;
