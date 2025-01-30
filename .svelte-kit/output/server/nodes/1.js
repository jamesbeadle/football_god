

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CunkDm4U.js","_app/immutable/chunks/index.BqB4qOgf.js","_app/immutable/chunks/vendor.DlEi7daW.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
