

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BdXMu0UF.js","_app/immutable/chunks/index.CBoFeX64.js","_app/immutable/chunks/vendor.C5a86egc.js"];
export const stylesheets = ["_app/immutable/assets/index.Bcw6eU9o.css"];
export const fonts = [];
