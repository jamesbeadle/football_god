

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.BsL_5IM8.js","_app/immutable/chunks/index.JGi0RB_E.js","_app/immutable/chunks/vendor.vzXcLQOu.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
