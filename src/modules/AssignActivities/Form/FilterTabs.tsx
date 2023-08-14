import * as React from 'react';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Stack, Tab } from '@mui/material';

const FilterTabs = ({ activeFilter, setActiveFilter }: any) => {
  const isActive = (path: string) => {
    return activeFilter === path ? 'active' : '';
  };

  return (
    <Stack direction="row" alignItems="center" className="config-filter-buttons">
      <Button className={isActive('')} onClick={() => setActiveFilter('')}>
        Assignees
      </Button>
      <Button
        className={isActive('user_department')}
        onClick={() => setActiveFilter('user_department')}>
        User Department
      </Button>
      <Button className={isActive('due_date')} onClick={() => setActiveFilter('due_date')}>
        Due Date
      </Button>
      <Button
        className={isActive('created_by&modified_by')}
        onClick={() => setActiveFilter('created_by&modified_by')}>
        Created By & Modified By
      </Button>
      <Button className={isActive('status')} onClick={() => setActiveFilter('status')}>
        Status
      </Button>
      <Button className={isActive('inspected_by')} onClick={() => setActiveFilter('inspected_by')}>
        Inspected By
      </Button>
    </Stack>
  );
};

export default FilterTabs;
