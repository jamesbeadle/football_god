

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Dt4e-olg.js","_app/immutable/chunks/index.Hq7qCnt6.js","_app/immutable/chunks/vendor.BSedk8ia.js"];
export const stylesheets = ["_app/immutable/assets/index.dzohRDD9.css"];
export const fonts = [];
