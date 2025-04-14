<script lang="ts">
  interface Props {
		className: string;
    fill: string;
	}
	let { className, fill }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  class={className}
  fill="currentColor"
  viewBox="0 0 24 24"
>
  <path 
    {fill}
    d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.41 3.59 8 8 8s8-3.59 8-8-3.59-8-8-8z"
  />
</svg>
