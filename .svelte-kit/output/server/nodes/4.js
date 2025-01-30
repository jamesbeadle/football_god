

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.gyUCx4Lv.js","_app/immutable/chunks/index.DSnF7_Rw.js","_app/immutable/chunks/vendor.DOzhR0Yu.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
