import { Autocomplete } from '@mui/material';

export default function SearchSelect() {
  const options = [
    {
      label: 'hello',
      id: 1
    },
    {
      label: 'system',
      id: 2
    }
  ];
  return (
    <>
      <Autocomplete
        sx={{
          display: 'inline-block',
          '& input': {
            width: 200,
            bgcolor: 'background.paper',
            color: theme =>
              theme.palette.getContrastText(theme.palette.background.paper)
          }
        }}
        id="custom-input-demo"
        options={options}
        renderInput={params => (
          <div ref={params.InputProps.ref}>
            <input type="text" {...params.inputProps} />
          </div>
        )}
      />
    </>
  );
}
