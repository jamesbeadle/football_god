

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/audit/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.CHD739QA.js","_app/immutable/chunks/index.DMMfvK_P.js","_app/immutable/chunks/vendor.hsDoBrNq.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
