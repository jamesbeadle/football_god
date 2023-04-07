import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  useEffect(() => {
    const initAuthClient = async () => {
      const authClient = await AuthClient.create();
      setAuthClient(authClient);

      const isLoggedIn = await authClient.isAuthenticated();
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn) {
        const identity = authClient.getIdentity();
        Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
        const userIsAdmin = await football_god_backend_actor.isAdmin();
        setIsAdmin(userIsAdmin);
      } else {
        setIsAdmin(false);
      }
    };
    initAuthClient();
  }, [isAuthenticated]);

  const login = async () => {
    await authClient.login({
      identityProvider: process.env.II_URL,
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => {
        setIsAuthenticated(true);
        const identity = authClient.getIdentity();
        Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
        const userIsAdmin = await football_god_backend_actor.isAdmin();
        setIsAdmin(userIsAdmin);
      }
    });
  };

  const logout = async () => {
    await authClient.logout();
    console.log("Logged out");
    setIsAuthenticated(false);
    setIsAdmin(false);
  };


  return (
    <AuthContext.Provider value={ { authClient, isAdmin, isAuthenticated, setIsAdmin, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
