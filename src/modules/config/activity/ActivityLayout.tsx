import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/system';
import ActivityConfig from '../OverallConfiguration/ActivityConfig';

export default function ActivityLayout({ children }: any) {
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
      <Box sx={{ px: '20px' }}>{!ignoreHeaderTab && <ActivityConfig />}</Box>
      <Outlet />
      {children}
    </Box>
  );
}
