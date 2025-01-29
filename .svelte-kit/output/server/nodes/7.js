

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.BzknHE9q.js","_app/immutable/chunks/index.JGi0RB_E.js","_app/immutable/chunks/vendor.vzXcLQOu.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
