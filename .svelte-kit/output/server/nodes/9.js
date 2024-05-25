

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/terms/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.BNbDOoQ3.js","_app/immutable/chunks/index.BSJb4nAe.js","_app/immutable/chunks/vendor.DSRFgVky.js"];
export const stylesheets = ["_app/immutable/assets/index.D-0svjux.css"];
export const fonts = [];
