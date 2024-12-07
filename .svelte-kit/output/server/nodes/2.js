

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DTLK0L8O.js","_app/immutable/chunks/index.D3lz7L3p.js","_app/immutable/chunks/vendor._nf8l32J.js"];
export const stylesheets = ["_app/immutable/assets/index.C6ajDQRQ.css"];
export const fonts = [];
