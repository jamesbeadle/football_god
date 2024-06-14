

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.CwJy6ofT.js","_app/immutable/chunks/index.BhfKUY7o.js","_app/immutable/chunks/vendor.OIOqmf8P.js"];
export const stylesheets = ["_app/immutable/assets/index.leNgIcjQ.css"];
export const fonts = [];
