import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import FinanceConfig from '../OverallConfiguration/FinanceConfig';

export default function FinanceSettingLayout({ children }: any) {
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
      <Box sx={{ px: '20px' }}>{!ignoreHeaderTab && <FinanceConfig />}</Box>
      <Outlet />
      {children}
    </Box>
  );
}
