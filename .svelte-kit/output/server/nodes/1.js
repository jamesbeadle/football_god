

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.YAzCPFXu.js","_app/immutable/chunks/index.WFnCKR6b.js","_app/immutable/chunks/vendor.DMeTnII3.js"];
export const stylesheets = ["_app/immutable/assets/index.DGj9tDo1.css"];
export const fonts = [];
