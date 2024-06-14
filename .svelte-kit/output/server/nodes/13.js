

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/presale/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/13.C6Wr-AoL.js","_app/immutable/chunks/index.BhfKUY7o.js","_app/immutable/chunks/vendor.OIOqmf8P.js"];
export const stylesheets = ["_app/immutable/assets/index.leNgIcjQ.css"];
export const fonts = [];
