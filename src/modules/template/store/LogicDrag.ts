import { getDirectChild, reduceDataSet } from "src/modules/utils/reducedDataSet";

function updateCorrespondingData({
  data,
  childId,
  newParentId,
  newGlobalParentId,
  oldGlobalParentId,
}: any) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].parent === childId) {
      data[i].parent = newParentId || data[i].parent;
      function getGlobalReferenceId(newGlobalParentId: any) {
        let globalLogicReferenceId;
        if (newGlobalParentId === null) {
          globalLogicReferenceId = null;
        } else {
          console.log(data[i].level, data[i], "jj");
          globalLogicReferenceId =
            data[i].level === 1 ? data[i].logicReferenceId : newGlobalParentId;
        }
        return globalLogicReferenceId;
      }
      data[i].globalLogicReferenceId = getGlobalReferenceId(newGlobalParentId);
      updateCorrespondingData({
        data,
        childId: data[i].id,
        newParentId,
        newGlobalParentId: data[i].globalLogicReferenceId,
        oldGlobalParentId,
      });
    }
  }
}

export function updateCorrespondingLabel({ data, childId, newParentId, level, type }: any) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].parent === childId) {
      if (data[i].component === "logic") {
        data[i].level = level;
      } else {
        data[i].level = level + 1;
      }
      updateCorrespondingLabel({
        data,
        childId: data[i].id,
        newParentId,
        level: data[i].level,
        type: data[i].component,
      });
    }
  }
}

// Example usage
const datasss: any = [
  { id: 1, parent: null, globalParent: null },
  { id: 2, parent: 1, globalParent: 1 },
  { id: 22, globalParent: 1, parent: 2 },
  { id: 23, globalParent: 1, parent: 22 },
  { id: 3, parent: null, globalParent: null },
];

export const HasDragLGID = ({ datas, activeBlocks, activeDatas, prevTemplateDatasets }: any) => {
  console.log({ prevTemplateDatasets }, "s");
  const logicID = datas?.drag?.logicReferenceId?.split("[logicParentId]")?.[0];
  const tabID = datas?.drag?.logicReferenceId?.split("[logicParentId]")?.reverse()?.[0];
  let value: any = [
    ...(activeBlocks?.[`${logicID}`]?.[`${tabID}`]?.filter((id: any) => id !== datas?.drag?.id) ||
      []),
  ];
  activeDatas = {
    ...activeBlocks,
    [`${logicID}`]: {
      ...activeBlocks?.[`${logicID}`],
      [`${tabID}`]: value,
    },
  };
  const foundParentLogic = prevTemplateDatasets?.find((it: any) => it?.id === logicID) || {};
  foundParentLogic?.logics.forEach((logic: any) => {
    if (logic?.id === tabID) {
      logic.linkQuestions = logic?.linkQuestions?.filter((qn: any) => qn !== datas?.drag?.id);
      logic.trigger = logic?.trigger?.filter((trigger: any) => {
        if (trigger?.name === "Ask Question" && logic.linkQuestions.length === 0) {
          return false;
        }

        return true;
      });
    }
  });
  // question logic

  const foundQuestionLogic =
    prevTemplateDatasets?.find((it: any) => it?.id === datas?.drag?.logicId) || {};
  foundQuestionLogic.logicReferenceId = datas?.destination.logicReferenceId || null;
  foundQuestionLogic.globalLogicReferenceId = datas?.destination.globalLogicReferenceId || null;
  // prevTemplateDatasets = [...prevTemplateDatasets, foundParentLogic];

  //   change the globalLogicReferenceId in all the linked question of that logic
  foundQuestionLogic?.logics?.forEach((it: any) => {
    updateCorrespondingData({
      data: prevTemplateDatasets,
      childId: foundQuestionLogic?.id,
      oldGlobalParentId: datas?.drag?.globalLogicReferenceId,
      //   newGlobalParentId: `${foundQuestionLogic?.id}[logicParentId]${it?.id}`,
    });
  });
};

export const IntoLogicFunction = ({
  datas,
  activeBlocks,
  activeDatas,
  prevTemplateDatasets,
}: any) => {
  console.log("called");
  const logicID = datas?.destination?.logicReferenceId?.split("[logicParentId]")?.[0];
  const tabID = datas?.destination?.logicReferenceId?.split("[logicParentId]")?.reverse()?.[0];
  let value = [
    ...activeBlocks?.[`${logicID}`]?.[`${tabID}`],
    datas?.drag?.id,
    datas?.drag?.logicId,
  ];
  activeDatas({
    ...activeBlocks,
    [`${logicID}`]: {
      ...activeBlocks?.[`${logicID}`],
      [`${tabID}`]: value,
    },
  });

  // logic of destination
  const foundDestinationLogic = prevTemplateDatasets?.find((it: any) => it?.id === logicID);
  //   push the id into the link question
  foundDestinationLogic.logics?.forEach((lg: any) => {
    if (lg?.id === tabID) {
      lg.linkQuestions = [...lg.linkQuestions, datas?.drag?.id];
    }
  });

  //  section will have no logic id

  updateCorrespondingData({
    data: prevTemplateDatasets,
    childId: datas?.drag?.logicId ? datas?.drag?.logicId : datas?.drag?.id,
    oldGlobalParentId: datas?.drag?.globalLogicReferenceId,
    newGlobalParentId: datas?.destination?.globalLogicReferenceId,
  });
};

