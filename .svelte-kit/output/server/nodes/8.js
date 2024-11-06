

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.CDBxAM42.js","_app/immutable/chunks/index.D-rE0Y6J.js","_app/immutable/chunks/vendor.CGKfS8mu.js"];
export const stylesheets = ["_app/immutable/assets/index.Bcw6eU9o.css"];
export const fonts = [];
