import React, { useEffect } from "react";
import BASDataTableUpdate from "src/modules/table/BASDataTable";
import { ConfigTableUrlUtils } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { useNavigate } from "react-router-dom";
import { usePermissionStore } from "src/store/zustand/permission";
import { permissionList } from "src/constants/permission";
import { fetchTableData } from "src/modules/apiRequest/apiRequest";
import { usePayloadHook } from "src/constants/customHook/payloadOptions";

interface NavigateColumnProps {
  navigateColumnName: string;
  navigateTo: Function | null;
}
const ViewExternalResponse = ({ externalResponseId }: any) => {
  const navigate = useNavigate();
  const [presentFilter, setPresentFilter] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [ExternalResponseSetData, setExternalResponseSetData] = React.useState<any>({
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 5,
    total: 0,
    archivedCount: 0,
  });
  const [deleteEndpoint, setDeleteEndpoint] = React.useState("");
  const [totalCount, setTotalCount] = React.useState(0);

  const [urlUtils, setUrlUtils] = usePayloadHook();
  const onDataTableChange = ({ key, value }: any) => {
    setUrlUtils({
      ...urlUtils,
      [key]: value,
    });

    // if (key === 'filterQuery' && !value) {
    //   setFilterValue(EXTERNAL_ATTRIBUTES_INITIAL_VALUE);
    // }
  };
  const [pathName, setPathName] = React.useState({
    backendUrl: "",
    sectionTitle: "",
    buttonName: "",
    frontEndUrl: "",
    editFrontEndUrlGetter: null,
    deleteFieldName: "id",
    subSectionUrl: null,
    popUpField: { key: "", label: "", fieldName: "", componentType: "" },
  });
  const [onNavigate, setOnNavigate] = React.useState<NavigateColumnProps>({
    navigateColumnName: "contract_no",
    navigateTo: (id: any) => {
      navigate(`/finance/tariffs?tariff=${id}`);
    },
  });
  const { permissions } = usePermissionStore();

  const getData = async () => {
    setLoading(true);
    await fetchTableData({
      api: "external-response",
      setTotalCount,
      setData: setExternalResponseSetData,
      urlUtils,
    });
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <BASDataTableUpdate
        data={ExternalResponseSetData}
        deletePath={deleteEndpoint}
        onDataChange={onDataTableChange}
        setterFunction={setExternalResponseSetData}
        configName={pathName?.buttonName}
        tableIndicator={pathName}
        count={totalCount}
        urlUtils={urlUtils}
        onTitleNavigate={onNavigate}
        textTitleLength={50}
        csvDownload={false}
        backendUrl={pathName?.backendUrl}
        tableOptions={{
          chipOptionsName: ["status"],
        }}
        navigateTitle={{
          navigateMode: "view",
          column: "contract_no",
          navigate: true,
        }}
        showAdd={false}
        permissions={permissions}
        //   permission={}
        allowFilter={{
          filter: true,
          className: "filter__field",
          filteredOptionLength: presentFilter,
        }}
        //     FilterComponent={({ filterModal, setFilterModal }: any) => {
        //       return (
        //         <CommonFilter
        //           setFilterUrl={setUrlUtils}
        //           filterModal={filterModal}
        //           INITIAL_VALUES={converToProperFormikFormat({
        //             data: getFilterValue,
        //             getFilterValue,
        //           })}
        //           setFilterModal={setFilterModal}
        //           setPresentFilter={setPresentFilter}
        //           filterObj={{ getFilterValue, setFilterValue }}></CommonFilter>
        //       );
        //     }}
        //     filterChildren={
        //       <FilteredValue
        //         getFilterValue={getFilterValue}
        //         setFilterValue={setFilterValue}
        //         onDataTableChange={onDataTableChange}
        //       />
        //     }
      ></BASDataTableUpdate>
    </>
  );
};

export default ViewExternalResponse;
