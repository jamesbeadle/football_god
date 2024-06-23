

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/gift-euro-entry/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.BAIo-LqU.js","_app/immutable/chunks/index.B18ILdj_.js","_app/immutable/chunks/vendor.CN-A3X5x.js"];
export const stylesheets = ["_app/immutable/assets/index.B5QBpQlE.css"];
export const fonts = [];
