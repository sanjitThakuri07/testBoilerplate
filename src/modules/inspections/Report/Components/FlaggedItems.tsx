import { Box, Collapse, Stack, Typography } from '@mui/material';
import responseItems from 'constants/template/responseItems';
import { validateInput } from 'containers/template/validation/inputLogicCheck';
import { findData } from 'containers/template/validation/keyValidationFunction';

import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Vector from './Vector';

const returnValue = (value: any, typeOfResponse: any, flaggedValue: any) => {
  if (Array.isArray(value)) {
    return value.map((v) => {
      if (flaggedValue?.includes(v)) {
        return (
          <div className="status_highlight">
            <Vector />
            <div className="status_highlight_text">{v}</div>
          </div>
        );
      } else {
        return <span>{v}</span>;
      }
    });
  }

  return <></>;
};

const RenderQuestion = ({ data, mode = 'web' }: any) => {
  if (Array.isArray(data?.value)) {
    return data?.value.map((v: any, index: any) => {
      if (data?.flaggedValue?.includes(v)) {
        if (mode === 'pdf') {
          return (
            <Box key={index} className="individual_box_container">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ fontSize: '15px' }}>{data?.label ?? 'N/A'}</Box>
                <Box sx={{ opacity: '0.7', mt: 0.3 }}>
                  <div className="status_highlight">
                    <Vector />
                    <div className="status_highlight_text">{v}</div>
                  </div>
                </Box>
              </Stack>
            </Box>
          );
        }
        return (
          <Box width={'100%'} borderRadius={'4px'} pt={2}>
            <Box>
              <Typography component="p">{data?.label}</Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <div className="status_highlight">
                <Vector />
                <div className="status_highlight_text">{v}</div>
              </div>
            </Stack>
          </Box>
        );
      }
    });
  }
  return;
};

function InputFields({ responseItems, data, icon, typeOfResponse, mode }: any) {
  return (
    <>
      {data?.response_choice === 'internal' && (
        <RenderQuestion mode={mode} data={data} icon={icon} typeOfResponse={typeOfResponse} />
      )}

      {(data?.response_choice === 'multiple' || data?.response_choice === 'global') && (
        <RenderQuestion mode={mode} data={data} icon={icon} typeOfResponse={typeOfResponse} />
      )}
      {data?.response_choice === 'default' &&
        (() => {
          let type =
            responseItems.find((option: any) => option.id === data.response_type)?.type || '';

          switch (type) {
            case 'text':
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case 'inspection_date':
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case 'date':
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case 'range':
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case 'number':
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case 'speech_recognition':
              return <></>;
            case 'location':
              return <>location</>;
            case 'temp':
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case 'anno':
              return <>annotation</>;
            case 'checkbox':
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case 'instruction':
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            case 'signature':
              return (
                <RenderQuestion
                  mode={mode}
                  data={data}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
              );
            default:
              return <></>;
          }
        })()}

      <div>
        {data?.trigger?.Require_Evidence && (
          <div>{data?.trigger?.Require_Evidence?.map((ev: any) => ev)}</div>
        )}
        {data?.trigger?.Require_Action && <div>Require Action</div>}
      </div>
    </>
  );
}

function GenerateQuestion({ data, dataSetSeperator, mode }: any) {
  const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
    return data?.id === item?.parent;
  });
  if (findChildren?.length) {
    return (
      <>
        {/* <div
          style={{
            background: '#374974',
            color: '#fff',
            padding: '0.5rem .75rem',
            fontSize: '1rem',
            borderRadius: '3px',
          }}>
          {data?.label}
        </div> */}
        {findChildren?.map((it: any, index: number) => {
          const icon = responseItems?.find((item) => item.id === it?.response_type)?.Icon;
          const typeOfResponse = responseItems?.find((item) => item.id === it?.response_type)?.type;
          if (it.component === 'question') {
            const qnLogic = dataSetSeperator?.logicDataSet?.find(
              (lg: any) => lg?.id === it?.logicId,
            );
            return (
              <>
                <InputFields
                  mode={mode}
                  key={it?.tid}
                  responseItems={responseItems}
                  data={it}
                  foundLogic={qnLogic}
                  icon={icon}
                  typeOfResponse={typeOfResponse}
                />
                <FormNode mode={mode} dataSetSeperator={dataSetSeperator} data={it} key={it?.id} />
              </>
            );
          } else if (it.component === 'section') {
            return (
              <>
                <React.Fragment key={index}>
                  {/* <h1>{data?.component}</h1> */}
                  <GenerateQuestion mode={mode} data={it} dataSetSeperator={dataSetSeperator} />
                </React.Fragment>
              </>
            );
          }
        })}
      </>
    );
  }
  return <></>;
}

