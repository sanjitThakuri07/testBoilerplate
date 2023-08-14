import CustomTextField from 'components/inputs/TextField';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon, IconButton } from '@mui/material';

import styles from './IconInput.module.scss';

interface Props {
  icon: any;
  iconColor?: string;
  onIconClick?: () => void;
  start?: boolean;
}

function IconInput({
  icon,
  iconColor,
  onIconClick,
  start,

  ...rest
}: Props &
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >) {
  return (
    <div className={styles.container}>
      <CustomTextField
        onChange={() => {}}
        {...rest}
        value={''}
        style={{ ...(start ? { paddingLeft: 40 } : { paddingRight: 40 }) }}
      />
      {onIconClick ? (
        <IconButton
          className={styles.absolute}
          onClick={onIconClick}
          size="small"
          sx={{
            ...(start ? { left: 10 } : { right: 10 }),
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
          }}>
          <Icon
            fontSize="small"
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center'
            }}>
            <FontAwesomeIcon
              color={iconColor ?? 'var(--grey-700)'}
              icon={icon}
              size="xs"
            />
          </Icon>
        </IconButton>
      ) : (
        <FontAwesomeIcon
          className={styles.absolute}
          color="var(--grey-700)"
          icon={icon}
          style={{
            ...(start ? { left: 10 } : { right: 10 })
          }}
        />
      )}
    </div>
  );
}

export default IconInput;
