

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.Dn9oxkGT.js","_app/immutable/chunks/index.C9NG3boW.js","_app/immutable/chunks/vendor.CqgfyGfF.js"];
export const stylesheets = ["_app/immutable/assets/index.B7PcOzx5.css"];
export const fonts = [];
