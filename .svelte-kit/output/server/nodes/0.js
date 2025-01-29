

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CT8W3MkC.js","_app/immutable/chunks/index.JGi0RB_E.js","_app/immutable/chunks/vendor.vzXcLQOu.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
