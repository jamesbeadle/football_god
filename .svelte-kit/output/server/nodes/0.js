

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BEVxtLoq.js","_app/immutable/chunks/index.DGP7dL7K.js","_app/immutable/chunks/vendor.BiPaCaLf.js"];
export const stylesheets = ["_app/immutable/assets/index.CXrJMV9X.css"];
export const fonts = [];
