import * as React from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Stack, Tab } from '@mui/material';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

const AssignActivityTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  let type = searchParams.get('type');
  if (type === null) {
    type = '';
  }

  const isActive = (path: string) => {
    return type === path ? 'active' : '';
  };

  return (
    <Stack direction="row" alignItems="center" className="config-filter-buttons">
      <Button className={isActive('')} onClick={() => navigate('/assign-activities')}>
        All Activities
      </Button>
      <Button
        className={isActive('assigned')}
        onClick={() => navigate('/assign-activities?type=assigned')}>
        Assigned to me
      </Button>
      <Button
        className={isActive('overdue')}
        onClick={() => navigate('/assign-activities?type=overdue')}>
        Overdue Activities
      </Button>
    </Stack>
  );
};

export default AssignActivityTabs;
