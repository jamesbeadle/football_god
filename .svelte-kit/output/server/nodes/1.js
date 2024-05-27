

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.D3R0Gaos.js","_app/immutable/chunks/index.DXjgZ5fr.js","_app/immutable/chunks/vendor.Dsq-8qgF.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
