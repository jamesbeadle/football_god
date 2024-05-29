

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/games/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.D4oFNVlL.js","_app/immutable/chunks/index.BLiPuo57.js","_app/immutable/chunks/vendor.BhyAbCV7.js"];
export const stylesheets = ["_app/immutable/assets/index.BbfABu77.css"];
export const fonts = [];
