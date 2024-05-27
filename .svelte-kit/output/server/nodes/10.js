

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.CL8E2cPn.js","_app/immutable/chunks/index.C33iQib6.js","_app/immutable/chunks/vendor.CLyPjLak.js"];
export const stylesheets = ["_app/immutable/assets/index.BcCEP8XD.css"];
export const fonts = [];
