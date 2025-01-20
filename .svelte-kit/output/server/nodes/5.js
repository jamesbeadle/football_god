

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/audit/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DIH5wxKE.js","_app/immutable/chunks/index.B9t5e9g8.js","_app/immutable/chunks/vendor.CwwzPaiS.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
