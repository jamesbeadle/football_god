

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fixture-event/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BKEy6_Ue.js","_app/immutable/chunks/index.D3lz7L3p.js","_app/immutable/chunks/vendor._nf8l32J.js"];
export const stylesheets = ["_app/immutable/assets/index.C6ajDQRQ.css"];
export const fonts = [];
