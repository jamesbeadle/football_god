

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/league/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.DpexVD69.js","_app/immutable/chunks/index.CBoFeX64.js","_app/immutable/chunks/vendor.C5a86egc.js"];
export const stylesheets = ["_app/immutable/assets/index.Bcw6eU9o.css"];
export const fonts = [];
