import React from 'react';
import { Button, Typography, Stack } from '@mui/material';

const SubTabs = ({ searchObject, navigate }: any) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      className="config-filter-buttons-limited invoice__buttons"
      sx={{
        marginBottom: '20px',
        width: 'auto',
        display: 'inline-flex',
      }}>
      <Button
        type="button"
        className={`${!searchObject?.['type'] ? 'active' : ''}`}
        onClick={(e) => {
          // onDataTableChange({ key: 'type', value: '' });
          navigate?.(`/finance/tariffs`);
        }}>
        All
      </Button>
      <Button
        type="button"
        className={`${searchObject?.['type'] === 'Regular' ? 'active' : ''}`}
        onClick={(e) => {
          // onDataTableChange({ key: 'type', value: 'Regular' });
          navigate?.(`/finance/tariffs?type=Regular`);
        }}>
        Regular
      </Button>
      <Button
        type="button"
        className={`${searchObject?.['type'] === 'Converted' ? 'active' : ''}`}
        onClick={(e) => {
          // onDataTableChange({ key: 'type', value: 'Converted' });
          navigate?.(`/finance/tariffs?type=Converted`);
        }}>
        Converted
      </Button>
    </Stack>
  );
};

export default SubTabs;
