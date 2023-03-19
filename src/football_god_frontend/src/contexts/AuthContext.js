import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);

  useEffect(() => {
    const initAuthClient = async () => {
      const authClient = await AuthClient.create();
      setAuthClient(authClient);
    };
    initAuthClient();
  }, []);

  return (
    <AuthContext.Provider value={authClient}>
      {children}
    </AuthContext.Provider>
  );
};
