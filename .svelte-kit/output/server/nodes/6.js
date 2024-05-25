

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/manage-euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.BEDYhnwy.js","_app/immutable/chunks/index.BSJb4nAe.js","_app/immutable/chunks/vendor.DSRFgVky.js"];
export const stylesheets = ["_app/immutable/assets/index.D-0svjux.css"];
export const fonts = [];
