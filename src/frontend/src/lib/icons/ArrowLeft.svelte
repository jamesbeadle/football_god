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
  viewBox="0 0 8 12"
>
<path d="M3.2999 6.00005L6.7999 2.50005C7.1999 2.10005 7.1999 1.50005 6.7999 1.10005C6.3999 0.700049 5.7999 0.700049 5.3999 1.10005L1.1999 5.30005C0.799902 5.70005 0.799902 6.30005 1.1999 6.70005L5.3999 10.9C5.5999 11.1 5.7999 11.2 6.0999 11.2C6.3999 11.2 6.5999 11.1 6.7999 10.9C7.1999 10.5 7.1999 9.90005 6.7999 9.50005L3.2999 6.00005Z" fill={fill}/>
</svg>
