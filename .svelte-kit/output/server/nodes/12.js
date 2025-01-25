

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/timers/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/12.Bspa--Tw.js","_app/immutable/chunks/index.GkFbcq0M.js","_app/immutable/chunks/vendor.CTXmwvGv.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
