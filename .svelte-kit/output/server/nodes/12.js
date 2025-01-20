

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/timers/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.YPA_PpRO.js","_app/immutable/chunks/index.CqehbZ-i.js","_app/immutable/chunks/vendor.r2Gl_Ksi.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
