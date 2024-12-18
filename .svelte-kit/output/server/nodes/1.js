

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.Bm-KgXdD.js","_app/immutable/chunks/index.DvHIA7iE.js","_app/immutable/chunks/vendor.BMXexJs3.js"];
export const stylesheets = ["_app/immutable/assets/index.-u_DXI70.css"];
export const fonts = [];
