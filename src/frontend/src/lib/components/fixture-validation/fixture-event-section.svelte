<script lang="ts">

  interface Props {
    title: string;
    eventMinutes: number[];
    sliderValue: number;
    onAdd: () => void;
    onRemove: (minute: number, index: number) => void;
  }

  let { title, eventMinutes, sliderValue, onAdd, onRemove }: Props = $props();

  function validateAndAdd() {
    if (sliderValue > 90) {
      sliderValue = 90;
    }
    if (sliderValue >= 0 && sliderValue <= 90) {
      onAdd();
      sliderValue = 0;
    }
  }

</script>

<div class="flex-col space-y-2">
  <div class="flex items-center justify-between">
    <p class="text-lg font-medium">{title}</p>
    <button class="px-4 py-2 brand-button" onclick={validateAndAdd}>Add</button>
  </div>
  <div class="w-full">
    <label for="eventMinute" class="block mb-1 text-sm text-gray-400">Minute of {title.toLowerCase()}</label>
    <input
      id="eventMinute"
      type="number"
      class="modal-input-box"
      min="0"
      max="90"
      oninput={(e) => {
        if (Number(e.currentTarget.value) > 90) {
          sliderValue = 90;
        }
      }}
      bind:value={sliderValue}
      placeholder="Minute"
    />
  </div>
  <div class="flex flex-wrap space-x-2">
    {#each eventMinutes as minute, i (minute)}
      <div class="items-center inline-block px-3 py-1 text-sm font-medium text-white rounded-md bg-BrandPurple/50 event-tag">
        {minute} Min
        <button 
          class="items-center p-1 text-gray-400 event-tag hover:text-white" 
          onclick={(e) => {
            e.stopPropagation();
            onRemove(minute, i);
          }}
        >
          x
        </button>
      </div>
    {/each}
  </div>
</div>
