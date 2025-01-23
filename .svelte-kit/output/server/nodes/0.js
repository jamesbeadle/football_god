

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.NIgegUro.js","_app/immutable/chunks/index.BGglJL7C.js","_app/immutable/chunks/vendor.D2hkZpzI.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
