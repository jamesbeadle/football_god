<script lang="ts">
  import type { Club } from "../../../../../../declarations/backend/backend.did";

  interface Props {
    clubs: Club[];
  }

  let { clubs }: Props = $props();
  let sortedClubs = $derived(
    [...clubs].sort((a, b) => a.friendlyName.localeCompare(b.friendlyName))
  );
</script>

<div class="px-3 mt-4 mb-4 space-y-4 md:px-0">
  {#each sortedClubs as club}
    <p>{club.friendlyName}</p>
  {/each}
</div>