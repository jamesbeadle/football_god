

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fixture-event/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.B28qA_t0.js","_app/immutable/chunks/index.SbvwytVq.js","_app/immutable/chunks/vendor.B7YHW6Ef.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
