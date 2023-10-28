import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface AppConfigContextValue {
  isSneakyCardPreview: boolean;
  toggleSneakyCardPreview: () => void;
}

const AppConfigContext = createContext<AppConfigContextValue | null>(null);

interface AppConfigProviderProps {
  children: ReactNode;
}

export const AppConfigProvider: React.FC<AppConfigProviderProps> = ({
  children,
}) => {
  const [isSneakyCardPreview, setIsSneakyCardPreview] = useState(
    localStorage.getItem("isSneakyCardPreview") === "true"
  );

  const handleToggleSneakyCardPreview = () => {
    if (isSneakyCardPreview) {
      localStorage.removeItem("isSneakyCardPreview");
      setIsSneakyCardPreview(false);
      return;
    }

    localStorage.setItem("isSneakyCardPreview", "true");
    setIsSneakyCardPreview(true);
  };

  return (
    <AppConfigContext.Provider
      value={{
        isSneakyCardPreview,
        toggleSneakyCardPreview: handleToggleSneakyCardPreview,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  const contextValue = useContext(AppConfigContext);

  if (!contextValue) {
    throw new Error("useAppConfig cannot be used outside of AppConfigProvider");
  }

  return contextValue;
};
