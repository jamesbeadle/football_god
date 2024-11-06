

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CEo8EEVu.js","_app/immutable/chunks/index.CBoFeX64.js","_app/immutable/chunks/vendor.C5a86egc.js"];
export const stylesheets = ["_app/immutable/assets/index.Bcw6eU9o.css"];
export const fonts = [];
