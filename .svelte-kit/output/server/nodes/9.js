

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.BnV4bLaI.js","_app/immutable/chunks/index.DnvMF2h0.js","_app/immutable/chunks/vendor.BRQfKsJt.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
