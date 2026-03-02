"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { getAuthToken } from "@/services/chat";

interface ChatSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const ChatSocketContext = createContext<ChatSocketContextType>({
  socket: null,
  isConnected: false,
});

export function useChatSocket() {
  return useContext(ChatSocketContext);
}

interface ChatSocketProviderProps {
  children: ReactNode;
}

export function ChatSocketProvider({ children }: ChatSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    const token = await getAuthToken();
    if (!token) return;

    const apiUrl = process.env.BACKEND_URL || 'https://loca-space.onrender.com';

    const newSocket = io(`${apiUrl}/chat`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup?.then((fn) => fn?.());
    };
  }, [connect]);

  return (
    <ChatSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </ChatSocketContext.Provider>
  );
}
