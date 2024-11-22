import { authStore } from "../stores/auth-store";
import { derived, type Readable } from "svelte/store";
export const authSignedInStore: Readable<boolean> = derived(
  authStore,
  ({ identity }) => identity !== null && identity !== undefined,
);
