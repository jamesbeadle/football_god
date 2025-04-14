<script lang="ts" >

  interface Props {
    className?: string;
  }

  let { className = "" }: Props = $props();
</script>
<style>
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
</style>
<div class={className}>
    
<svg viewBox="0 -10 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="75" fill="#0065BD" />
  <polygon points="0,0 100,75 90,75 0,10" fill="white" />
  <polygon points="100,0 0,75 10,75 100,10" fill="white" />
  <polygon points="0,0 10,0 100,65 90,75" fill="white" />
  <polygon points="100,0 90,0 0,65 10,75" fill="white" />
</svg>

</div>
