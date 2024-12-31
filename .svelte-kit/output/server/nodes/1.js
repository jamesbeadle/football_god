

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.DW8i5_W3.js","_app/immutable/chunks/index.DuTms-2r.js","_app/immutable/chunks/vendor.DJzUGvAj.js"];
export const stylesheets = ["_app/immutable/assets/index.DtbG1sqo.css"];
export const fonts = [];
