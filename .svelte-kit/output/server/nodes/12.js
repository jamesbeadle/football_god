

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/timers/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.DCX3iJp-.js","_app/immutable/chunks/index.CXeVyB5_.js","_app/immutable/chunks/vendor.Bnq-jX-H.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
