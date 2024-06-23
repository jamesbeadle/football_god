

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/prediction/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.Hxn9ZamD.js","_app/immutable/chunks/index.B18ILdj_.js","_app/immutable/chunks/vendor.CN-A3X5x.js"];
export const stylesheets = ["_app/immutable/assets/index.B5QBpQlE.css"];
export const fonts = [];
