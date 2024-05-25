

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.DVo7_Izo.js","_app/immutable/chunks/index.D83DVHm3.js","_app/immutable/chunks/vendor.Ca47WG7w.js"];
export const stylesheets = ["_app/immutable/assets/index.DwASfU_j.css"];
export const fonts = [];
