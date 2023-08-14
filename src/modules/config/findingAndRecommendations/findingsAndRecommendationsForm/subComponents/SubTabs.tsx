import React from 'react';
import { Button, Typography, Stack } from '@mui/material';

const SubTabs = ({ searchObject, navigate, location, searchParams }: any) => {
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
          navigate({
            pathname: location?.pathname,
            search: `${searchParams.toString().replace('&type=findings', '')}`,
          });
        }}>
        Sub Category
      </Button>
      <Button
        type="button"
        className={`${searchObject?.['type'] === 'findings' ? 'active' : ''}`}
        onClick={(e) => {
          navigate({
            pathname: location?.pathname,
            search:
              searchObject?.type === 'findings'
                ? `${searchParams.toString()}`
                : `${searchParams.toString()}&type=findings`,
          });
        }}>
        Findings
      </Button>
    </Stack>
  );
};

export default SubTabs;
