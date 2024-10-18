

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BegC3UzD.js","_app/immutable/chunks/index.CICCmttX.js","_app/immutable/chunks/vendor.cTfe9MiI.js"];
export const stylesheets = ["_app/immutable/assets/index.q6MxsfFp.css"];
export const fonts = [];
