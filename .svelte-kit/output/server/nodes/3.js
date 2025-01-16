

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.C45wz20t.js","_app/immutable/chunks/index.DMMfvK_P.js","_app/immutable/chunks/vendor.hsDoBrNq.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
