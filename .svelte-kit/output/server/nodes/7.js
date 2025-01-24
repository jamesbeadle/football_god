

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.B9FXG3nd.js","_app/immutable/chunks/index.SbvwytVq.js","_app/immutable/chunks/vendor.B7YHW6Ef.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
