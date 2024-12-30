

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.D-8-vOa9.js","_app/immutable/chunks/index.ufLk4Ea7.js","_app/immutable/chunks/vendor.Bnawml4v.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
