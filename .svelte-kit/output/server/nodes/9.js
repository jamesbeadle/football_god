

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leaderboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.BSL-dthe.js","_app/immutable/chunks/index.Bylwl2Yo.js","_app/immutable/chunks/vendor.BVveXz0n.js"];
export const stylesheets = ["_app/immutable/assets/index.BESxIHAR.css"];
export const fonts = [];
