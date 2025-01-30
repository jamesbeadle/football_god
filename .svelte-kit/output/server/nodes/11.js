

export const index = 11;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/11.Cu2EZw43.js","_app/immutable/chunks/index.BoHsxCWd.js","_app/immutable/chunks/vendor.DnRcyjS7.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
