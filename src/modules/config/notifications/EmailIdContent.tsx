import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EmailTextEditor from "src/components/TextEditor/EmailTextEditor";
// import BackButton from 'src/components/buttons/back';
import { Field, Form, Formik, FormikProps } from "formik";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import { EmailIdContentSchema } from "src/components/validationSchema";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import SaveIcon from "src/assets/icons/save_icon.svg";
import { useAlertPopup } from "globalStates/alertPopup";
import MultiSelect from "./MultipleSelect";
import MultiEmailCustom from "src/components/MultiEmail/MultiEmail2";

interface EmailIdEditorI {
  emailTo: string[];
  subject: string;
}

const BackButton = ({ handleBack, onBackAction }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          onBackAction?.(false);
        }}
        startIcon={<img src="/assets/icons/back.svg" alt="back button" />}
        sx={{
          textTransform: "capitalize",
        }}
      >
        Back
      </Button>

      <ConfirmationModal
        openModal={open}
        setOpenModal={setOpen}
        confirmationIcon={SaveIcon}
        handelConfirmation={() => {
          onBackAction?.(false);
        }}
        confirmationHeading={"Are you sure you want to go back?"}
        confirmationDesc={"Any unsaved changes shall not be stored in the system."}
        status={"Normal"}
        IsSingleBtn={false}
      />
    </>
  );
};

export default function EmailIdContent({
  setEmailOpen,
  backendFieldsForEmail,
  setInForm,
  parentValues,
  parentFormik,
  disabled,
  fetchAPIFunction,
}: any) {
  const [initialValue, setInitialValue] = React.useState<any>({
    emailTo: [],
    subject: "",
  });

  const { selectedSearchModule } = useAlertPopup();

  const [contentState, setContentState] = React.useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [collectionOfBackendFields, setCollectionOfBackendFields] = useState<any>([]);
  const [backendTags, setBackEndTags] = useState([]);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    if (backendFieldsForEmail?.length) {
      setBackEndTags(
        backendFieldsForEmail?.map((data: any, index?: number) => ({
          label: data,
          value: data,
        })),
      );
    }
  }, [backendFieldsForEmail?.length]);

  useEffect(() => {
    if (collectionOfBackendFields?.length) {
      setSelectedText(collectionOfBackendFields?.slice().reverse()?.[0]);
    }
  }, [collectionOfBackendFields]);

  const SaveProceedHandler = async (values: any, actions: any) => {
    if (disabled) return;
    setInForm({ values, content: contentState });
    setEmailOpen?.(false);
  };

  useEffect(() => {
    if (parentValues?.to?.length || parentValues?.subject || parentValues?.content) {
      setInitialValue({
        emailTo: parentValues?.to || [],
        subject: parentValues?.subject,
        id: parentValues?.id,
      });
      setContentState(parentValues?.content);
    }
  }, [parentValues?.to?.length, parentValues?.subject, parentValues?.content]);

  return (
    <Box sx={{ padding: "29px 24px" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <BackButton
            open={open}
            setOpen={setOpen}
            onBackAction={() => {
              setEmailOpen?.(false);
            }}
          />
          <Stack direction="column">
            <Typography variant="h1" sx={{ my: 5 }}>
              Provide Email ID Content
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ zIndex: 1, cursor: "pointer" }}></Box>
      </Stack>
      <Box className="box-shadow-wrapper" sx={{ background: "#fff" }}>
        <Box sx={{ padding: "25px 20px" }}>
          <Formik initialValues={initialValue} enableReinitialize onSubmit={SaveProceedHandler}>
            {(props: FormikProps<EmailIdEditorI>) => {
              const {
                values,
                touched,
                errors,
                handleBlur,
                handleChange,
                isValid,
                dirty,
                isSubmitting,
                setFieldValue,
                setFieldTouched,
              } = props;

              return (
                <Form className="region-form">
                  {/* Email To */}
                  <Grid container className="email-form-container">
                    <Grid item xs={2}>
                      <InputLabel
                        htmlFor="name"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <div className="label-heading">To</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={9}>
                      <Stack direction="column" sx={{ width: "100%" }}>
                        <Box>
                          <MultiEmailCustom
                            placeholder=""
                            value={
                              values.emailTo?.length
                                ? values?.emailTo?.[0]?.includes("@")
                                  ? values?.emailTo
                                  : []
                                : []
                            }
                            onChange={(emails: string[]) => {
                              setFieldValue("emailTo", emails);
                              setFieldTouched("emailTo", true);
                            }}
                            disabled={disabled}
                          />
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                  {/* subject */}
                  <Grid container className="email-form-container">
                    <Grid item xs={2}>
                      <InputLabel
                        htmlFor="name"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <div className="label-heading">Subject</div>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={9}>
                      <Stack direction="column" sx={{ width: "100%" }}>
                        <Box>
                          <Field
                            as={OutlinedInput}
                            size="small"
                            id="subject"
                            type="text"
                            fullWidth
                            placeholder="Enter email subject"
                            className={`form_input ${disabled ? "disabled" : ""}`}
                            value={values.subject}
                            error={errors.subject && touched.subject ? true : false}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={disabled}
                          />
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Box>
                    <EmailTextEditor
                      setContentState={setContentState}
                      selectOptionWhole={collectionOfBackendFields}
                      selectedText={selectedText}
                      setSelectedText={setSelectedText}
                      setSelectOptionWhole={setCollectionOfBackendFields}
                      backendFields={backendTags}
                      templateHeight={true}
                      contentValueState={contentState}
                      values={parentValues}
                      parentFormik={parentFormik}
                      disabled={disabled}
                      fetchAPIFunction={fetchAPIFunction}
                    />
                  </Box>
                  {/* submit button */}
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="flex-end"
                    mt={2}
                  >
                    <div className="add_another_btn">
                      <Grid item>
                        <Button variant="outlined" type="submit">
                          Cancel
                        </Button>
                      </Grid>
                    </div>
                    {!disabled && (
                      <Grid item>
                        <Button
                          disabled={isSubmitting ? true : false}
                          variant="contained"
                          type="submit"
                          sx={{ width: "160px" }}
                        >
                          {isSubmitting ? <ButtonLoaderSpinner /> : "Add Email Content"}
                        </Button>
                      </Grid>
                    )}
                  </Stack>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}
