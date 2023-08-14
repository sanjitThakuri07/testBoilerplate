import { ConfigTableUrlUtils } from "src/modules/config/generalSettings";
import React, { useEffect, useState } from "react";
import useAppStore from "src/store/zustand/app ";

export const defaultPayloadValue = ({ systemParameters }: any) => ({
  page: 1,
  size: systemParameters?.rows_count || 5,
  archived: "",
  q: "",
  filterQuery: "",
});

export function usePayloadHook() {
  const { systemParameters }: any = useAppStore();

  const [urlUtils, setUrlUtils] = React.useState<ConfigTableUrlUtils>({
    page: 1,
    size: systemParameters?.rows_count || 5,
    archived: "",
    q: "",
    filterQuery: "",
  });

  React.useEffect(() => {
    if (!systemParameters?.rows_count) return;
    setUrlUtils((prev: any) => ({ ...prev, size: systemParameters?.rows_count || 5 }));
  }, [systemParameters]);

  // Define any other functions or logic that you need

  // Return the data and the setState function
  return [urlUtils, setUrlUtils] as const;
}
