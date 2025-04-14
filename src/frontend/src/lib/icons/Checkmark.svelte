<script lang="ts">
    interface Props {
        className: string;
        fill: string;
    }
    let { className, fill }: Props = $props();
  </script>

<svg
    class={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <path d="M9.23077 20.4615L0 10.6788L2.58277 8.03969L9.18185 14.9378L21.3148 2L24 4.59015L9.23077 20.4615Z" fill={fill}/>
</svg>