

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.C3BpOQvW.js","_app/immutable/chunks/index.C9NG3boW.js","_app/immutable/chunks/vendor.CqgfyGfF.js"];
export const stylesheets = ["_app/immutable/assets/index.B7PcOzx5.css"];
export const fonts = [];
