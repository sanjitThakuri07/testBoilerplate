import BackButton from "src/components/buttons/back";
import {
  Container,
  Typography,
  Stack,
  Box,
  Grid,
  InputLabel,
  OutlinedInput,
  Button,
  IconButton,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
} from "@mui/material";
import React, { ChangeEvent, useRef, useState } from "react";
import "./invoiceGenerate.scss";
import { useNavigate, useParams } from "react-router-dom";
import { Field, Form, Formik, FormikProps } from "formik";
import MultiEmailCustom from "src/components/MultiEmail/MultiEmail2";
import ButtonLoaderSpinner from "src/components/ButtonLoaderSpinner/ButtonLoaderSpinner";
import EmailTextEditor from "src/components/TextEditor/EmailTextEditor";
import { deleteAPI, getAPI, postAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useBillingInvoceData } from "src/store/zustand/globalStates/invoice/invoice";
import TextEditor from "src/components/MyTextEditor/MyEditor";
import { fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import FullPageLoader from "src/components/FullPageLoader";

interface EmailIdEditorI {
  emailTo: string[];
  emailCc: string[];
  emailBcc: string[];
  subject: string;
  include_attachment: boolean;
  content?: string;
}

export const SendInvoice = () => {
  const [open, setOpen] = React.useState(false);
  const [initialValue, setInitialValue] = React.useState<any>({
    emailTo: [],
    emailBcc: [],
    emailCc: [],
    subject: "",
    include_attachment: true,
    content: "",
  });

  const [contentState, setContentState] = React.useState<string | null>(``);
  const [collectionOfBackendFields, setCollectionOfBackendFields] = React.useState<any>([]);
  const [backendTags, setBackEndTags] = React.useState([]);
  const [selectedText, setSelectedText] = React.useState("");
  const [fileList, setFileList] = React.useState([]);
  const [uploadedFiles, setUploadedFiles] = React.useState<any>([]);
  const [isIncludeInvoiceChecked, setIsIncludeInvoiceChecked] = React.useState(false);
  const [invoiceURL, setInvoiceURL] = React.useState("");

  const [fileUploadLoading, setFileUploadLoading] = React.useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [uploadingStatus, setUploadingStatus] = React.useState<boolean>(false);

  const { invoiceData, setInvoiceData } = useBillingInvoceData();

  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [loading, setLoading] = useState(false);

  // General Function
  const refContainer = useRef<HTMLDivElement>(null);

  const focusEditor = () => {
    return refContainer?.current?.focus();
  };

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const getAllInvoicedDatas = async (): Promise<void> => {
    try {
      const { status, data } = await getAPI(`invoice/${invoiceId}`);

      if (status === 200) {
        setInitialValue((prev: any) => ({
          ...prev,
          emailTo: data?.customer_invoice_email,
          subject: `Invoice for Booking ${data?.invoice_number}`,
        }));
      }
    } catch (error) {}
  };

  const getContent = async ({ url }: any) => {
    await fetchIndividualApi({
      setterLoading: setLoading,
      setterFunction: (data: any) => {
        setInitialValue((prev: any) => ({
          ...prev,
          content: `<p>Hi,</p><p>Please find the invoice link below</p><p>  <a target='_blank' type='button' onclick="window.open('${data?.url}')"  href="${data?.url}" style="background-color: #283452; border: none; color: #ffffff;  text-decoration: none; border-radius: 4px; padding: 5px 8px; ">Invoice Link</a> </p><p>Thanks</p>`,
        }));
        getAllInvoicedDatas();
      },
      url,
      id: invoiceId,
    });
    setLoading(false);
  };
  React.useEffect(() => {
    getContent({ url: "invoice/invoice-link" });

    // getAPI(`invoice/invoice-link/${invoiceId}`)
    //   .then((res) => {
    //     setInvoiceURL(res?.data?.url);
    //     if (res.data.url) {
    //       setInitialValue((prev: any) => ({
    //         ...prev,
    //         content: `<p>Hi,</p><p>Please find the invoice link below</p><p><a href="${res?.data?.url}">${res?.data?.url}</a></p><p>Thanks</p>`,
    //       }));
    //     }
    //   })
    //   .catch((err) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  const handleDeleteAttachment = (id: number) => {
    deleteAPI(`invoice/invoice-attachments/${invoiceId}/`, [id])
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar(res?.data?.message, { variant: "success" });
        }
      })
      .catch((err) => {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      });
  };

  const handleFileUpload = () => {
    const convertToBase64 = (file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const convertFilesToBase64 = async (files: any) => {
      setUploadingStatus(true);
      let file_desc: string[] = [];
      try {
        const base64Files = await Promise.all(
          // attach file name and size to binary file
          Array.from(files).map(
            async (file: any) =>
              file.size / 1000 + " KB--" + file.name + ";" + (await convertToBase64(file)),
          ),

          // Array.from(files).map((file) => convertToBase64(file)),
        );

        let payload = {
          invoice_id: invoiceId,
          attachment: base64Files,
        };

        postAPI("/invoice/invoice-attachments", payload)
          .then((res) => {
            setFileUploadLoading(false);

            // setUploadedFiles(res?.data?.data);
            setUploadedFiles((prev: any) => [...prev, ...res?.data?.data]);
            enqueueSnackbar("files uploaded successfully", { variant: "success" });
            setUploadingStatus(false);
          })
          .catch((err) => {
            setFileUploadLoading(false);
            enqueueSnackbar("Something went wrong", { variant: "error" });
          });
      } catch (error) {
        setUploadingStatus(false);
      }
    };
    setUploadingStatus(false);

    convertFilesToBase64(fileList);
  };

  //

  React.useEffect(() => {
    if (fileList?.length > 0) handleFileUpload();
  }, [fileList]);

  const SaveProceedHandler = (values: EmailIdEditorI, { setSubmitting }: any) => {
    const payload = {
      to: values.emailTo,
      cc: values.emailCc,
      bcc: values.emailBcc,
      subject: values.subject,
      body: values.content,
      invoice: Number(invoiceId),
      // email_template: '1',
      include_invoice: values.include_attachment,
      documents: uploadedFiles.map((item: any) => item.attachment),
    };

    postAPI("/invoice/invoice-send", payload)
      .then((res) => {
        setSubmitting(false);
        // setOpen(false);
        navigate("/finance/invoice/invoices");
        enqueueSnackbar(res?.data?.message, { variant: "success" });
      })
      .catch((err) => {
        setSubmitting(false);
        enqueueSnackbar(err?.response?.data?.detail?.message ?? "Something went wrong", {
          variant: "error",
        });
      });
  };
  if (loading) {
    return (
      <>
        <FullPageLoader />
      </>
    );
  }

  return (
    <div id="SendInvoice">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={uploadingStatus}
        autoHideDuration={3000}
        onClose={() => setUploadingStatus(false)}
      >
        <Alert onClose={() => setUploadingStatus(false)} severity="info" sx={{ width: "100%" }}>
          Uploading files...
        </Alert>
      </Snackbar>
      <Container fixed>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <BackButton
              open={open}
              setOpen={setOpen}
              onBackAction={() => {
                navigate("-1");
              }}
            />
            <Stack direction="column">
              <Typography variant="h1" sx={{ my: 2 }}>
                Send Invoice
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ zIndex: 1, cursor: "pointer" }}></Box>
        </Stack>

        <div className="SendInvoice_container">
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

                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  // React.useEffect(() => {
                  //   if (values.include_attachment) {
                  //     getAPI(`invoice/invoice-link/${invoiceId}`)
                  //       .then((res) => {
                  //         setInvoiceURL(res?.data?.url);
                  //         if (res.data.url) {
                  //           setFieldValue(
                  //             'content',
                  //             contentState +
                  //               `<p>Hi,</p><p>Please find the invoice link below</p><p><a href="${res?.data?.url}">${res?.data?.url}</a></p><p>Thanks</p>`,
                  //           );
                  //         }
                  //       })
                  //       .catch((err) => {});
                  //   } else if (!values.include_attachment) {
                  //     setInvoiceURL('');
                  //     setFieldValue('content', '');
                  //   }
                  // }, [values.include_attachment]);

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
                              />
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>

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
                            <div className="label-heading">CC</div>
                          </InputLabel>
                        </Grid>
                        <Grid item xs={9}>
                          <Stack direction="column" sx={{ width: "100%" }}>
                            <Box>
                              <MultiEmailCustom
                                placeholder=""
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
                            <div className="label-heading">bcc</div>
                          </InputLabel>
                        </Grid>
                        <Grid item xs={9}>
                          <Stack direction="column" sx={{ width: "100%" }}>
                            <Box>
                              <MultiEmailCustom
                                placeholder=""
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
                            <div className="label-heading">
                              Subject <sup>*</sup>{" "}
                            </div>
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
                      </Grid>
                      <Box id="AddInvoiceModal">
                        {/* <EmailTextEditor
                          setContentState={setContentState}
                          selectOptionWhole={collectionOfBackendFields}
                          selectedText={selectedText}
                          setSelectedText={setSelectedText}
                          setSelectOptionWhole={setCollectionOfBackendFields}
                          backendFields={backendTags}
                          templateHeight={true}
                          contentValueState={contentState}
                          values={values}
                          simpleTextEditor={true}
                        />
                        <div onClick={focusEditor} className="editor__content"></div> */}
                        <Box
                          sx={{
                            marginBottom: "10px",
                            borderBottom: "1px solid #eaecf0 !important",
                          }}
                        >
                          <TextEditor
                            name="content"
                            disabled={false}
                            initialContent={values?.content}
                            reinitialize={values?.emailTo}
                            //to reinitialize the editor, when the title is changed  the editor is reinitialized
                          />
                        </Box>
                        {/* <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            alignItems: 'center',
                          }}>
                          <FormControlLabel
                            name="include_attachment"
                            // value={values.include_attachment}
                            onChange={(
                              event: React.SyntheticEvent<Element, Event>,
                              checked: boolean,
                            ) => {
                              const target = event.target as HTMLInputElement;
                              setFieldValue('include_attachment', target.checked);
                              // setIsIncludeInvoiceChecked(target.checked);
                              // if (target.checked) {
                              //   getAPI(`invoice/invoice-link/${invoiceId}`)
                              //     .then((res) => {
                              //       setInvoiceURL(res?.data?.url);
                              //       if (res.data.url) {
                              //         setFieldValue(
                              //           'content',
                              //           contentState +
                              //             `<p>Hi,</p><p>Please find the invoice link below</p><p><a href="${res?.data?.url}">${res?.data?.url}</a></p><p>Thanks</p>`,
                              //         );
                              //       }
                              //     })
                              //     .catch((err) => {});
                              // }
                            }}
                            control={
                              <Checkbox
                                size="small"
                                defaultChecked={values.include_attachment ? true : false}
                              />
                            }
                            label="include invoice"
                            labelPlacement="end"
                          />
                        </Stack> */}

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            alignItems: "center",
                          }}
                        >
                          <LoadingButton
                            // onClick={handleClick}
                            startIcon={<AttachFileIcon />}
                            loading={false}
                            loadingPosition="end"
                            style={{
                              // borderRadius: '18px',
                              minHeight: "33px",
                            }}
                            onClick={() => {
                              inputRef.current?.click();
                            }}
                            variant="outlined"
                          >
                            <span>
                              Attach Attachment{" "}
                              <span
                                style={{
                                  color: "#D0D5DD",
                                }}
                              >
                                {" "}
                                (max. 15MB){" "}
                              </span>{" "}
                            </span>
                            <input
                              type="file"
                              ref={inputRef}
                              style={{ display: "none" }}
                              multiple
                              onChange={(e: any) => {
                                setFileList(e?.target?.files);
                              }}
                              max={10}
                            />
                          </LoadingButton>

                          {uploadedFiles?.map((file: any, index: number) => {
                            const attachment = file?.attachment;
                            const attachmentSplit = attachment?.split("--");
                            const attachmentName = attachmentSplit?.[1];
                            return (
                              <Chip
                                key={index}
                                label={attachmentName}
                                variant="outlined"
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = process.env.VITE_HOST_URL + "/" + attachment;
                                  link.target = "_blank";
                                  link.click();
                                }}
                                onDelete={() => {
                                  // TODO: delete file from server
                                  const newFileList = [...uploadedFiles];
                                  newFileList.splice(index, 1);
                                  setUploadedFiles(newFileList);
                                  handleDeleteAttachment(file?.id);
                                }}
                              />
                            );
                          })}

                          {/* <Chip
                            label="Clickable Deletable"
                            variant="outlined"
                            onClick={handleFileClick}
                            onDelete={handleFileDelete}
                          /> */}
                        </Stack>
                        <div className="file__list"></div>
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
                            <Button
                              variant="outlined"
                              type="button"
                              onClick={() => {
                                navigate(-1);
                              }}
                            >
                              Cancel
                            </Button>
                          </Grid>
                        </div>
                        <Grid item>
                          <Button
                            disabled={isSubmitting ? true : false}
                            variant="contained"
                            type="submit"
                            sx={{ width: "160px" }}
                          >
                            {/* {isSubmitting ? <ButtonLoaderSpinner /> : 'Send'} */}
                            send
                          </Button>
                        </Grid>
                      </Stack>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Box>
        </div>
      </Container>
    </div>
  );
};
