

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fixture-event/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.D5KVCivC.js","_app/immutable/chunks/index.ChAsbZXG.js","_app/immutable/chunks/vendor.DOlh_hZ1.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
