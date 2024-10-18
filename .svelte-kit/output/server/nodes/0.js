

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.DS24T-FF.js","_app/immutable/chunks/index.CICCmttX.js","_app/immutable/chunks/vendor.cTfe9MiI.js"];
export const stylesheets = ["_app/immutable/assets/index.q6MxsfFp.css"];
export const fonts = [];
