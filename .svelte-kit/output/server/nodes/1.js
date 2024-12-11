

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.DaRiTlh9.js","_app/immutable/chunks/index.b_Uxn2kh.js","_app/immutable/chunks/vendor.D3yil3SX.js"];
export const stylesheets = ["_app/immutable/assets/index.C6ajDQRQ.css"];
export const fonts = [];
