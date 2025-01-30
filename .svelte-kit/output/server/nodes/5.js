

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/audit/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.V6CJAAIS.js","_app/immutable/chunks/index.C2vgwozU.js","_app/immutable/chunks/vendor.5bsCMzrv.js"];
export const stylesheets = ["_app/immutable/assets/index.B1BzUtqj.css"];
export const fonts = [];
