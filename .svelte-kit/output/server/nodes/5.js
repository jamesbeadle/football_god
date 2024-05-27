

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/games/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.EFbKV_C6.js","_app/immutable/chunks/index.b4g0CxGC.js","_app/immutable/chunks/vendor.D7ZVfxRy.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
