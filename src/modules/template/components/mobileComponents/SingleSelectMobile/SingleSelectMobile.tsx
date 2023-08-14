import { Button } from '@mui/material';
import { ColourOption, colourOptions } from '../MultipleSelectMobile/multiple_data';

const SingleSelectMobile = ({ item }: any) => {
  return (
    <div id="SingleSelectMobile">
      <div className="mobile_component_box_wrapper_heading">{item.label}</div>

      {colourOptions.slice(2, 7).map((option: ColourOption) => {
        const labelId = `checkbox-list-label-${option.label}`;
        return (
          <Button
            fullWidth
            variant="outlined"
            key={option.label}
            sx={{ mt: 1, color: option.color, borderColor: option.color }}
            className={labelId}>
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};

export default SingleSelectMobile;
