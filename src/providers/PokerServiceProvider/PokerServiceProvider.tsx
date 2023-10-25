import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

import { HoldemPokerSession } from "../../types";

interface PokerServiceContextValue {
  socket: Socket;
}

const PokerServiceContext = createContext<PokerServiceContextValue | null>(null);

interface PokerServiceProviderProps {
  children: ReactNode;
}

export const PokerServiceProvider: React.FC<PokerServiceProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:8100/holdem`);
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected!');
    })
    
    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Connected!');
    })

    return () => {
      newSocket.close();
    };
  }, []);

  if (!socket || !isConnected) {
    // TODO: style
    return <>Connecting to the server...</>;
  }

  return (
    <PokerServiceContext.Provider value={{ socket }}>
      {children}
    </PokerServiceContext.Provider>
  );
};

export const usePokerService = () => {
  const contextValue = useContext(PokerServiceContext);

  if (!contextValue) {
    throw new Error('usePokerService cannot be used outside of PokerServiceProvider');
  }

  return contextValue;
}
