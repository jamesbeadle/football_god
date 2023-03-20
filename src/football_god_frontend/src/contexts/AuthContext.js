import React, { useState, useEffect } from 'react';
import { LocalStorage, AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expiryTime, setExpiryTime] = useState(null);
 
  useEffect(() => {
    const initAuthClient = async () => {
      const storedIdentityStr = localStorage.getItem('identity');
      const authClient = await AuthClient.create(JSON.parse(storedIdentityStr));

      if (storedIdentityStr) {
        setIsAuthenticated(true);
      }

      const storedIsAdmin = localStorage.getItem('isAdmin');
      if (storedIsAdmin !== null) {
        setIsAdmin(storedIsAdmin === 'true');
      }

      setAuthClient(authClient);

      const storedExpiryTime = localStorage.getItem('expiryTime');
      if (storedExpiryTime) {
        setExpiryTime(Number(storedExpiryTime));
      }
    };
    initAuthClient();
  }, []);

  useEffect(() => {
    if (expiryTime) {
      const timer = setTimeout(() => {
        logout();
      }, expiryTime - Date.now());

      return () => clearTimeout(timer);
    }
  }, [expiryTime]);

  useEffect(() => {
    const checkExpiry = () => {
      const expiryTime = localStorage.getItem('expiryTime');
      if (expiryTime && Date.now() > Number(expiryTime)) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('identity');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('expiryTime');
        authClient.logout();
      }
    };
  
    const intervalId = setInterval(checkExpiry, 60 * 1000); // Check every minute
  
    return () => {
      clearInterval(intervalId);
    };
  }, [authClient]);

  const login = async () => {
    await authClient.login({
      identityProvider: process.env.II_URL,
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
        const userIsAdmin = await football_god_backend_actor.isAdmin();
        setIsAdmin(userIsAdmin);
        setIsAuthenticated(true);
        localStorage.setItem('identity', JSON.stringify(identity));
        localStorage.setItem('isAdmin', userIsAdmin);

        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        const expirationTime = Date.now() + oneDayInMilliseconds;
        localStorage.setItem('expiryTime', expirationTime);
        setExpiryTime(expirationTime);

      }
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    authClient.logout();
    localStorage.removeItem('identity');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('expiryTime');
    setExpiryTime(null);
  };


  return (
    <AuthContext.Provider value={ { authClient, isAdmin, isAuthenticated, setIsAdmin, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
