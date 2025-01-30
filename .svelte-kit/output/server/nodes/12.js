

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/timers/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.D59p2qMt.js","_app/immutable/chunks/index.C2vgwozU.js","_app/immutable/chunks/vendor.5bsCMzrv.js"];
export const stylesheets = ["_app/immutable/assets/index.B1BzUtqj.css"];
export const fonts = [];
