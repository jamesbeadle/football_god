

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lightpaper/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.BFlYYCnU.js","_app/immutable/chunks/index.BhfKUY7o.js","_app/immutable/chunks/vendor.OIOqmf8P.js"];
export const stylesheets = ["_app/immutable/assets/index.leNgIcjQ.css"];
export const fonts = [];
