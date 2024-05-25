

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.BDAFiH5x.js","_app/immutable/chunks/index.D83DVHm3.js","_app/immutable/chunks/vendor.Ca47WG7w.js"];
export const stylesheets = ["_app/immutable/assets/index.DwASfU_j.css"];
export const fonts = [];
