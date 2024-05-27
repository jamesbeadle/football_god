

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CPxXV1Gy.js","_app/immutable/chunks/index.C33iQib6.js","_app/immutable/chunks/vendor.CLyPjLak.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
