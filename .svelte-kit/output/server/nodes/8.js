

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/manage-euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.5EnsLh9I.js","_app/immutable/chunks/index.C33iQib6.js","_app/immutable/chunks/vendor.CLyPjLak.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
