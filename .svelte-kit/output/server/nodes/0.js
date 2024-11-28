

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BPxmfUEh.js","_app/immutable/chunks/index.p5jO3M2E.js","_app/immutable/chunks/vendor.DlsL-f0G.js"];
export const stylesheets = ["_app/immutable/assets/index.DA9SDhPZ.css"];
export const fonts = [];
