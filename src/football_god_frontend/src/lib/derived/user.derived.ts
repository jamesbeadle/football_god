import { userStore } from "$lib/stores/user.store";
import { derived, type Readable } from "svelte/store";

export const userGetFavouriteTeam: Readable<number> = derived(
  userStore,
  (user) => (user !== null && user !== undefined ? user.favouriteTeamId : 0),
);
