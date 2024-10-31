

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.D2oJpKbQ.js","_app/immutable/chunks/index.o5wkRHv0.js","_app/immutable/chunks/vendor.1YqH4IcR.js"];
export const stylesheets = ["_app/immutable/assets/index.COiY22sw.css"];
export const fonts = [];
