

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.Dj2SP9Ea.js","_app/immutable/chunks/index.Bylwl2Yo.js","_app/immutable/chunks/vendor.BVveXz0n.js"];
export const stylesheets = ["_app/immutable/assets/index.BESxIHAR.css"];
export const fonts = [];
