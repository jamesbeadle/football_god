

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.DcvCaM-X.js","_app/immutable/chunks/index.DWHcdM04.js","_app/immutable/chunks/vendor.DNX3mYjz.js"];
export const stylesheets = ["_app/immutable/assets/index.C6ajDQRQ.css"];
export const fonts = [];
