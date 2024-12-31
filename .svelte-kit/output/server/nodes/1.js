

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CGq53ng9.js","_app/immutable/chunks/index.C8H-bCC1.js","_app/immutable/chunks/vendor.COvYdJ-F.js"];
export const stylesheets = ["_app/immutable/assets/index.DGj9tDo1.css"];
export const fonts = [];
