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
      const isLoggedIn = await authClient.isAuthenticated();
      
      setIsAuthenticated(isLoggedIn);
      setAuthClient(authClient);
      
    };
    initAuthClient();
  }, []);

  useEffect(() => {
    if (!authClient) return;
  
    const interval = setInterval(() => {
      checkLoginStatus();
    }, 60000);
  
    return () => {
      clearInterval(interval);
    };
  }, [authClient]);
  

  const checkLoginStatus = async () => {
    const isLoggedIn = await authClient.isAuthenticated();
    if (isLoggedIn && isTokenValid()) {
      const identity = authClient.getIdentity();
      Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
      const userIsAdmin = await football_god_backend_actor.isAdmin();
      setIsAdmin(userIsAdmin);
      setIsAuthenticated(true);
    } else {
      logout();
    }
  };

  const isTokenValid = () => {
    try {
      const identity = authClient.getIdentity();
      if (!identity || !identity._delegation || !identity._delegation.delegations) return false;
  
      const delegation = identity._delegation.delegations[0];
      if (!delegation) return false;
  
      const expiration = BigInt(delegation.delegation.expiration);
      const currentTime = BigInt(Date.now() * 1000000); 
      return currentTime < expiration;
    } catch (error) {
      return false;
    }
  };
  

  const login = async () => {
    await authClient.login({
      identityProvider: process.env.II_URL,
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
        const userIsAdmin = await football_god_backend_actor.isAdmin();
        setIsAdmin(userIsAdmin);
        setIsAuthenticated(true);
      }
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    authClient.logout();
  };


  return (
    <AuthContext.Provider value={ { authClient, isAdmin, isAuthenticated, setIsAdmin, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
