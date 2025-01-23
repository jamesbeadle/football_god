

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/audit/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.f4e1wQoa.js","_app/immutable/chunks/index.BBr76EPb.js","_app/immutable/chunks/vendor.Db2MlQ3P.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
