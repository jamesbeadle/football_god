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
<path d="M1.8999 11.2C1.2999 11.2 0.899902 10.8 0.899902 10.2C0.899902 9.90005 0.999903 9.70005 1.1999 9.50005L4.6999 6.00005L1.1999 2.50005C0.799903 2.10005 0.799903 1.50005 1.1999 1.10005C1.5999 0.700049 2.1999 0.700049 2.5999 1.10005L6.7999 5.30005C7.1999 5.70005 7.1999 6.30005 6.7999 6.70005L2.5999 10.9C2.3999 11.1 2.0999 11.2 1.8999 11.2Z" fill={fill}/>
</svg>
