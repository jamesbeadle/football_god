

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.CHBStW_r.js","_app/immutable/chunks/index.ChAsbZXG.js","_app/immutable/chunks/vendor.DOlh_hZ1.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
