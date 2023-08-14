import { v4 as uuidv4 } from 'uuid';

export function reduceDataSet(datasets: any, globalParentId: any, isFirstCall?: any) {
  let result = <any>{
    parentId: null,
    childDataSet: [],
    allIdsCollection: [],
    questionSectionIDCollection: [],
    lastChildData: null,
    parentIndex: null,
  };

  for (let i = 0; i < datasets?.length; i++) {
    let curr = datasets[i];

    if (curr.id === globalParentId || curr.parent === globalParentId) {
      let childDataSet = [];
      let allIdsCollection = [];
      let questionSectionIDCollection = [];

      let lastChildData = <any>{
        data: null,
        index: null,
      };
      if (isFirstCall) {
        childDataSet.push(curr);
        allIdsCollection.push(curr?.id);
        if (curr?.component !== 'logic') {
          questionSectionIDCollection.push(curr?.id);
        }
        result.parentIndex = i;
      }
      for (let j = 0; j < datasets?.length; j++) {
        let child = datasets[j];
        if (child.parent === curr.id) {
          let childResult = reduceDataSet(datasets, child.id, false);
          childDataSet.push(child, ...childResult.childDataSet);
          allIdsCollection.push(child?.id, ...childResult.allIdsCollection);
          if (child?.component !== 'logic') {
            questionSectionIDCollection.push(child?.id, ...childResult.questionSectionIDCollection);
          }
          lastChildData.data = childResult.lastChildData || child;
          lastChildData.index = j;
        }
      }

      result = {
        ...result,
        parentId: curr.id,
        childDataSet,
        lastChildData,
        allIdsCollection,
        questionSectionIDCollection,
      };
      break;
    }
  }
  return result;
}

export function getDirectChild(datasets: any, id: any) {
  return datasets
    ?.filter((data: any) => data?.parent === id || data?.id === id)
    ?.map((it: any) => it?.id);
}

let logicIds: any = new Set();
export function getAllLogicIds(
  datasets: any,
  globalParentId: any,
  isFirstCall?: any,
  lastItemId?: any,
) {
  let result = <any>{
    parentId: null,
    childDataSet: [],
    allIdsCollection: [],
    // logicIdsCollection: [],
  };

  for (let i = 0; i < datasets?.length; i++) {
    let curr = datasets[i];
    if (curr.id === globalParentId || curr.parent === globalParentId) {
      let childDataSet = [];
      let allIdsCollection = [];

      if (isFirstCall) {
        childDataSet.push(curr);
        allIdsCollection.push(curr?.id);
        if (curr?.component === 'logic') {
          logicIds.add(curr?.id);
        }
        result.parentIndex = i;
      }
      for (let j = 0; j < datasets?.length; j++) {
        let child = datasets[j];
        if (child.id === lastItemId) break;
        if (child.parent === curr.id) {
          let childResult = getAllLogicIds(datasets, child.id, false, lastItemId);
          childDataSet.push(child, ...childResult.childDataSet);
          allIdsCollection.push(child?.id, ...childResult.allIdsCollection);
          if (child.component === 'logic') {
            const findMainParent = datasets.find((data: any) => data.id === child.parent);
            // logicIds.add(`${child.id}->${findMainParent.parent}`);
            logicIds.add(`${child.id}`);
          }
        }
      }

      result = {
        ...result,
        parentId: curr.id,
        childDataSet,
        allIdsCollection,
        logicIds,
      };
      break;
    }
  }

  return { ...result, logicIds };
}

const traverse: any = function ({ dataset, id, parent = null }: any) {
  for (const item of dataset) {
    if (item.id === id) {
      return parent;
    }

    if (item.component === 'logic' && item.parent === id) {
      const logicId = item.logicId;
      const logicParentId = item.logicReferenceId.split('[logicParentId]')[1];
      return traverse({ dataset, id: logicParentId, parent: logicId });
    }

    if (item.component === 'question' && item.parent === id) {
      return traverse({ dataset, id: item.parentPage, parent: item.id });
    }
  }

  return null;
};
