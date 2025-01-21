

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.ClmsTSmU.js","_app/immutable/chunks/index.ByKjLX1H.js","_app/immutable/chunks/vendor.u44mEBWx.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
