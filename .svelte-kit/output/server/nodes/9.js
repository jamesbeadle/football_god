

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leagues/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.CJVIbf8A.js","_app/immutable/chunks/index.DSnF7_Rw.js","_app/immutable/chunks/vendor.DOzhR0Yu.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
