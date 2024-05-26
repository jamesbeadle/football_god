

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/presale/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.BFr8FxdT.js","_app/immutable/chunks/index.DkI9z6_I.js","_app/immutable/chunks/vendor.tF8zXmIJ.js"];
export const stylesheets = ["_app/immutable/assets/index.DDmig223.css"];
export const fonts = [];
