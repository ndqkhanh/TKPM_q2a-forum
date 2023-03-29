import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { getMyProfile } from "~services/getProfile";
import { API_URL } from "@env";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const [userData, setUserData] = useState(null);
  const fetchUserInformation = async () => {
    let token = await AsyncStorage.getItem("UserToken");

    let data = await getMyProfile(token);

    if (data) {
      setUserData(data);
      setAuth(true);
    }
  };

  useEffect(() => {
    check();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        fetchUserInformation,
        checkAuth,
        auth,
        setAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
