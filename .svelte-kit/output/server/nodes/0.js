

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Xaj1ACfp.js","_app/immutable/chunks/index.b4g0CxGC.js","_app/immutable/chunks/vendor.D7ZVfxRy.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
