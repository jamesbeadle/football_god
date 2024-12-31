

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.CoX6uw7b.js","_app/immutable/chunks/index.BFOBR8M7.js","_app/immutable/chunks/vendor.CxWKPZdM.js"];
export const stylesheets = ["_app/immutable/assets/index.DtbG1sqo.css"];
export const fonts = [];
