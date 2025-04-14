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
  fill={fill}
  viewBox="0 0 24 24"
>
<path d="M16.9 13.4L12.7 9.20002C12.3 8.80002 11.7 8.80002 11.3 9.20002L7.09999 13.4C6.69999 13.8 6.69999 14.4 7.09999 14.8C7.49999 15.2 8.09999 15.2 8.49999 14.8L12 11.3L15.5 14.8C15.7 15 15.9 15.1 16.2 15.1C16.5 15.1 16.7 15 16.9 14.8C17.3 14.4 17.3 13.8 16.9 13.4Z" fill={fill}/>
</svg>
