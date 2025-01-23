

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.DxGHgFwa.js","_app/immutable/chunks/index.CHPo7tOu.js","_app/immutable/chunks/vendor.G-gmyQ-X.js"];
export const stylesheets = ["_app/immutable/assets/index.Cxrw_qxx.css"];
export const fonts = [];
