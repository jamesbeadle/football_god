

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CJ40X5N6.js","_app/immutable/chunks/index.DkI9z6_I.js","_app/immutable/chunks/vendor.tF8zXmIJ.js"];
export const stylesheets = ["_app/immutable/assets/index.DDmig223.css"];
export const fonts = [];
