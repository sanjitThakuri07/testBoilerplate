import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

function DeletableChips({ filterData, onDelete }: any) {
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <>
      {filterData?.name ? (
        <Stack direction="row" spacing={1}>
          <Chip
            label={filterData?.name}
            onDelete={() => {
              onDelete(filterData);
            }}
          />
        </Stack>
      ) : (
        <></>
      )}
    </>
  );
}

export default DeletableChips;
