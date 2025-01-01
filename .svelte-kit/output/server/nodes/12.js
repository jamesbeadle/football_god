

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/timers/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.D_crcF59.js","_app/immutable/chunks/index.WFnCKR6b.js","_app/immutable/chunks/vendor.DMeTnII3.js"];
export const stylesheets = ["_app/immutable/assets/index.DGj9tDo1.css"];
export const fonts = [];
