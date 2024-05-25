

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CsSqq9SY.js","_app/immutable/chunks/index.BSJb4nAe.js","_app/immutable/chunks/vendor.DSRFgVky.js"];
export const stylesheets = ["_app/immutable/assets/index.D-0svjux.css"];
export const fonts = [];
