

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/timers/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.zlZAHXbw.js","_app/immutable/chunks/index.Cnt5oXJn.js","_app/immutable/chunks/vendor.DwAtPDgU.js"];
export const stylesheets = ["_app/immutable/assets/index.CHWh9d0R.css"];
export const fonts = [];
