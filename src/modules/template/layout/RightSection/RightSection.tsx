// import { CustomTextField, ResponseTab } from 'containers/template/components';
import { CustomTextField } from "src/modules/template/components";
import ResponseTab from "src/modules/template/components/ResponseTab/OldResponseTab";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React from "react";
import { useTextAnswer } from "src/store/zustand/globalStates/templates/TextAnswer";

import "./RightSection.scss";

const RightSection = (updateDataState: any) => {
  const { rightSectionTabValue, setRightSectionTabValue } = useTextAnswer();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setRightSectionTabValue(newValue);
  };

  return (
    <div>
      <div id="RightSection">
        <TabContext value={rightSectionTabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange}>
              <Tab label="Question" value="1" />
              <Tab label="Response" value="2" />
            </TabList>
          </Box>
          <TabPanel
            value="1"
            style={{
              padding: "24px 0",
            }}
          >
            <>
              <CustomTextField />
            </>
          </TabPanel>
          <TabPanel
            value="2"
            style={{
              padding: "24px 0",
            }}
          >
            <ResponseTab updateDataState={updateDataState} />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

export default RightSection;
