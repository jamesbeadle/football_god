

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.BXtt3uf0.js","_app/immutable/chunks/index.Bv1ZECCx.js","_app/immutable/chunks/vendor.BSGyPW0X.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
