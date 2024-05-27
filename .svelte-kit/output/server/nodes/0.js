

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CU3qs0ke.js","_app/immutable/chunks/index.DXjgZ5fr.js","_app/immutable/chunks/vendor.Dsq-8qgF.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
