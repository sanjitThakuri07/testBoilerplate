import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

const CONSTANTS = {
  DELETING_SPEED: 30,
  TYPING_SPEED: 150,
};

const TypewriterStyles = styled('div')`
  h1 {
    color: #00ff41;
  }

  #cursor {
    border-left: 0.1em solid #00ff41;
    animation: blink 0.7s steps(1) infinite;
  }

  @keyframes blink {
    50% {
      border-color: transparent;
    }
  }
`;

function TypeWriter({ messages, heading }: any) {
  const [state, setState] = useState({
    text: '',
    message: '',
    isDeleting: false,
    loopNum: 0,
    typingSpeed: CONSTANTS.TYPING_SPEED,
  });

  useEffect(() => {
    let timer: any = '';
    const handleType = () => {
      setState((cs) => ({
        ...cs, // cs means currentState
        text: getCurrentText(cs),
        typingSpeed: getTypingSpeed(cs),
      }));
      timer = setTimeout(handleType, state.typingSpeed);
    };
    handleType();
    return () => clearTimeout(timer);
  }, [state.isDeleting]);

  useEffect(() => {
    if (!state.isDeleting && state.text === state.message) {
      setTimeout(() => {
        setState((cs) => ({
          ...cs,
          isDeleting: true,
        }));
      }, 500);
    } else if (state.isDeleting && state.text === '') {
      setState((cs) => ({
        ...cs, // cs means currentState
        isDeleting: false,
        loopNum: cs.loopNum + 1,
        message: getMessage(cs, messages),
      }));
    }
  }, [state.text, state.message, state.isDeleting, messages]);

  function getCurrentText(currentState: any) {
    return currentState.isDeleting
      ? currentState.message.substring(0, currentState.text.length - 1)
      : currentState.message.substring(0, currentState.text.length + 1);
  }

  function getMessage(currentState: any, data: any) {
    return data[Number(currentState.loopNum) % Number(data.length)];
  }

  function getTypingSpeed(currentState: any) {
    return currentState.isDeleting ? CONSTANTS.TYPING_SPEED : CONSTANTS.DELETING_SPEED;
  }

  return (
    <TypewriterStyles>
      <h1>
        <span>{state.text}</span>
        <span id="cursor" />
      </h1>
    </TypewriterStyles>
  );
}
export default TypeWriter;
