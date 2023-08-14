import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/system';
import UserConfig from '../OverallConfiguration/UserConfig';

export default function UsersSettingLayout({ children }: any) {
  const location = useLocation();
  const [ignoreHeaderTab, setIgnoreHeaderTab] = React.useState<boolean>(false);

  useEffect(() => {
    if (location.pathname.includes('add')) {
      setIgnoreHeaderTab(true);
    } else if (location.pathname.includes('profile')) {
      setIgnoreHeaderTab(true);
    } else {
      setIgnoreHeaderTab(false);
    }
  }, [location.pathname]);
  return (
    <Box>
      <Box sx={{ px: '20px' }}>{!ignoreHeaderTab && <UserConfig />}</Box>
      <Outlet />
      {children}
    </Box>
  );
}
