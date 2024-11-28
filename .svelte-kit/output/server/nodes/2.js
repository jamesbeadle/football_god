

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.EOE4Z-4K.js","_app/immutable/chunks/index.p5jO3M2E.js","_app/immutable/chunks/vendor.DlsL-f0G.js"];
export const stylesheets = ["_app/immutable/assets/index.DA9SDhPZ.css"];
export const fonts = [];
