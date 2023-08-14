import { useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

function useSocketManagement({ url }: { url?: any }) {
  const [socket, setSocket] = useState<any>();
  const [connected, setConnected] = useState<boolean>();

  const setSocketConnected = () => {
    setConnected(true);
  };

  const setSocketDisconnected = () => {
    setConnected(false);
  };

  const connectSocket = () => {
    try {
      const token = window?.localStorage.getItem('access');
      const connection = new W3CWebSocket(`${url}?access=${token}`);
      // const connection = new W3CWebSocket(`${url}`);

      setSocket(connection);
    } catch (err) {
      console.log('handleUserJoined error: ', err);
    }
  };

  return {
    socket,
    connected,
    setSocketConnected,
    setSocketDisconnected,
    connectSocket,
  };
}

export default useSocketManagement;
