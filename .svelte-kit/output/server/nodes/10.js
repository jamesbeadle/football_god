

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/presale/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.BxUQZwU9.js","_app/immutable/chunks/index.BLiPuo57.js","_app/immutable/chunks/vendor.BhyAbCV7.js"];
export const stylesheets = ["_app/immutable/assets/index.BbfABu77.css"];
export const fonts = [];
