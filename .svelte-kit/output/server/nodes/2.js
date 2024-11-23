

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.BX0NTvuV.js","_app/immutable/chunks/index.DGP7dL7K.js","_app/immutable/chunks/vendor.BiPaCaLf.js"];
export const stylesheets = ["_app/immutable/assets/index.CXrJMV9X.css"];
export const fonts = [];
