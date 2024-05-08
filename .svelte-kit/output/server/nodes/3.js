

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/euro2024/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.AbkFsDG8.js","_app/immutable/chunks/index.DHbP5qSP.js","_app/immutable/chunks/vendor.Cqhtm2Lc.js"];
export const stylesheets = ["_app/immutable/assets/index.CyBM5i-h.css"];
export const fonts = [];
