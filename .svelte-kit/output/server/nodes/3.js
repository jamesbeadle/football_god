

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BXjmM-Bz.js","_app/immutable/chunks/index.GkFbcq0M.js","_app/immutable/chunks/vendor.CTXmwvGv.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
