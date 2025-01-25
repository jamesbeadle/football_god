

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.DxaJmEL4.js","_app/immutable/chunks/index.BKXsHD9d.js","_app/immutable/chunks/vendor.CZEvUbnJ.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
