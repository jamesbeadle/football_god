

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.DJOmR43C.js","_app/immutable/chunks/index.BFOBR8M7.js","_app/immutable/chunks/vendor.CxWKPZdM.js"];
export const stylesheets = ["_app/immutable/assets/index.DtbG1sqo.css"];
export const fonts = [];
