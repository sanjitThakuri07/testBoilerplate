import { Box, Button, Grid, OutlinedInput, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import MultiEmailCustom from "src/components/MultiEmail/MultiEmail2";
import TextEditor from "src/components/MyTextEditor/MyEditor";
import { patchApiData, putApiData } from "src/modules/apiRequest/apiRequest";
import { useReportLayoutDataSets } from "src/store/zustand/report/ReportStoreDataSets";
import { Field, Form, Formik, FormikProps } from "formik";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

export default function ReportEmailComponent({ currentLayout }: any) {
  const initialValues = {
    emailTo: [],
    emailBcc: [],
    emailCc: [],
    subject: "",
    include_attachment: true,
    content: "",
  };
  const { updateLayoutProperties } = useReportLayoutDataSets();
  const { inspectionId } = useParams();
  const [isSending, setIsSending] = useState(false);
  const [initial, setInitial] = useState(initialValues);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const getContent = async ({ url }: any) => {
    // setLoading(true);
    await patchApiData({
      // setterLoading: setLoading,
      setterFunction: (data: any) => {},
      url,
      id: currentLayout?.id,
      queryParam: {
        inspection_id: inspectionId,
      },
      enqueueSnackbar,
    });
    // setLoading(false);
  };

  // fetch org users
  useEffect(() => {
    if (currentLayout?.id) {
      getContent({ url: "template-reportgenerate-link" });
    }
  }, [currentLayout?.id]);

  const emailSubmitHandler = async (actions: any, values: any) => {
    const { emailTo, emailCc, emailBcc, subject, content } = values;
    const payload = {
      to: emailTo,
      cc: emailCc,
      bcc: emailBcc,
      subject,
      body: content,
    };
    await putApiData({
      id: currentLayout?.id,
      url: `template-report/report-send`,
      values: payload,
      enqueueSnackbar,
      setterLoading: setIsSending,
      setterFunction: (dummy: any) => {
        actions.resetForm();
        setInitial(initialValues);
      },
    });
  };

  console.log({});

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Box sx={{ fontWeight: 500, fontSize: "17px" }}>Report Access</Box>

        <Box sx={{ alignItems: "center", display: "flex" }}>
          <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: "18px" }} />
        </Box>
      </Stack>

      <Formik
        initialValues={initial}
        onSubmit={(values: any, actions: any) => {
          emailSubmitHandler(actions, values);
        }}
      >
        {(props: FormikProps<any>) => {
          const {
            values,
            handleChange,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
            handleBlur,
          } = props;
          return (
            <Form>
              <Stack direction="column" spacing={1.5}>
                {/* to email */}
                <Grid container justifyContent={"center"} alignItems={"center"}>
                  <Grid item xs={12}>
                    <Stack direction="column" sx={{ width: "100%" }}>
                      <Box>
                        <MultiEmailCustom
                          placeholder="To"
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
                        />
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Grid container justifyContent={"center"} alignItems={"center"}>
                  <Grid item xs={12}>
                    <Stack direction="column" sx={{ width: "100%" }}>
                      <Box>
                        <MultiEmailCustom
                          placeholder="CC"
                          value={
                            values.emailCc?.length
                              ? values?.emailCc?.[0]?.includes("@")
                                ? values?.emailCc
                                : []
                              : []
                          }
                          onChange={(emails: string[]) => {
                            setFieldValue("emailCc", emails);
                            setFieldTouched("emailCc", true);
                          }}
                        />
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Grid container justifyContent={"center"} alignItems={"center"}>
                  <Grid item xs={12}>
                    <Stack direction="column" sx={{ width: "100%" }}>
                      <Box>
                        <MultiEmailCustom
                          placeholder="BCC"
                          value={
                            values.emailBcc?.length
                              ? values?.emailBcc?.[0]?.includes("@")
                                ? values?.emailBcc
                                : []
                              : []
                          }
                          onChange={(emails: string[]) => {
                            setFieldValue("emailBcc", emails);
                            setFieldTouched("emailBcc", true);
                          }}
                        />
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                {/* subject */}
                <Grid item xs={12}>
                  <Stack direction="column" sx={{ width: "100%" }}>
                    <Box>
                      <Field
                        as={OutlinedInput}
                        size="small"
                        id="subject"
                        type="text"
                        fullWidth
                        required
                        placeholder="Enter email subject"
                        className="form_input"
                        value={values.subject}
                        error={errors.subject && touched.subject ? true : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Box>
                  </Stack>
                </Grid>

                {/* attachment body */}
                {/* <Box sx={{ position: "relative" }}>
                  <TextareaAutosize
                    style={{
                      outline: "none",
                      resize: "none",
                      width: "80%",
                    }}
                    name={"body"}
                    value={values?.body}
                    minRows={3}
                    placeholder="Body"
                    id="w3review"
                    onChange={handleChange}
                    className="text__area-style_report"
                  />
                  <MultiUploader
                    setOpenMultiImage={setOpenMultiImage}
                    openMultiImage={openMultiImage}
                    // initialData={values?.[`${name}s`]?.attachments || []}
                    For={"Objects"}
                    //   initialData={}
                    clearData={clearData}
                    setClearData={setClearData}
                    maxFileSize={2}
                    requireDescription={false}
                    accept={{
                      "image/jpeg": [".jpeg", ".jpg"],
                      "image/png": [".png"],
                      "application/pdf": [".pdf"],
                    }}
                    icon={
                      <div className="attach__files-icon">
                        <AttachFileIcon></AttachFileIcon>
                      </div>
                    }
                    getFileData={(files: any) => {
                      setFieldValue("fileUpload", files);
                    }}
                  />
                </Box> */}
                <div id="send_email">
                  <TextEditor name="content" initialContent={values?.content} />
                </div>
              </Stack>

              <Button
                sx={{ height: "100%px", width: "100%", mt: 2 }}
                disabled={location?.pathname?.includes("/template/layout") ? true : false}
                variant="contained"
                type="submit"
              >
                {isSending ? <ButtonLoaderSpinner /> : "Send"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
