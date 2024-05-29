

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.jlMd3_wK.js","_app/immutable/chunks/index.BLiPuo57.js","_app/immutable/chunks/vendor.BhyAbCV7.js"];
export const stylesheets = ["_app/immutable/assets/index.BbfABu77.css"];
export const fonts = [];
