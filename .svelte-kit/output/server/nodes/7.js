

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.CgrmStCz.js","_app/immutable/chunks/index.DnvMF2h0.js","_app/immutable/chunks/vendor.BRQfKsJt.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
