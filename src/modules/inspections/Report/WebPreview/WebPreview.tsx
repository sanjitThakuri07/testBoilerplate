import { Box, Divider } from "@mui/material";
import Disclaimer from "../Components/Disclaimer";
import FlaggedItems from "../Components/FlaggedItems";
import Overview from "../Components/Overview";
import Question from "../Components/Question";
import Questions from "../Components/Question";
import Actions from "../Components/Actions";
import { useState } from "react";
import Media from "../Components/Media";
import { useReportDataSets } from "src/store/zustand/inspectionTemp/inspection";
import { validateInput } from "src/modules/template/validation/inputLogicCheck";
import { findData } from "src/modules/template/validation/keyValidationFunction";

const WebPreview = ({ ...rest }: any) => {
  const { currentLayout } = rest;
  const { initialState, setInitialState } = useReportDataSets();

  const dataSetSeperators = initialState?.fields?.reduce(
    (acc: any, curr: any) => {
      if (
        curr.component?.toLowerCase() !== "logic" &&
        curr.logicReferenceId === null &&
        curr.parent === null
      ) {
        acc.questionDataSet.push(curr);
      } else if (curr.component === "logic") {
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
                acc[`${curr.name?.toString()?.split(" ").join("_")}`] = curr.value;
              }
              return acc;
            }, {});
            datas = logic.linkQuestions.map((data: any) =>
              findData(dataSetSeperator.logicQuestion, data, "id"),
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

      if (data?.component === "question") {
        // do saving
        // recursive vall
        acc.filterQuestion.push(data);
        data?.media?.[0]?.documents?.length && acc.medias.push(...data?.media?.[0]?.documents);

        data?.action?.length && acc.actions.push(...data?.action);
        data?.flaggedValue?.length && acc.flaggedQuestions.push(...data?.flaggedValue);
        dataNode({ dataSetSeperator: dataSetSeperator, data: data, acc });
      } else if (data.component === "section") {
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
      if (child.component === "question") {
        acc.filterQuestion.push(child);
        child?.media?.[0]?.documents?.length && acc.medias.push(...child?.media?.[0]?.documents);
        child?.action?.length && acc.actions.push(...child?.action);
        child?.flaggedValue?.length && acc.flaggedQuestions.push(...child?.flaggedValue);

        dataNode({ dataSetSeperator: dataSetSeperator, data: child, acc });
      } else if (child.component === "section") {
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
      if (curr?.component === "question") {
        acc.filterQuestion.push(curr);
        curr?.media?.[0]?.documents?.length && acc.medias.push(...curr?.media?.[0]?.documents);
        curr?.action?.length && acc.actions.push(...curr?.action);
        curr?.flaggedValue?.length && acc.flaggedQuestions.push(...curr?.flaggedValue);

        dataNode({ dataSetSeperator: dataSetSeperators, data: curr, acc });
      } else if (curr.component === "section") {
        dataSection({ dataSetSeperator: dataSetSeperators, data: curr, acc });
      }
      return acc;
    },
    { flaggedQuestions: [], medias: [], actions: [], filterQuestion: [] },
  );

  return (
    <>
      <div id="overview">
        <Box p={1}>
          <Overview badgeContent={{ value: "Incomplete", status: "Pending" }} datass={datass} />
        </Box>
      </div>
      {currentLayout?.has_disclaimer && (
        <div id="disclaimer">
          <Box p={1}>
            {" "}
            <Disclaimer />
          </Box>
        </div>
      )}

      {currentLayout?.has_flagged_summary && (
        <div id="flaggedItems">
          <Box p={1}>
            {" "}
            <FlaggedItems {...rest} />
          </Box>
        </div>
      )}
      {currentLayout?.has_action_summary && (
        <div id="actions">
          <Box p={1}>
            {" "}
            <Actions {...rest} />
          </Box>
        </div>
      )}
      <div id="questions">
        <Box p={1} sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Questions {...rest} />
        </Box>
      </div>
      {currentLayout?.has_media_summary && (
        <div id="media">
          <Box p={1}>
            {" "}
            <Media {...rest} />
          </Box>
        </div>
      )}
    </>
  );
};

export default WebPreview;
