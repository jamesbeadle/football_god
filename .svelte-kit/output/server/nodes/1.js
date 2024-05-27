

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.kT0WBx_0.js","_app/immutable/chunks/index.C33iQib6.js","_app/immutable/chunks/vendor.CLyPjLak.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
