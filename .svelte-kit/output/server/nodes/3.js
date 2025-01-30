

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.lULH_BgF.js","_app/immutable/chunks/index.DOWkGtlC.js","_app/immutable/chunks/vendor.DUwwbAOT.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
