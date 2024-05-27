

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.iiaoxTT0.js","_app/immutable/chunks/index.Gc3bSBq5.js","_app/immutable/chunks/vendor.BJ_iENKD.js"];
export const stylesheets = ["_app/immutable/assets/index.BUgnsisD.css"];
export const fonts = [];
