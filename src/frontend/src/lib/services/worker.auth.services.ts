import { idleSignOut } from "./auth.services";
import type { AuthStoreData } from "../stores/auth-store";
import { authRemainingTimeStore } from "../stores/auth-store";

import type {
  PostMessage,
  PostMessageDataResponseAuth,
} from "../types/post-message";

export const initAuthWorker = async () => {
  const AuthWorker = await import("$lib/workers/auth.worker?worker");
  const authWorker: Worker = new AuthWorker.default();

  authWorker.onmessage = async ({
    data,
  }: MessageEvent<PostMessage<PostMessageDataResponseAuth>>) => {
    const { msg, data: value } = data;

    switch (msg) {
      case "signOutIdleTimer":
        await idleSignOut();
        return;
      case "delegationRemainingTime":
        authRemainingTimeStore.set(value?.authRemainingTime);
        return;
    }
  };

  return {
    syncAuthIdle: (auth: AuthStoreData) => {
      if (!auth.identity) {
        authWorker.postMessage({ msg: "stopIdleTimer" });
        return;
      }

      authWorker.postMessage({
        msg: "startIdleTimer",
      });
    },
  };
};
