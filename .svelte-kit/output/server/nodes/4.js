

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leaderboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.4rcPHv5j.js","_app/immutable/chunks/index.DHbP5qSP.js","_app/immutable/chunks/vendor.Cqhtm2Lc.js"];
export const stylesheets = ["_app/immutable/assets/index.CyBM5i-h.css"];
export const fonts = [];
