import { fetchIndividualApi } from "src/modules/apiRequest/apiRequest";

export async function getDataInPopUp({
  setLoading,
  setIndividualData,
  allSearchModules,
  setSelectedSearchModule,
  setAlertContainerValue,
  setOpenModalBox,
  enqueueSnackbar,
  id,
}: any) {
  setLoading(true);
  await fetchIndividualApi({
    setterFunction: (data: any) => {
      setIndividualData(() => data);
      let perferenceId: any = allSearchModules?.find(
        (per: any) => per?.name === data?.perference_id,
      );
      setSelectedSearchModule?.(perferenceId);
    },
    id: id,
    url: "alert",
    enqueueSnackbar,
    queryParam: ``,
  });
  setLoading(false);
  setAlertContainerValue?.("sign--alert");
  setOpenModalBox(true);
}
