

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/presale/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.Cb_DDNxD.js","_app/immutable/chunks/index.D6LryO9O.js","_app/immutable/chunks/vendor.DAVOOr3e.js"];
export const stylesheets = ["_app/immutable/assets/index.CrKHZjHm.css"];
export const fonts = [];
