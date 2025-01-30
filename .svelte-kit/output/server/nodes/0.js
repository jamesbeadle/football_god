

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Cj72b5Cc.js","_app/immutable/chunks/index.CZD0Sd1u.js","_app/immutable/chunks/vendor.6dhN7m3n.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
