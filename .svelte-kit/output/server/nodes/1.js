

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.Di-LvQl9.js","_app/immutable/chunks/index.DHbP5qSP.js","_app/immutable/chunks/vendor.Cqhtm2Lc.js"];
export const stylesheets = ["_app/immutable/assets/index.CyBM5i-h.css"];
export const fonts = [];
