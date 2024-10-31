

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.CaR8kJyI.js","_app/immutable/chunks/index.o5wkRHv0.js","_app/immutable/chunks/vendor.1YqH4IcR.js"];
export const stylesheets = ["_app/immutable/assets/index.COiY22sw.css"];
export const fonts = [];
