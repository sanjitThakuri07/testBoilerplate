import { defaultPayloadValue } from "src/constants/customHook/payloadOptions";

const getTableData = async ({
  searchObject,
  navigate,
  setOnNavigate,
  setStaticHeader,
  setPathName,
  fetchData,
  setCrumbData,
  getData,
  location,
  setUrlUtils,
  systemParameters,
}: any) => {
  if (Number(searchObject?.["category"])) {
    // let newDataSet = { ...findingAndRecommendation };
    fetchData({
      id: Number(searchObject?.["category"]),
      url: `finding-category/finding`,
      domain: "Finding",
    });

    setOnNavigate((prev: any) => ({
      navigateColumnName: "description",
      navigateTo: (id: any, title?: any) => {
        setUrlUtils?.(defaultPayloadValue(systemParameters));
        navigate(`/config/findings-recommendations?findings=${id}`);
      },
    }));
    setStaticHeader({
      id: "Id",
      description: "Findings",
      recommendations: "Recommendations",
      risk_factor: "Risk Factor",
      attachments: "Attachment",
      // status: 'Status(All)',
    });
    setPathName((prev: any) => ({
      ...prev,
      backendUrl: "finding-category/finding",
      deleteFieldName: { value: "id", key: "description" },
    }));
  } else if (Number(searchObject?.["findings"])) {
    fetchData({
      id: Number(searchObject?.["findings"]),
      url: `finding-category/recommendation`,
      domain: "Recommendation",
    });
    setStaticHeader({
      id: "Id",
      description: "Recommendations",
      attachments: "Attachments",
      // status: 'Status(All)',
    });
    setOnNavigate((prev: any) => ({ navigateColumnName: "", navigateTo: () => {} }));
  } else if (Number(searchObject?.["p_category"] && !searchObject?.type)) {
    // getData();
    fetchData({
      id: Number(searchObject?.["p_category"]),
      customURL: true,
      url: `finding-category/?id=${searchObject?.["p_category"]}`,
      domain: "Sub Category",
    });

    setOnNavigate({
      navigateColumnName: "name",
      navigateTo: (id: any, title?: any) => {
        setUrlUtils?.(defaultPayloadValue(systemParameters));
        setPathName((prev: any) => ({
          ...prev,
          backendUrl: "finding-category",
          buttonName: "New Finding",
          sectionTitle: title || "",
          frontEndUrl: `${location?.pathname}/add`,
          // subSectionUrl: (id: number) => {
          //   return `${location?.pathname}/add?category=` + Number(id);
          // },
          editFrontEndUrlGetter: (id: number) => {
            return `${location?.pathname}/edit/${id}`;
          },
          popUpField: { key: "findings", label: "All Findings" },
          deleteFieldName: "id",
        }));
        // Replace the current URL with the updated query parameters
        navigate(`/config/findings-recommendations?category=${id}`);
      },
    });
    // setCrumbData([{ label: 'Category', path: 'finding-recommendations' }]);
    setStaticHeader({
      name: "Sub Category Name",
      status: "Status(All)",
      notes: "Notes",
    });
  } else if (searchObject?.type === "findings") {
    setStaticHeader({
      id: "Id",
      description: "Findings",
      recommendations: "Recommendations",
      risk_factor: "Risk Factor",
      attachments: "Attachment",
      // status: 'Status(All)',
    });
    await fetchData({
      id: Number(searchObject?.["p_category"]),
      url: `main-category/finding`,
      domain: "Category",
    });

    setOnNavigate({
      navigateColumnName: "description",
      navigateTo: (id: any, title?: any) => {
        setUrlUtils?.(defaultPayloadValue(systemParameters));
        setPathName((prev: any) => ({
          ...prev,
          backendUrl: "finding-category",
          buttonName: "New Finding",
          sectionTitle: title || "",
          frontEndUrl: `${location?.pathname}/add`,
          subSectionUrl: (id: number) => {
            return `${location?.pathname}/add?category=` + Number(id);
          },
          editFrontEndUrlGetter: (id: number) => {
            return `${location?.pathname}/edit/${id}`;
          },
          popUpField: { key: "recommendations", label: "All Recommendations" },
          deleteFieldName: "id",
        }));
        // Replace the current URL with the updated query parameters
        navigate(
          `${location.pathname}${location?.search?.replace("&type=findings", "")}&findings=${id}`,
        );
      },
    });
  } else {
    getData();
    setCrumbData([]);
    setOnNavigate({
      navigateColumnName: "name",
      navigateTo: (id: any, title?: any) => {
        setUrlUtils?.(defaultPayloadValue(systemParameters));
        setPathName((prev: any) => ({
          ...prev,
          backendUrl: "finding-category",
          buttonName: "New Sub Category",
          sectionTitle: title || "",
          frontEndUrl: `${location?.pathname}/add`,
          subSectionUrl: (id: number) => {
            return `${location?.pathname}/add?category=${id}`;
          },
          editFrontEndUrlGetter: (id: number) => {
            return `${location?.pathname}/edit/${id}`;
          },
          popUpField: { key: "findings", label: "All Findings" },
          deleteFieldName: "id",
        }));

        // Replace the current URL with the updated query parameters
        navigate(`/config/findings-recommendations?p_category=${id}`);
      },
    });
    setStaticHeader({
      name: "Main Category Name",
      status: "Status(All)",
      notes: "Notes",
    });
    setPathName((prev: any) => ({ ...prev, backendUrl: "main-category" }));
  }
};

export { getTableData };