export const HasDragDropLGID = ({
  datas,
  activeBlocks,
  activeDatas,
  prevTemplateDatasets,
}: any) => {
  const logicID = datas?.destination?.logicReferenceId?.split("[logicParentId]")?.[0];
  const tabID = datas?.destination?.logicReferenceId?.split("[logicParentId]")?.reverse()?.[0];
  const dragLogicID = datas?.drag?.logicReferenceId?.split("[logicParentId]")?.[0];
  const dragTabID = datas?.drag?.logicReferenceId?.split("[logicParentId]")?.reverse()?.[0];

  let value = [
    ...activeBlocks?.[`${logicID}`]?.[`${tabID}`],
    datas?.drag?.id,
    datas?.drag?.logicId,
  ];
  activeDatas = {
    ...activeBlocks,
    [`${logicID}`]: {
      ...activeBlocks?.[`${logicID}`],
      [`${tabID}`]: value,
    },
  };
  // remove from the current link questions
  // get the logic from the template data sets
  const foundDestinationLogic = prevTemplateDatasets?.find((it: any) => it?.id === logicID);
  const foundDragLogic = prevTemplateDatasets?.find((it: any) => it?.id === dragLogicID);

  foundDestinationLogic?.logics?.forEach((logic: any) => {
    if (logic?.id !== tabID) return;
    if (logic?.linkQuestions?.includes(datas?.drag?.id)) {
      let linkQuestions = [...(logic?.linkQuestions || [])];
      const findLinkQuestionIndex = logic.linkQuestions.findIndex(
        (qn: string) => qn === datas?.drag?.id,
      );
      const findTargetIndex = logic.linkQuestions.findIndex(
        (qn: string) => qn === datas?.destination?.id,
      );
      let gotAllChild: any = {};
      if (datas?.drag.component !== "section") {
        // questions order
        // it is what interchanges our datasets
        const [removed] = linkQuestions.splice(findLinkQuestionIndex, 1);
        linkQuestions?.splice(findTargetIndex, 0, datas?.drag?.id);
        logic.linkQuestions = [...new Set(linkQuestions)];
      } else {
        let gotSectionChild = getDirectChild(prevTemplateDatasets, datas?.drag?.id);
        const cutStartIndex: any = Number(
          linkQuestions.findIndex((q: string) => q === gotSectionChild?.[0]),
        );
        const cutEndIndex: any = Number(
          linkQuestions.findIndex((q: string) => q === gotSectionChild[gotSectionChild.length - 1]),
        );

        if (Number(cutEndIndex) !== -1 && Number(cutStartIndex) !== -1) {
          const oldDestinationIndex = [...linkQuestions]?.findIndex(
            (qn: string) => qn === datas?.destination?.id,
          );
          linkQuestions.splice(cutStartIndex, cutEndIndex - cutStartIndex + 1);
          const newDestinationIndex = linkQuestions?.findIndex(
            (qn: string) => qn === datas?.destination?.id,
          );
          if (Number(oldDestinationIndex) > Number(newDestinationIndex)) {
            linkQuestions.splice(newDestinationIndex + 1, 0, ...(gotSectionChild || []));
          } else if (Number(newDestinationIndex) === Number(oldDestinationIndex)) {
            linkQuestions.splice(newDestinationIndex, 0, ...(gotSectionChild || []));
          }
        }
      }
      logic.linkQuestions = [...new Set(linkQuestions)];
    } else {
      const findTargetIndex = logic.linkQuestions.findIndex(
        (qn: string) => qn === datas?.destination?.id,
      );
      if (datas?.drag?.component !== "section") {
        logic?.linkQuestions?.splice(findTargetIndex, 0, datas?.drag?.id);
      } else {
        let gotSectionChild = getDirectChild(prevTemplateDatasets, datas?.drag?.id);
        const findIndex = logic.linkQuestions?.indexOf(datas?.destination?.id);
        logic.linkQuestions.splice(findIndex, 0, ...gotSectionChild);
      }
    }
  });

  if (foundDragLogic?.id !== foundDestinationLogic?.id) {
    let gotAllChild: any = [];
    if (datas?.drag?.component === "section") {
      gotAllChild =
        reduceDataSet(prevTemplateDatasets, datas?.drag?.id, true)?.allIdsCollection || [];
    } else {
      gotAllChild.push(datas?.drag?.id, datas?.drag?.logicId);
    }
    console.log({ gotAllChild });
    for (let i = 0; i <= foundDragLogic?.logics?.length; i++) {
      if (foundDragLogic?.logics?.[i]?.id !== dragTabID) return;
      const linkQuestions = foundDragLogic?.logics?.[i]?.linkQuestions.filter((data: any) => {
        return !gotAllChild?.includes(data);
      });
      foundDragLogic.logics[i].linkQuestions = linkQuestions;
      break;
    }
  }

  // question logic
  const foundQuestionLogic = prevTemplateDatasets?.find(
    (it: any) => it?.id === datas?.drag?.logicId,
  );
  if (foundQuestionLogic) {
    foundQuestionLogic.logicReferenceId = datas?.destination.logicReferenceId || null;
    foundQuestionLogic.globalLogicReferenceId = datas?.destination.globalLogicReferenceId || null;
  }
};
