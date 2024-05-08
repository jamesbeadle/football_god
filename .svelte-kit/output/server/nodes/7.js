

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/terms/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.Ckljzrx-.js","_app/immutable/chunks/index.DHbP5qSP.js","_app/immutable/chunks/vendor.Cqhtm2Lc.js"];
export const stylesheets = ["_app/immutable/assets/index.CyBM5i-h.css"];
export const fonts = [];
