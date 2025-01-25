

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fixture-event/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.CU-eyUYb.js","_app/immutable/chunks/index.BKXsHD9d.js","_app/immutable/chunks/vendor.CZEvUbnJ.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
