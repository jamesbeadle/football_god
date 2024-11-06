

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BJ16V9j_.js","_app/immutable/chunks/index.D-rE0Y6J.js","_app/immutable/chunks/vendor.CGKfS8mu.js"];
export const stylesheets = ["_app/immutable/assets/index.Bcw6eU9o.css"];
export const fonts = [];
