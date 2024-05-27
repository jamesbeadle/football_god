<script>

export let className;
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
    <rect width="100" height="75" fill="white" />
    <rect x="45" width="10" height="75" fill="red" />
    <rect y="32.5" width="100" height="10" fill="red" />
  </svg>
</div>