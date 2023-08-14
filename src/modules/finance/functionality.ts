export const fetchData = async ({
  id,
  setLoading,
  fetchIndividualApi,
  setTotalCount,
  setPathName,
  enqueueSnackbar,
  setData,
  url,
  domain,
  location,
  backendUrl,
  buttonName,
  urlUtils,
}: any) => {
  console.log({ urlUtils });
  setLoading?.(true);
  await fetchIndividualApi({
    id,
    url,
    enqueueSnackbar,
    domain,
    queryParam: urlUtils,
    setterFunction: (data: any) => {
      setPathName?.((prev: any) => ({
        ...prev,
        backendUrl: backendUrl ? backendUrl : url,
        buttonName,
        sectionTitle: data?.info?.tariff || data?.info?.parent || '',
        frontEndUrl: `${location?.pathname}/add${location?.search}`,
        subSectionUrl: (id: any) => {
          return `${
            data?.info?.title?.toLowerCase() === 'recommendations'
              ? `${location?.pathname}/add?category=${id}`
              : `${location?.pathname}/add?findings=${id}`
          }`;
        },
        editFrontEndUrlGetter: (id: number) =>
          `${location?.pathname}/edit/${id}${location?.search}`,
        deleteFieldName: 'id',
      }));
      setData?.({ ...data, archivedCount: data?.info?.archived_count });
      setTotalCount?.(data.total);
    },
  });
  setLoading?.(false);
};
