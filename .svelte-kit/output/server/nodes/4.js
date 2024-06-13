

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/agent-hub/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CgTu36d1.js","_app/immutable/chunks/index.Bylwl2Yo.js","_app/immutable/chunks/vendor.BVveXz0n.js"];
export const stylesheets = ["_app/immutable/assets/index.BESxIHAR.css"];
export const fonts = [];
