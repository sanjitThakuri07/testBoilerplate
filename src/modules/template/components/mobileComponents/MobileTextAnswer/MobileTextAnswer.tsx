import { TextareaAutosize, TextField } from '@mui/material';
import ErrorComponent from 'components/Error';
import { errorValue } from 'containers/template/validation/inputLogicCheck';
import ExtraUserFields from 'containers/template/components/mobileComponents/ReusableMobileComponent/ExtraUserFields';
import SpeechPage from '../MobileSpeechRecognition/MobileSpeechRecognition';

const MobileTextAnswer = ({
  value,
  onChange,
  item,
  errors,
  handleFormikFields,
  disabled,
  setTyping,
  ...attr
}: any) => {
  return (
    <>
      <div id="MobileTextAnswer">
        <div className="mobile_component_box_wrapper_heading">{item.label}</div>
        <div style={{ position: 'relative' }}>
          {item.variables?.format === 'text' ? (
            <TextField
              fullWidth
              id="fullWidth"
              value={value}
              onChange={onChange}
              disabled={disabled}
              className={`${disabled ? 'disabled' : 'custom__input-style'}`}
              {...attr}
            />
          ) : item.variables?.format === 'text_area' ? (
            <TextareaAutosize
              id="fullWidth"
              aria-label="empty textarea"
              placeholder=""
              minRows={3}
              value={value}
              onChange={onChange}
              style={{
                width: '100%',
                padding: '0.45rem 2px',
                borderRadius: '8px',
                border: '1px solid #D0D5DD',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
              disabled={disabled}
              className={`${disabled ? 'disabled' : ''}`}
              {...attr}
            />
          ) : null}
          <div className="speech__box">
            {item.response_choice !== 'external' && !disabled && (
              <SpeechPage
                onConfirm={(data: any) => {
                  setTyping?.((prev: any) => (prev.length ? prev + data : data));
                  handleFormikFields?.setFieldValue(
                    `${item?.component}__${item?.id}.value`,
                    handleFormikFields?.values?.[`${item?.component}__${item?.id}`]?.value
                      ? `${
                          handleFormikFields?.values?.[`${item?.component}__${item?.id}`]?.value
                        } ${data}`
                      : `${data}`,
                  );
                }}
              />
            )}
          </div>
        </div>
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
      </div>
      <ExtraUserFields item={item} handleFormikFields={handleFormikFields} disabled={disabled} />
    </>
  );
};

export default MobileTextAnswer;
