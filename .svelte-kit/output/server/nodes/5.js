

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/audit/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BnrVBRq0.js","_app/immutable/chunks/index.GkFbcq0M.js","_app/immutable/chunks/vendor.CTXmwvGv.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
