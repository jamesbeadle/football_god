

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CNKCNJ0Y.js","_app/immutable/chunks/index.Gc3bSBq5.js","_app/immutable/chunks/vendor.BJ_iENKD.js"];
export const stylesheets = ["_app/immutable/assets/index.BUgnsisD.css"];
export const fonts = [];
