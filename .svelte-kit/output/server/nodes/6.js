

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fixture-event/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.DufRIsWw.js","_app/immutable/chunks/index.DMMfvK_P.js","_app/immutable/chunks/vendor.hsDoBrNq.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
