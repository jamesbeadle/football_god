

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BccOq33W.js","_app/immutable/chunks/index.D3lz7L3p.js","_app/immutable/chunks/vendor._nf8l32J.js"];
export const stylesheets = ["_app/immutable/assets/index.C6ajDQRQ.css"];
export const fonts = [];
