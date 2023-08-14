import { Box } from '@mui/material';
import { useReportDataSets } from 'containers/inspections/store/inspection';
import { validateInput } from 'containers/template/validation/inputLogicCheck';
import { findData } from 'containers/template/validation/keyValidationFunction';
import Actions from '../Components/Actions';
import Disclaimer from '../Components/Disclaimer';
import FlaggedItems from '../Components/FlaggedItems';
import Media from '../Components/Media';
import Overview from '../Components/Overview';
import Questions from '../Components/Question';
import PdfTableOfContents from './PdfTableOfContents';
import PdfCountingDatas from './pdfCountingDatas';

const PDFPreview = ({ ...rest }: any) => {
  const { currentLayout } = rest;
  const { initialState, setInitialState } = useReportDataSets();

  const pages =
    initialState?.fields && initialState?.fields?.filter((list: any) => list?.component === 'page');

  const pagesWithSections =
    pages && pages?.length
      ? pages.map((page: any, index: number, arr: any[]) => {
          const sections = (initialState?.fields || []).filter(
            (field: any) => field.component === 'section' && field?.parentPage === page.id,
          );
          return {
            ...page,
            sections,
          };
        })
      : [];

  const dataSetSeperators = initialState?.fields?.reduce(
    (acc: any, curr: any) => {
      if (
        curr.component?.toLowerCase() !== 'logic' &&
        curr.logicReferenceId === null &&
        curr.parent === null
      ) {
        acc.questionDataSet.push(curr);
      } else if (curr.component === 'logic') {
        acc.logicDataSet.push(curr);
      } else if (curr.logicReferenceId || curr.parent) {
        acc.logicQuestion.push(curr);
      }
      return acc;
    },
    { logicDataSet: [], questionDataSet: [], logicQuestion: [] },
  );

  function dataNode({ dataSetSeperator, data, acc }: any) {
    const findLogic = dataSetSeperator.logicDataSet?.find(
      (datas: any) => data.logicId === datas.id,
    );
    if (!findLogic) return null;

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

    if (!conditionQuestions?.length) return;
    conditionQuestions?.map((data: any) => {
      const qnLogic = dataSetSeperator?.logicDataSet?.find((lg: any) => lg?.id === data?.logicId);

      if (data?.component === 'question') {
        // do saving
        // recursive vall
        acc.filterQuestion.push(data);
        data?.media?.[0]?.documents?.length && acc.medias.push(...data?.media?.[0]?.documents);

        data?.action?.length && acc.actions.push(...data?.action);
        data?.flaggedValue?.length && acc.flaggedQuestions.push(...data?.flaggedValue);
        dataNode({ dataSetSeperator: dataSetSeperator, data: data, acc });
      } else if (data.component === 'section') {
        dataSection({ dataSetSeperator: dataSetSeperator, data: data, acc });
      }
    });
  }

  function dataSection({ dataSetSeperator, data, acc }: any) {
    const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
      return data?.id === item?.parent;
    });

    if (!findChildren?.length) return;
    findChildren?.map((child: any) => {
      if (child.component === 'question') {
        acc.filterQuestion.push(child);
        child?.media?.[0]?.documents?.length && acc.medias.push(...child?.media?.[0]?.documents);
        child?.action?.length && acc.actions.push(...child?.action);
        child?.flaggedValue?.length && acc.flaggedQuestions.push(...child?.flaggedValue);

        dataNode({ dataSetSeperator: dataSetSeperator, data: child, acc });
      } else if (child.component === 'section') {
        dataSection({ dataSetSeperator: dataSetSeperator, data: child, acc });
      }
    });
  }
  // create a collection of media from active lists
  const datass = dataSetSeperators?.questionDataSet?.reduce(
    (acc: any, curr: any) => {
      const foundLogic = dataSetSeperators?.logicDataSet?.find(
        (lg: any) => lg?.id === curr?.logicId,
      );
      if (curr?.component === 'question') {
        acc.filterQuestion.push(curr);
        curr?.media?.[0]?.documents?.length && acc.medias.push(...curr?.media?.[0]?.documents);
        curr?.action?.length && acc.actions.push(...curr?.action);
        curr?.flaggedValue?.length && acc.flaggedQuestions.push(...curr?.flaggedValue);

        dataNode({ dataSetSeperator: dataSetSeperators, data: curr, acc });
      } else if (curr.component === 'section') {
        dataSection({ dataSetSeperator: dataSetSeperators, data: curr, acc });
      }
      return acc;
    },
    { flaggedQuestions: [], medias: [], actions: [], filterQuestion: [] },
  );

  return (
    <Box px={3} py={1}>
      <div id="overview">
        <Box>
          <Overview badgeContent={{ value: 'Incomplete', status: 'Pending' }} mode="pdf" />
        </Box>
      </div>
      <PdfCountingDatas
        datass={datass}
        has_flagged={currentLayout?.has_flagged}
        has_action={currentLayout?.has_action}
        has_checkboxes={currentLayout?.has_checkboxes}
      />

      {currentLayout?.has_table_of_contents && (
        // <PdfPageBreak has_page_break={has_page_break} />
        <div
          style={{
            marginTop: 10,
          }}>
          <PdfTableOfContents pagesWithSections={pagesWithSections} currentLayout={currentLayout} />
        </div>
      )}
      {currentLayout?.has_disclaimer && (
        <div style={{ marginTop: 10 }} id="disclaimer" className="page-break">
          <Box>
            {' '}
            <Disclaimer mode="pdf" />
          </Box>
        </div>
      )}

      {currentLayout?.has_flagged_summary && (
        <div style={{ marginTop: 10 }} id="flaggedItems" className="page-break">
          <Box>
            {' '}
            <FlaggedItems {...rest} mode="pdf" />
          </Box>
        </div>
      )}
      {currentLayout?.has_action_summary && (
        <div style={{ marginTop: 10 }} id="actions">
          <Box>
            {' '}
            <Actions {...rest} mode="pdf" />
          </Box>
        </div>
      )}
      <div style={{ marginTop: 10 }} id="questions" className="page-break">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Questions {...rest} mode="pdf" />
        </Box>
      </div>
      {currentLayout?.has_media_summary && (
        <div style={{ marginTop: 10 }} id="media" className="page-break">
          <Box>
            {' '}
            <Media {...rest} mode="pdf" />
          </Box>
        </div>
      )}
    </Box>
  );
};

export default PDFPreview;
