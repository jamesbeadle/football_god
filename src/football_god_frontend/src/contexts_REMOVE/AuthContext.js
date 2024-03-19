import { Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import React, { useEffect, useState } from "react";
import { football_god_backend as football_god_backend_actor } from "../../../declarations/football_god_backend";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const OLD_MAINNET_IDENTITY_SERVICE_URL = "https://identity.ic0.app";
  const NNS_IC_ORG_ALTERNATIVE_ORIGIN = "https://footballgod.xyz";
  const NNS_IC_APP_DERIVATION_ORIGIN =
    "https://43loz-3yaaa-aaaal-qbxrq-cai.icp0.io";

  const getIdentityProvider = () => {
    if (location.host === "nns.ic0.app") {
      return OLD_MAINNET_IDENTITY_SERVICE_URL;
    }
    return process.env.II_URL;
  };

  const isNnsAlternativeOrigin = () => {
    return window.location.origin === NNS_IC_ORG_ALTERNATIVE_ORIGIN;
  };

  const deleteIndexedDB = (dbName) => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase(dbName);

      request.onsuccess = () => {
        console.log("IndexedDB successfully deleted");
        window.location.reload();
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error deleting IndexedDB:", event);
        reject(event);
      };

      request.onblocked = () => {
        console.warn(
          "IndexedDB delete request blocked. Please close all other tabs using the database."
        );
      };
    });
  };

  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const authClient = await AuthClient.create({
          idleOptions: {
            idleTimeout: 1000 * 60 * 60,
          },
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
      } catch (error) {
        console.error("Error during AuthClient initialization:", error);
        await deleteIndexedDB("auth-client-db");
      } finally {
        setLoading(false);
      }
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
      identityProvider: getIdentityProvider(),
      ...(isNnsAlternativeOrigin() && {
        derivationOrigin: NNS_IC_APP_DERIVATION_ORIGIN,
      }),
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => {
        setIsAuthenticated(true);
        const identity = authClient.getIdentity();
        Actor.agentOf(football_god_backend_actor).replaceIdentity(identity);
        const userIsAdmin = await football_god_backend_actor.isAdmin();
        setIsAdmin(userIsAdmin);
      },
    });
  };

  const logout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const checkLoginStatus = async (client) => {
    if (client == null) {
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
      if (
        !identity ||
        !identity._delegation ||
        !identity._delegation.delegations
      )
        return false;

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
    <AuthContext.Provider
      value={{
        authClient,
        isAdmin,
        isAuthenticated,
        setIsAdmin,
        setIsAuthenticated,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
