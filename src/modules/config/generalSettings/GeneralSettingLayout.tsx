import React from 'react';
import { Box } from '@mui/system';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ConfigFilter from './ConfigFilter';
import GeneralSettingConfig from '../OverallConfiguration/GeneralSettingConfig';
import { useEffect } from 'react';

export default function GeneralSettingLayout({ children }: any) {
  const location = useLocation();
  const [ignoreHeaderTab, setIgnoreHeaderTab] = React.useState<boolean>(false);

  useEffect(() => {
    if (location.pathname.includes('add')) {
      setIgnoreHeaderTab(true);
    } else if (location.pathname.includes('edit')) {
      setIgnoreHeaderTab(true);
    } else {
      setIgnoreHeaderTab(false);
    }
  }, [location.pathname]);

  return (
    <Box>
      <Box sx={{ px: '20px' }}>{!ignoreHeaderTab && <GeneralSettingConfig />}</Box>
      <Outlet />
      {children}
    </Box>
  );
}
