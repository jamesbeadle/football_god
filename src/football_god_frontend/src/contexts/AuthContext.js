import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";
import { football_god_backend as football_god_backend_actor } from '../../../declarations/football_god_backend';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const initAuthClient = async () => {
      const authClient = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 60
        }
      });
      const isLoggedIn = await checkLoginStatus(authClient);
      
      if (isLoggedIn) {
        const identity = authClient.getIdentity();
        Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
        const userIsAdmin = await football_god_backend_actor.isAdmin();
        setIsAdmin(userIsAdmin);
      } else {
        setIsAdmin(false);
      }
      setAuthClient(authClient);
      setLoading(false);
    };
    initAuthClient();
  }, []);

  useEffect(() => {
    if (!authClient) return;

    const interval = setInterval(() => {
      checkLoginStatus(authClient);
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [authClient]);

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
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const checkLoginStatus = async (client) => {
    if(client == null){
      return false;
    }
    const isLoggedIn = await client.isAuthenticated();
    if (isLoggedIn && isTokenValid(client)) {
      setIsAuthenticated(true);
      return true;
    } else {
      return false;
    }
  };
  

  const isTokenValid = (client) => {
    try {
      const identity = client.getIdentity();
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


  return (
    <AuthContext.Provider value={ { authClient, isAdmin, isAuthenticated, setIsAdmin, setIsAuthenticated, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
