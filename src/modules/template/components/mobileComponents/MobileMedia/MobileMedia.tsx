import { errorValue } from 'containers/template/validation/inputLogicCheck';
import ErrorComponent from 'components/Error';
import ExtraUserFields from '../ReusableMobileComponent/ExtraUserFields';

const MobileMedia = ({ item, value, onChange, handleFormikFields, errors, disabled }: any) => {
  return (
    <div id="MobileMedia">
      {/* <UploadImage /> */}
      <div className="mobile_component_box_wrapper_heading">{item.label}</div>
      <br />
      {/* <ImageUploader
        item={item}
        value={value}
        onChange={onChange}
        handleFormikFields={handleFormikFields}
        errors={errors}
      /> */}

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

export default MobileMedia;
