

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/fixture-event/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.BDX4smJ7.js","_app/immutable/chunks/index.BoHsxCWd.js","_app/immutable/chunks/vendor.DnRcyjS7.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
