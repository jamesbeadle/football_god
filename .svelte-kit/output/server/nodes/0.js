

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.C_3GHitp.js","_app/immutable/chunks/index.WFnCKR6b.js","_app/immutable/chunks/vendor.DMeTnII3.js"];
export const stylesheets = ["_app/immutable/assets/index.DGj9tDo1.css"];
export const fonts = [];
