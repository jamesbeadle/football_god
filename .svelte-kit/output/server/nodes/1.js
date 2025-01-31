

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.DpTaPhWs.js","_app/immutable/chunks/index.Cnt5oXJn.js","_app/immutable/chunks/vendor.DwAtPDgU.js"];
export const stylesheets = ["_app/immutable/assets/index.CHWh9d0R.css"];
export const fonts = [];
