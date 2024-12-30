

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.Bo83tnxd.js","_app/immutable/chunks/index.ufLk4Ea7.js","_app/immutable/chunks/vendor.Bnawml4v.js"];
export const stylesheets = ["_app/immutable/assets/index.BCdS8wh6.css"];
export const fonts = [];
