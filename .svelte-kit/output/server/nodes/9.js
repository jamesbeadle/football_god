

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/whitepaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.CP2Fugad.js","_app/immutable/chunks/index.DwtmdVWq.js","_app/immutable/chunks/vendor.x7LRBi4-.js"];
export const stylesheets = ["_app/immutable/assets/index.D7eaxdDC.css"];
export const fonts = [];
