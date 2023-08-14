import { itemTypes } from "src/modules/template/itemTypes/itemTypes";

export async function DropLogic({
  actionType,
  moveItems,
  monitor,
  hoverId,
  id,
  fetchApI,
  moveResponseData,
  item,
}: any) {
  switch (monitor.getItemType()) {
    case itemTypes?.TEXT_ANSWER:
      actionType !== "DROP" && moveItems({ dragId: id, destinationId: hoverId });
      break;
    case itemTypes.SECTION:
      actionType !== "DROP" && moveItems({ dragId: id, destinationId: hoverId });
      break;
    case itemTypes.RESPONSE_CHOICE_SET:
      actionType === "DROP" &&
        moveResponseData({
          destinationId: hoverId,
          responseData: {
            response_choice: item?.responseChoice,
            response_type: id,
            responseOptionsData: item?.dataItem,
          },
        });
      break;
    case itemTypes.INTERNAL_RESPONSE:
      actionType === "DROP" &&
        moveResponseData({
          destinationId: hoverId,
          responseData: {
            response_choice: item?.responseChoice,
            response_type: id,
            responseOptionsData: {
              field: item?.dataItem?.field || "name",
              url: item?.dataItem?.options,
            },
          },
        });
      // actionType === 'DROP' &&
      //   (await fetchApI({
      //     setterFunction: (data: any) => {
      //       if (data?.length >= 0) {
      //         moveResponseData({
      //           destinationId: hoverId,
      //           responseData: {
      //             response_choice: item?.responseChoice,
      //             response_type: id,
      //             responseOptionsData: {
      //               options: data || [],
      //               field: item?.dataItem?.field || 'name',
      //             },
      //           },
      //         });
      //       }
      //     },
      //     url: item?.dataItem?.options,
      //     // queryParam: 'size=99',
      //     replace: true,
      //   }));
      break;
    case itemTypes.DEFAULT:
      actionType === "DROP" &&
        moveResponseData({
          destinationId: hoverId,
          responseData: {
            response_choice: "default",
            response_type: item?.it?.id,
            responseOptionsData: [],
            attr: { type: item?.it?.input_type },
          },
        });
      break;
    default:
      actionType !== "DROP" &&
        moveItems({
          dragId: id,
          destinationId: hoverId,
        });
      break;
  }
}
