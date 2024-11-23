

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.Ch_UR5dm.js","_app/immutable/chunks/index.DGP7dL7K.js","_app/immutable/chunks/vendor.BiPaCaLf.js"];
export const stylesheets = ["_app/immutable/assets/index.CXrJMV9X.css"];
export const fonts = [];
