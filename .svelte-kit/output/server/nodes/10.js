

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.BN5LFetF.js","_app/immutable/chunks/index.SbvwytVq.js","_app/immutable/chunks/vendor.B7YHW6Ef.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
