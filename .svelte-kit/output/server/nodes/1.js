

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BaTsmsjO.js","_app/immutable/chunks/index.SnITFYT6.js","_app/immutable/chunks/vendor.BEsDHGUX.js"];
export const stylesheets = ["_app/immutable/assets/index.BUmMB-3-.css"];
export const fonts = [];
