

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.C-L1iHGh.js","_app/immutable/chunks/index.BFOBR8M7.js","_app/immutable/chunks/vendor.CxWKPZdM.js"];
export const stylesheets = ["_app/immutable/assets/index.DtbG1sqo.css"];
export const fonts = [];
