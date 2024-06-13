

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/prediction/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.BLEMZqJK.js","_app/immutable/chunks/index.Bylwl2Yo.js","_app/immutable/chunks/vendor.BVveXz0n.js"];
export const stylesheets = ["_app/immutable/assets/index.BESxIHAR.css"];
export const fonts = [];
