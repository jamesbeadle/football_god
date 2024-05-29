

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.B9I-iwKS.js","_app/immutable/chunks/index.BLiPuo57.js","_app/immutable/chunks/vendor.BhyAbCV7.js"];
export const stylesheets = ["_app/immutable/assets/index.BbfABu77.css"];
export const fonts = [];
