import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const screenOptions: any = {
  MOBILE: 'Mobile',
  ANDROID: 'Android',
  TABLET: 'Tablet',
  IPAD: 'Ipad',
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ children, handleChange, setValue, value }: any) {
  return (
    <>
      <>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Iphone" {...a11yProps(0)} />
          <Tab label="Android" {...a11yProps(1)} />
          <Tab label="Ipad" {...a11yProps(2)} />
        </Tabs>
      </>
      <TabPanel value={value} index={0}>
        {children}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {children}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {children}
      </TabPanel>
    </>
  );
}
