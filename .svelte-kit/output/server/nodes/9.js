

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.CbKsBPu9.js","_app/immutable/chunks/index.ByKjLX1H.js","_app/immutable/chunks/vendor.u44mEBWx.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
