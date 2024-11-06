

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BvBHi2V4.js","_app/immutable/chunks/index.D-rE0Y6J.js","_app/immutable/chunks/vendor.CGKfS8mu.js"];
export const stylesheets = ["_app/immutable/assets/index.Bcw6eU9o.css"];
export const fonts = [];
