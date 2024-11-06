

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.BqHOJ8Lt.js","_app/immutable/chunks/index.CBoFeX64.js","_app/immutable/chunks/vendor.C5a86egc.js"];
export const stylesheets = ["_app/immutable/assets/index.Bcw6eU9o.css"];
export const fonts = [];
