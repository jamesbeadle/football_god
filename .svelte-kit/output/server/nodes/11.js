

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/timers/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.Ck7O26X1.js","_app/immutable/chunks/index.DWHcdM04.js","_app/immutable/chunks/vendor.DNX3mYjz.js"];
export const stylesheets = ["_app/immutable/assets/index.C6ajDQRQ.css"];
export const fonts = [];
