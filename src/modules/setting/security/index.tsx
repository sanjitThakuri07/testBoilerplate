import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import React from 'react';
import ChangePassword from './ChangePassword';
import './tabs.scss';
import TwoFactorAuthentication from './TwoFactorAuthentication';
import UserSecurity from './UserSecurity';

const AccountSecurity = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h3" color="primary">
        Security Settings
      </Typography>
      <Typography variant="body1" component="p">
        Update your private keys and others details here.
      </Typography>
      <Box className="setting-form-group">
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              className="rounded-tabs"
              TabIndicatorProps={{
                style: { display: 'none' },
              }}>
              <Tab
                sx={{ textTransform: 'capitalize' }}
                label="Change Password"
                value="1"
                className="tab-button"
              />
              {/* <Tab
                sx={{ textTransform: "capitalize" }}
                label="User Security"
                value="2"
                className="tab-button"
              /> */}
              <Tab
                sx={{ textTransform: 'capitalize' }}
                label="Two Factor Authentication"
                value="3"
                className="tab-button"
              />
            </TabList>
            <TabPanel value="1">
              <ChangePassword />
            </TabPanel>
            <TabPanel value="2">
              <UserSecurity />
            </TabPanel>
            <TabPanel value="3">
              <TwoFactorAuthentication />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountSecurity;
