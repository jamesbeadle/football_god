

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.Btdsm26N.js","_app/immutable/chunks/index.C-W2Zyda.js","_app/immutable/chunks/vendor.BWxwiFRd.js"];
export const stylesheets = ["_app/immutable/assets/index.-u_DXI70.css"];
export const fonts = [];
