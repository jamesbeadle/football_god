

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/league/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.DpMAHQEr.js","_app/immutable/chunks/index.CqehbZ-i.js","_app/immutable/chunks/vendor.r2Gl_Ksi.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
