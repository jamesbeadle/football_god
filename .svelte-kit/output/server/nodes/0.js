

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.ChrTK-f8.js","_app/immutable/chunks/index.ChAsbZXG.js","_app/immutable/chunks/vendor.DOlh_hZ1.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
