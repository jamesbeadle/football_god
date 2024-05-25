

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lightpaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.Cy_obxh7.js","_app/immutable/chunks/index.D83DVHm3.js","_app/immutable/chunks/vendor.Ca47WG7w.js"];
export const stylesheets = ["_app/immutable/assets/index.DwASfU_j.css"];
export const fonts = [];
