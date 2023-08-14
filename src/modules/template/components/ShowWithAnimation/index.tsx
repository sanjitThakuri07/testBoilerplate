import { styled } from '@mui/material';
import React from 'react';
import useDelayUnmount from './useDelayUnmount';

const Container = styled('div')`
  @keyframes inAnimation {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes outAnimation {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

function ShowWithAnimation({
  children,
  isMounted,
  id,
  style = {},
  ...rest
}: {
  style?: any;
  id?: string;
  children: React.ReactNode;
  isMounted: boolean;
}) {
  const showDiv = useDelayUnmount(isMounted, 350);
  const mountedStyle = { animation: 'inAnimation 350ms ease-in' };
  const unmountedStyle = {
    animation: 'outAnimation 370ms ease-out',
    animationFillMode: 'forwards',
  };
  return (
    <Container id={id} style={style} {...rest}>
      {showDiv && <div style={isMounted ? mountedStyle : unmountedStyle}>{children}</div>}
    </Container>
  );
}

export default ShowWithAnimation;
