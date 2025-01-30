

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CSSLvRrD.js","_app/immutable/chunks/index.BoHsxCWd.js","_app/immutable/chunks/vendor.DnRcyjS7.js"];
export const stylesheets = ["_app/immutable/assets/index.v76djtdY.css"];
export const fonts = [];
