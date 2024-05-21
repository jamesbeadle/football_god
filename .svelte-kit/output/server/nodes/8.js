

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.DEFMUyxN.js","_app/immutable/chunks/index.SnITFYT6.js","_app/immutable/chunks/vendor.BEsDHGUX.js"];
export const stylesheets = ["_app/immutable/assets/index.BUmMB-3-.css"];
export const fonts = [];
