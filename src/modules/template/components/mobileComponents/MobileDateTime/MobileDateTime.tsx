import ErrorComponent from 'components/Error';
import { errorValue } from 'containers/template/validation/inputLogicCheck';
import ExtraUserFields from '../ReusableMobileComponent/ExtraUserFields';

const MobileDateTime = ({
  item,
  value,
  onChange,
  handleFormikFields,
  errors,
  disabled,
  ...attr
}: any) => {
  const type =
    item.variables?.time && item.variables?.date
      ? 'datetime-local'
      : item.variables?.date
      ? 'date'
      : item.variables?.time
      ? 'time'
      : 'date';
  return (
    <div id="MobileDateTime">
      <div className="mobile_component_box_wrapper_heading">{item.label}</div>
      <input
        type={type}
        style={{ width: '100%', padding: '0.5rem 0', fontFamily: 'Inter, sans-serif' }}
        value={value}
        onChange={onChange}
        {...attr}
      />
      <>
        {errors &&
          errorValue?.map((err: any) => {
            return Object?.keys(errors || [])?.includes(err) ? (
              <ErrorComponent>{errors?.[err]}</ErrorComponent>
            ) : (
              <></>
            );
          })}
      </>
      <div>
        <ExtraUserFields item={item} handleFormikFields={handleFormikFields} disabled={disabled} />
      </div>
    </div>
  );
};

export default MobileDateTime;
