

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/timers/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.B4n9-tyc.js","_app/immutable/chunks/index.C-W2Zyda.js","_app/immutable/chunks/vendor.BWxwiFRd.js"];
export const stylesheets = ["_app/immutable/assets/index.-u_DXI70.css"];
export const fonts = [];
