<script lang="ts">
  import { getFlagComponent } from "$lib/utils/helpers";

  interface Props {
    className?: string;
  }

  let { className = "" }: Props = $props();

  const Flag = getFlagComponent(61);
</script>

<Flag className={className} />