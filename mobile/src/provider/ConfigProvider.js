import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "~provider/UserProvider";
import { getConfiguration } from "~services/getConfig";

const ConfigContext = React.createContext();

ConfigContext.displayName = "ConfigContext";

const ConfigProvider = ({ children }) => {
  const { auth, userData } = useContext(UserContext);
  const [configData, setConfigData] = useState(null);
  const fetchConfigInformation = async () => {
    let data = await getConfiguration();

    if (data) {
      setConfigData(data);
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        configData,
        setConfigData,
        fetchConfigInformation,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export { ConfigProvider, ConfigContext };
