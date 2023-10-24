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
  pokerSessions: HoldemPokerSession[] | null;
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

  const [pokerSessions, setPokerSessions] = useState<HoldemPokerSession[] | null>(null);

  useEffect(() => {
    const newSocket = io("http://127.0.0.1:8100/holdem");
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected!');
    })
    
    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Connected!');
    })

    newSocket.on('sessions', (data) => {
      setPokerSessions(data);
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
    <PokerServiceContext.Provider value={{ socket, pokerSessions }}>
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
