import { FieldArray } from 'formik';
import React from 'react';

// individual findings
const FindingsAndRecommendationsField = ({
  object,
  parentIndex,
  selfIndex,
  name,
  label,
  formikProps,
}) => {
  let {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isValid,
    dirty,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
  } = formikProps;
  const [openMultiImage, setOpenMultiImage] = useState(false);

  function getIsErrorAndValue({
    touched,
    errors,
    name,
    selfIndex,
    parentIndex,
    field,
    parentField,
    values,
  }) {
    let touch = '';
    let error = '';
    let value = '';

    if (name === 'finding') {
      touched =
        touched &&
        touched[`${name}s}`] &&
        touched[`${name}s}`][selfIndex] &&
        touched[`${name}s}`][selfIndex][field];
      error =
        errors &&
        errors[`${name}s}`] &&
        errors[`${name}s}`][selfIndex] &&
        errors[`${name}s}`][selfIndex][field];

      value = values?.[`${name}s`]?.[selfIndex][field];
      if (field === 'attachments') {
        if (value?.length) {
          value = [{ documents: value?.map((data) => data?.attachment), title: '' }];
        }
      }
    } else {
      touch =
        touched &&
        touched[parentField] &&
        touched[parentField][parentIndex] &&
        touched[parentField][parentIndex][`${name}s}`] &&
        touched[parentField][parentIndex][`${name}s}`][selfIndex] &&
        touched[parentField][parentIndex][`${name}s}`][selfIndex][field];
      error =
        errors &&
        errors[parentField] &&
        errors[parentField][parentIndex] &&
        errors[parentField][parentIndex][`${name}s}`] &&
        errors[parentField][parentIndex][`${name}s}`][selfIndex] &&
        errors[parentField][parentIndex][`${name}s}`][selfIndex][field];
      value = values?.[parentField]?.[parentIndex]?.[`${name}s`]?.[selfIndex]?.[field];
    }

    return { isError: Boolean(touch && error), message: error, value };
  }

  function getTitle() {
    let title = '';
    if (searchObject['findings']) {
      title = `Recommendation ${(selfIndex + 1)?.toString()?.padStart(2, 0)}`;
    } else {
      title = `${name} ${(selfIndex + 1)?.toString()?.padStart(2, 0)}`;
    }

    return title;
  }

  return (
    <div className={`individual__${name !== 'finding' ? name : ''} for__recommendations`}>
      <Grid container spacing={4} className="formGroupItem text-area">
        <Grid item xs={4}>
          <InputLabel htmlFor="notes">
            <div className="label-heading  align__label">{getTitle()}</div>
          </InputLabel>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{ flexDirection: 'column', display: 'grid' }}
          className="pin__box nested__input-alignment">
          <FormGroup className="input-holder">
            <TextareaAutosize
              minRows={3}
              id="w3review"
              onChange={handleChange}
              className="text__area-style"
              inputProps={{ maxLength: 1 }}
              name={
                name === 'finding'
                  ? `${name}s[${selfIndex}].description`
                  : `findings[${parentIndex}][${name}s][${selfIndex}].description`
              }
              value={
                name === 'finding'
                  ? getIsErrorAndValue({
                      touched,
                      errors,
                      name,
                      selfIndex,
                      field: 'description',
                      values,
                    })?.value
                  : getIsErrorAndValue({
                      touched,
                      errors,
                      name,
                      selfIndex,
                      field: 'description',
                      parentIndex,
                      parentField: 'findings',
                      values,
                    })?.value
              }
              error={
                name === 'finding'
                  ? getIsErrorAndValue({ touched, errors, name, selfIndex, field: 'description' })
                      ?.isError
                  : getIsErrorAndValue({
                      touched,
                      errors,
                      name,
                      selfIndex,
                      field: 'description',
                      parentIndex,
                      parentField: 'findings',
                    })?.isError
              }
              maxLength={300}
            />
            <FormHelperText>
              {300 -
                Number(
                  (name === 'finding'
                    ? values?.findings?.[`${selfIndex}`]?.description?.length
                    : values?.findings?.recommendation?.[`${selfIndex}`]?.description?.length) || 0,
                )}
              {` characters left`}
            </FormHelperText>
            {name === 'finding'
              ? getIsErrorAndValue({ touched, errors, name, selfIndex, field: 'description' })
                  ?.isError
              : getIsErrorAndValue({
                  touched,
                  errors,
                  name,
                  selfIndex,
                  field: 'description',
                  parentIndex,
                  parentField: 'findings',
                })?.isError && (
                  <FormHelperText error>
                    {name === 'finding'
                      ? getIsErrorAndValue({
                          touched,
                          errors,
                          name,
                          selfIndex,
                          field: 'description',
                        })?.message
                      : getIsErrorAndValue({
                          touched,
                          errors,
                          name,
                          selfIndex,
                          field: 'description',
                          parentIndex,
                          parentField: 'findings',
                        })?.message}
                  </FormHelperText>
                )}
          </FormGroup>
          <MultiUploader
            setOpenMultiImage={setOpenMultiImage}
            openMultiImage={openMultiImage}
            // initialData={values?.[`${name}s`]?.attachments || []}
            For={'Objects'}
            initialData={
              name === 'finding'
                ? getIsErrorAndValue({
                    touched,
                    errors,
                    name,
                    selfIndex,
                    field: 'documents',
                    values,
                  })?.value
                : getIsErrorAndValue({
                    touched,
                    errors,
                    name,
                    selfIndex,
                    field: 'documents',
                    parentIndex,
                    parentField: 'findings',
                    values,
                  })?.value || []
            }
            clearData={clearData}
            setClearData={setClearData}
            maxFileSize={2}
            requireDescription={false}
            accept={{
              'image/jpeg': ['.jpeg', '.jpg'],
              'image/png': ['.png'],
              'application/pdf': ['.pdf'],
            }}
            icon={
              <div className="attach__files-icon">
                <AttachFileIcon></AttachFileIcon>
              </div>
            }
            getFileData={(files = []) => {
              // files: [{ documents: any[]; title: string }
              // here you get the selected files do what you want to accordingly
              let formattedFiles = files[0]?.documents?.map((doc) => {
                return doc?.base64 ? `${doc?.formatedFileSize}--${doc?.name};${doc?.base64}` : doc;
              });

              setFieldValue(
                name === 'finding'
                  ? `${name}s[${selfIndex}].documents`
                  : `findings[${parentIndex}][${name}s][${selfIndex}].documents`,
                files || [],
              );
              setFieldValue(
                name === 'finding'
                  ? `${name}s[${selfIndex}].attachments`
                  : `findings[${parentIndex}][${name}s][${selfIndex}].attachments`,
                formattedFiles || [],
              );
            }}
          />
        </Grid>
      </Grid>

      {/* <FieldArray name={`findings[${parentIndex}].recommendations`}></FieldArray> */}
      {name?.toLowerCase() === 'finding' && !searchObject['findings'] && (
        <Grid container spacing={4} className="formGroupItem nested__input-alignment">
          <Grid
            item
            xs={4}
            sx={{ alignSelf: 'flex-start' }}
            className="nested__input-radio-alignment">
            <InputLabel htmlFor="riskFactor">
              <div className="label-heading  align__label">
                Mention Risk Factor <sup>*</sup>
              </div>
            </InputLabel>
          </Grid>

          <Grid item xs={7} className="align__radio nested__input-alignment">
            <Radio
              radioOption={RadioOptions}
              name={`${name}s[${selfIndex}].risk_factor`}
              id={`${name}s[${selfIndex}].risk_factor`}
              onChange={handleChange}
              value={
                name === 'finding'
                  ? getIsErrorAndValue({
                      touched,
                      errors,
                      name,
                      selfIndex,
                      field: 'risk_factor',
                      values,
                    })?.value
                  : getIsErrorAndValue({
                      touched,
                      errors,
                      name,
                      selfIndex,
                      field: 'risk_factor',
                      parentIndex,
                      parentField: 'findings',
                      values,
                    })?.value
              }
              defaultValue={'Low'}
              color={'primary'}
              error={
                name === 'finding'
                  ? getIsErrorAndValue({ touched, errors, name, selfIndex, field: 'description' })
                      ?.isError
                  : getIsErrorAndValue({
                      touched,
                      errors,
                      name,
                      selfIndex,
                      field: 'description',
                      parentIndex,
                      parentField: 'findings',
                    })?.isError
              }
            />
            {name === 'finding'
              ? getIsErrorAndValue({ touched, errors, name, selfIndex, field: 'description' })
                  ?.isError
              : getIsErrorAndValue({
                  touched,
                  errors,
                  name,
                  selfIndex,
                  field: 'description',
                  parentIndex,
                  parentField: 'findings',
                })?.isError && (
                  <FormHelperText error>
                    {name === 'finding'
                      ? getIsErrorAndValue({
                          touched,
                          errors,
                          name,
                          selfIndex,
                          field: 'description',
                        })?.message
                      : getIsErrorAndValue({
                          touched,
                          errors,
                          name,
                          selfIndex,
                          field: 'description',
                          parentIndex,
                          parentField: 'findings',
                        })?.message}
                  </FormHelperText>
                )}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

// button container
const ButtonCollection = ({ values, push, pushRec, finding = {}, onlyFinding = false }) => {
  return (
    <Grid container spacing={4} justifyContent="start" className="formGroupItem">
      <Grid item xs={4}>
        <InputLabel htmlFor="notes">
          {/* <div className="label-heading  align__label">test</div> */}
        </InputLabel>
      </Grid>
      <Grid
        xs={7}
        item
        sx={{
          justifyContent: !onlyFinding
            ? values?.findings?.length === 1
              ? 'start'
              : 'end'
            : 'start',
        }}>
        {!!(values?.findings?.length === 1 && pushRec) && values?.category && (
          <Button
            type="button"
            variant="contained"
            className="add-another__findings"
            onClick={() => push({ description: '', risk_factor: 'Low', attachments: [] })}>
            Add Another Finding
          </Button>
        )}
        {onlyFinding && values?.category && (
          <Button
            type="button"
            variant="contained"
            className="add-another__findings"
            onClick={() => push({ description: '', risk_factor: 'Low', attachments: [] })}>
            Add Another Finding
          </Button>
        )}
        {!!(Object.keys(finding)?.length > 1 && !searchObject['findings']) && (
          <Button
            type="button"
            // variant='contained'
            variant="text"
            onClick={() => pushRec({ description: '', attachments: [] })}>
            <AddIcon></AddIcon>
            <span>
              Add{finding?.recommendations?.length > 0 ? ' Another ' : ' '}
              Recommendations
            </span>
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

//cancel button
const cancelButton = ({ deleteFnk, deleteId, iconStyle }) => {
  return (
    <div onClick={() => deleteFnk(deleteId)} style={iconStyle}>
      <IconButton>
        <CancelOutlinedIcon
          sx={{
            fill: '#C1C6D4',
            '&:hover': {
              fill: '#FF0000',
              cursor: 'pointer',
            },
          }}></CancelOutlinedIcon>
      </IconButton>
    </div>
  );
};

const FindingAndRecom = ({ values, fieldArrayName }) => {
  return (
    <FieldArray name="findings">
      {({ push, remove }) => (
        <>
          {/* findings */}
          {values?.findings?.map((finding, findingIndex) => (
            <div
              key={findingIndex}
              className={`individual__finding ${
                searchObject['findings']
                  ? 'single__recommendation'
                  : searchObject['category']
                  ? 'single__finding'
                  : ''
              }`}>
              {/* findings fields */}
              <FindingsAndRecommendationsField
                object={finding}
                selfIndex={findingIndex}
                name="finding"
                formikProps={formikProps}
              />
              {/* recommendations fields and mappings */}
              <FieldArray name={`findings[${findingIndex}].recommendations`}>
                {({ push: pushRec, remove: removeRec }) => (
                  <>
                    {finding?.recommendations?.map((recommendation, recommendationIndex) => (
                      <>
                        <div key={recommendationIndex} style={{ position: 'relative' }}>
                          <FindingsAndRecommendationsField
                            object={finding}
                            parentIndex={findingIndex}
                            selfIndex={recommendationIndex}
                            name="recommendation"
                            formikProps={formikProps}
                          />
                          {values?.category && finding?.recommendations?.length >= 0
                            ? cancelButton({
                                deleteFnk: (id) => removeRec(id),
                                deleteId: recommendationIndex,
                                iconStyle: {
                                  position: 'absolute',
                                  right: '15px',
                                  top: '-2px',
                                },
                              })
                            : cancelButton({
                                deleteFnk: (id) => removeRec(id),
                                deleteId: recommendationIndex,
                                iconStyle: {
                                  position: 'absolute',
                                  right: '2px',
                                  top: '0px',
                                },
                              })}
                        </div>
                      </>
                    ))}
                    <ButtonCollection
                      values={values}
                      push={push}
                      pushRec={pushRec}
                      finding={finding}
                    />
                  </>
                )}
              </FieldArray>
              {values?.category && values?.findings?.length > 0 ? (
                cancelButton({
                  deleteFnk: (id) => remove(id),
                  deleteId: findingIndex,
                  iconStyle: { position: 'absolute', right: '0', top: '0' },
                })
              ) : values?.findings?.length > 1 ? (
                cancelButton({
                  deleteFnk: (id) => remove(id),
                  deleteId: findingIndex,
                  iconStyle: { position: 'absolute', right: '0', top: '0' },
                })
              ) : (
                <></>
              )}
            </div>
          ))}
          {values?.findings?.length > 0 ? (
            <ButtonCollection
              values={values}
              push={push}
              onlyFinding={!!(values?.findings?.length !== 1) ? true : false}
            />
          ) : (
            <>
              {/* {!!Object.keys(searchObject)?.length && checkMethod && (
                <Button
                  type="button"
                  variant="contained"
                  className="add-another__findings"
                  sx={{ marginTop: '2rem' }}
                  onClick={() =>
                    push({ description: '', risk_factor: 'Low', attachments: [] })
                  }>
                  Add Finding & Recommendation
                </Button>
              )} */}
              <Button
                type="button"
                variant="contained"
                className="add-another__findings"
                sx={{ marginTop: '2rem' }}
                onClick={() => push({ description: '', risk_factor: 'Low', attachments: [] })}>
                Add Finding & Recommendation
              </Button>
            </>
          )}
        </>
      )}
    </FieldArray>
  );
};

export default FindingAndRecom;
