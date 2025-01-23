

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.CnvK9H6w.js","_app/immutable/chunks/index.CHPo7tOu.js","_app/immutable/chunks/vendor.G-gmyQ-X.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
