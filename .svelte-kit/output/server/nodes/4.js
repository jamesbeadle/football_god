

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.BrgiFQg1.js","_app/immutable/chunks/index.Bv1ZECCx.js","_app/immutable/chunks/vendor.BSGyPW0X.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