const FormNode = ({ dataSetSeperator, data, mode }: any) => {
  //   const [setTrigger, updateTrigger]
  const findLogic = dataSetSeperator.logicDataSet?.find((datas: any) => data.logicId === datas.id);

  if (!findLogic) return null;

  //   useEffect(() => {}, []);
  let trigger = {};

  const conditionQuestions = findLogic?.logics
    ?.map((logic: any, index: any) => {
      if (logic) {
        let datas = [];
        let conditionDataset = {
          condition: logic?.condition,
          trigger: logic?.trigger,
        };
        if (
          validateInput({
            operator: conditionDataset?.condition,
            userInput: data?.value,
            authorizedValues: Array.isArray(logic?.value) ? logic?.value : [logic?.value],
          })
        ) {
          trigger = logic?.trigger.reduce((acc: any, curr: any) => {
            if (curr?.name) {
              acc[`${curr.name?.toString()?.split(' ').join('_')}`] = curr.value;
            }
            return acc;
          }, {});
          datas = logic.linkQuestions.map((data: any) =>
            findData(dataSetSeperator.logicQuestion, data, 'id'),
          );
        }
        return datas;
      } else {
        return;
      }
    })
    .flat();
  // data.trigger = trigger;

  if (conditionQuestions?.length) {
    return (
      <>
        {conditionQuestions?.map((data: any) => {
          const icon = responseItems?.find((item) => item.id === data?.response_type)?.Icon;
          const typeOfResponse = responseItems?.find(
            (item) => item.id === data?.response_type,
          )?.type;
          const qnLogic = dataSetSeperator?.logicDataSet?.find(
            (lg: any) => lg?.id === data?.logicId,
          );
          return (
            <React.Fragment key={data?.id}>
              {data?.component === 'question' && (
                <>
                  <RenderQuestion
                    mode={mode}
                    data={data}
                    icon={icon}
                    typeOfResponse={typeOfResponse}
                  />

                  <FormNode
                    mode={mode}
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                  />
                </>
              )}

              {data?.component === 'section' && (
                <>
                  <h1> {data?.component}</h1>
                  <FormNode
                    mode={mode}
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                  />
                  {/* <GenerateQuestion
                    key={data?.id}
                    data={data}
                    dataSetSeperator={dataSetSeperator}
                    formikData={{ values, setFieldValue, touched, errors }}
                   
                  /> */}
                </>
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  }

  return <></>;
};
const FlaggedItems = ({ pages, dataSetSeperator, mode = 'web' }: any) => {
  const [collapseActions, setCollapseActions] = useState<any>(true);
  if (mode === 'pdf') {
    return (
      <Box mb={1}>
        <Box className="box-container-pdf">
          <Box sx={{ fontWeight: 500 }} className="pdf_label">
            <Stack direction="row" justifyContent="space-between">
              <Box>Flagged Contents</Box>
              {/* {has_flagged && <Box>1</Box>} */}
            </Stack>
          </Box>
          <QuestionCopy
            dataSetSeperator={dataSetSeperator}
            collapseActions={collapseActions}
            mode={mode}
          />
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="overview_layout_container">
        <Box display={'flex'} width={'100%'} justifyContent="space-between">
          <Stack direction="row" spacing={2} justifyContent="center" alignItems={'center'}>
            <Box onClick={() => setCollapseActions(!collapseActions)} className="overview_button">
              <FontAwesomeIcon
                icon={faAngleRight}
                className={`${collapseActions && 'rotate_arrow_down'} rotate_arrow_straight`}
              />
            </Box>

            <Typography fontSize={18} fontWeight={500} sx={{ select: 'none' }}>
              Flagged Items
            </Typography>
          </Stack>
        </Box>

        <QuestionCopy dataSetSeperator={dataSetSeperator} collapseActions={collapseActions} />
      </Box>
    </>
  );
};

const QuestionCopy = ({ dataSetSeperator, collapseActions, mode }: any) => {
  const requiredQuestions = true
    ? dataSetSeperator?.questionDataSet
    : dataSetSeperator?.onlyAnsweredDataSet;

  return (
    <>
      {
        // dataSetSeperator?.questionDataSet
        requiredQuestions?.map((data: any, index: number) => {
          const foundLogic = dataSetSeperator?.logicDataSet?.find(
            (lg: any) => lg?.id === data?.logicId,
          );
          const icon = responseItems?.find((item) => item.id === data?.response_type)?.Icon;
          const typeOfResponse = responseItems?.find(
            (item) => item.id === data?.response_type,
          )?.type;
          return (
            <Collapse
              in={collapseActions}
              timeout="auto"
              unmountOnExit
              sx={{ width: '100%' }}
              key={data?.id}>
              {' '}
              {data.component === 'question' && (
                <>
                  {data?.response_choice === 'internal' && !!data?.flaggedValue?.length && (
                    <>
                      <RenderQuestion
                        mode={mode}
                        data={data}
                        icon={icon}
                        typeOfResponse={typeOfResponse}
                      />
                    </>
                  )}

                  {(data?.response_choice === 'multiple' || data?.response_choice === 'global') &&
                    !!data?.flaggedValue?.length && (
                      <>
                        <RenderQuestion
                          mode={mode}
                          data={data}
                          icon={icon}
                          typeOfResponse={typeOfResponse}
                        />
                      </>
                    )}
                  <FormNode
                    mode={mode}
                    dataSetSeperator={dataSetSeperator}
                    data={data}
                    key={data?.id}
                  />
                </>
              )}
              {data.component === 'section' && (
                <>
                  {/* <h1> {data?.component}</h1> */}
                  <GenerateQuestion mode={mode} data={data} dataSetSeperator={dataSetSeperator} />
                </>
              )}
            </Collapse>
          );
        })
      }
    </>
  );
};

export default FlaggedItems;
