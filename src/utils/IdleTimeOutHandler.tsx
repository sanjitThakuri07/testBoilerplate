import moment from "moment";
import { useEffect, useState } from "react";

import IdleTimeOutModal from "src/components/IdleTimeOutModal";

const idle = 15 * 60 * 60 * 1000;
function IdleTimeOutHandler(props) {
  let timerData: any;
  const { logOut, timeOutInterval } = props;
  const [intervalData, setIntervalData] = useState(undefined);

  const [isLogout, setLogout] = useState(false);

  const [elapsedTime, setElaspedTime] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const events = ["click", "load", "keydown", "mousemove"];

  const startTimer = () => {
    if (timerData) {
      clearTimeout(timerData);
    }
    if (intervalData) {
      clearInterval(intervalData);
    }

    timerData = setTimeout(() => {
      const lastInteractionTime = localStorage.getItem("lastInteractionTime");
      const diff = moment.duration(moment().diff(moment(lastInteractionTime)));
      const timeoutInterval = timeOutInterval || idle;

      if (!isLogout) {
        if (diff._milliseconds < timeoutInterval) {
          startTimer();
        } else {
          setShowModal(true);
        }
      }
    }, timeOutInterval || idle);
  };

  const eventHandler = () => {
    if (!isLogout) {
      localStorage.setItem("lastInteractionTime", moment());

      if (timerData) {
        startTimer();
      }
    }
  };

  const addEvents = () => {
    startTimer();
    events.forEach((eventName) => {
      window.addEventListener(eventName, eventHandler);
    });
  };

  const removeEvents = () => {
    events.forEach((eventName) => {
      window.removeEventListener(eventName, eventHandler);
    });
  };

  useEffect(() => {
    addEvents();
  }, []);

  useEffect(() => {
    if (showModal) {
      setIntervalData(
        setInterval(() => {
          setElaspedTime((prev) => prev + 1000);
        }, 1000),
      );
    } else {
      clearInterval(intervalData);
      setElaspedTime(0);
    }
  }, [showModal]);

  const handleContinueSession = () => {
    setShowModal(false);
    setLogout(false);
    setElaspedTime(-1);
  };

  const handleLogout = () => {
    removeEvents();
    clearTimeout(timerData);
    clearInterval(intervalData);

    setLogout(true);
    setShowModal(false);

    logOut();

    new Notification("You have been logged out because of inactivity.");
  };

  return (
    <IdleTimeOutModal
      showModal={showModal}
      handleContinue={handleContinueSession}
      handleLogout={handleLogout}
      elapsedTime={elapsedTime}
    />
  );
}

export default IdleTimeOutHandler;
