

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/league/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.R31KVTn-.js","_app/immutable/chunks/index.BFOBR8M7.js","_app/immutable/chunks/vendor.CxWKPZdM.js"];
export const stylesheets = ["_app/immutable/assets/index.DtbG1sqo.css"];
export const fonts = [];
