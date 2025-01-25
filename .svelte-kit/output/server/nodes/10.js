

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/players/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.KGKw-GnL.js","_app/immutable/chunks/index.GkFbcq0M.js","_app/immutable/chunks/vendor.CTXmwvGv.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
