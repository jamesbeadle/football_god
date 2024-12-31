

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/league/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.B21caGE0.js","_app/immutable/chunks/index.DuTms-2r.js","_app/immutable/chunks/vendor.DJzUGvAj.js"];
export const stylesheets = ["_app/immutable/assets/index.DtbG1sqo.css"];
export const fonts = [];
