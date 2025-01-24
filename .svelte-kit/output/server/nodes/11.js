

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.Zi--Nq4Y.js","_app/immutable/chunks/index.SbvwytVq.js","_app/immutable/chunks/vendor.B7YHW6Ef.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
