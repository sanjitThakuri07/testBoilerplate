import { useTextAnswer } from "src/store/zustand/globalStates/templates/TextAnswer";
import { useState } from "react";
import "./SelectResponseType.scss";
import ReactSelect from "src/components/ReactSelect/ReactSelect";
import { useTemplateFieldsStore } from "src/modules/template/store/templateFieldsStore";
import responseItems from "constants/template/responseItems";
import { withDragHOC } from "HOC/withDragDropHoc";
import { itemTypes } from "src/modules/template/itemTypes/itemTypes";

const DefaultResponseSetDrag = withDragHOC({
  WrappedComponent: ({ onClick, it, selectedDataset, activeDefaultResponseItem }: any) => {
    return (
      <div
        className={`default__option-list ${activeDefaultResponseItem ? "active" : ""}`}
        onClick={onClick}
        style={{
          pointerEvents: selectedDataset?.lock ? "none" : "auto",
        }}
      >
        <div className="icon">
          <img src={it?.Icon} alt={it?.id} />
        </div>
        <p>{it?.label}</p>
      </div>
    );
  },
  item: { responseChoice: "default" },
  dragType: itemTypes.DEFAULT,
});

const SelectResponseType = () => {
  const templateDatasets = useTemplateFieldsStore((state: any) => state?.templateDatasets);
  const selectedDataset = useTemplateFieldsStore((state: any) => state?.selectedDataset);
  const updateTemplateDatasets = useTemplateFieldsStore(
    (state: any) => state.updateTemplateDatasets,
  );
  const { updateTemplateDatasetsBeta } = useTemplateFieldsStore();
  const setSelectedData = useTemplateFieldsStore((state: any) => state.setSelectedData);
  // const setSelectedData = useTemplateFieldsStore((state: any) => state.setSelectedData);
  const { setSelectedInputType, selectedInputId, setSelectedInputIdData } = useTextAnswer();
  let selectedData: any;
  const foundLogic = templateDatasets?.find(
    (tempData: any) => tempData?.id === selectedDataset?.logicId,
  );

  const handleDefaultResponse = (defaultResponse: any) => {
    console.log({ selectedDataset }, { selectedData }, { foundLogic });
    if (selectedDataset?.response_type !== defaultResponse?.id) {
      updateTemplateDatasetsBeta({
        selectedDataset: foundLogic,
        dataObjects: {
          logics: [],
        },
      });
    }
    updateTemplateDatasetsBeta({
      selectedDataset,
      key: "response_type",
      value: defaultResponse?.id,
      dataObjects: {
        response_type: defaultResponse?.id,
        type: defaultResponse?.input_type,
        response_choice: "default",
      },
    });
    // updateTemplateDatasets(selectedDataset, 'response_type', defaultResponse?.id);
    // updateTemplateDatasets(selectedDataset, 'type', defaultResponse?.input_type);
    // updateTemplateDatasets(selectedDataset, 'response_choice', 'default');

    setSelectedInputType(defaultResponse);
    setSelectedInputIdData({
      id: selectedInputId,
      value: defaultResponse.value,
      label: defaultResponse.label,
      Icon: defaultResponse.Icon,
    });
  };

  (function () {
    if (selectedDataset?.component === "logic") {
      selectedData = templateDatasets?.find((data: any) => selectedDataset?.parent === data?.id);
    } else {
      selectedData = selectedDataset;
    }
  })();

  return (
    <>
      {/* <ReactSelect
          name="response_type"
          handleTypeSelect={handleTypeSelect}
          selectedValue={responseItems.find(
            (option: any) =>
              option.id ===
              templateDatasets.find((data: any) => data.id === selectedDataset?.id)?.response_type,
          )}
          options={responseItems}
        /> */}
      {/* ...Array(100).fill({
          id: 'INSTRUCT_001',
          label: 'Instruction',
          value: 'Instruction',
          type: 'instruction',
          input_type: 'instruction',
          Icon: 'InstructionIcon',
        }), */}
      {responseItems?.map((it: any, index: number) => {
        const activeDefaultResponseItem = it.id === selectedData?.response_type;
        return (
          <>
            <DefaultResponseSetDrag
              selectedDataset={selectedDataset}
              onClick={(e: any) => {
                handleDefaultResponse(it);
              }}
              it={it}
              activeDefaultResponseItem={activeDefaultResponseItem}
            />
            {/* <div
              className={`default__option-list ${activeDefaultResponseItem ? 'active' : ''}`}
              onClick={(e) => {
                handleDefaultResponse(it);
              }}>
              <div className="icon">
                <img src={it?.Icon} alt={it?.id} />
              </div>
              <p>{it?.label}</p>
            </div> */}
          </>
        );
      })}
    </>
  );
};

export default SelectResponseType;

// const SelectResponseType = () => {
//   const templateDatasets = useTemplateFieldsStore((state: any) => state?.templateDatasets);
//   const selectedDataset = useTemplateFieldsStore((state: any) => state?.selectedDataset);
//   const updateTemplateDatasets = useTemplateFieldsStore(
//     (state: any) => state.updateTemplateDatasets,
//   );
//   const setSelectedData = useTemplateFieldsStore((state: any) => state.setSelectedData);
//   // const setSelectedData = useTemplateFieldsStore((state: any) => state.setSelectedData);
//   const { setSelectedInputType, selectedInputId, setSelectedInputIdData } = useTextAnswer();

//   const handleDefaultResponse = (defaultResponse: any) => {
//     updateTemplateDatasets(selectedDataset, 'response_type', defaultResponse?.id);
//     updateTemplateDatasets(selectedDataset, 'type', defaultResponse?.input_type);
//     updateTemplateDatasets(selectedDataset, 'response_choice', 'default');

//     setSelectedInputType(defaultResponse);
//     setSelectedInputIdData({
//       id: selectedInputId,
//       value: defaultResponse.value,
//       label: defaultResponse.label,
//       Icon: defaultResponse.Icon,
//     });
//   };

//   return (
//     <>
//       {/* <ReactSelect
//           name="response_type"
//           handleTypeSelect={handleTypeSelect}
//           selectedValue={responseItems.find(
//             (option: any) =>
//               option.id ===
//               templateDatasets.find((data: any) => data.id === selectedDataset?.id)?.response_type,
//           )}
//           options={responseItems}
//         /> */}
//       {responseItems?.map((it: any, index: number) => {
//         const activeDefaultResponseItem = it.id === selectedDataset?.response_type;
//         return (
//           <div
//             className={`default__option-list ${activeDefaultResponseItem ? 'active' : ''}`}
//             onClick={(e) => {
//               handleDefaultResponse(it);
//             }}>
//             <div className="icon">
//               <img src={it?.Icon} alt={it?.id} />
//             </div>
//             <p>{it?.label}</p>
//           </div>
//         );
//       })}
//     </>
//   );
// };
