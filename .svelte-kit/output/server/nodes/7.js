

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/governance/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.DIJ-YSk1.js","_app/immutable/chunks/index.BKXsHD9d.js","_app/immutable/chunks/vendor.CZEvUbnJ.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
