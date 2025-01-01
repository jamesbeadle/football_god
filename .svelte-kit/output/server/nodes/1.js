

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.IP8z1yrr.js","_app/immutable/chunks/index.SIl8V8kE.js","_app/immutable/chunks/vendor.7sF3hecH.js"];
export const stylesheets = ["_app/immutable/assets/index.DGj9tDo1.css"];
export const fonts = [];
