

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/games/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.BbPuxm65.js","_app/immutable/chunks/index.BhfKUY7o.js","_app/immutable/chunks/vendor.OIOqmf8P.js"];
export const stylesheets = ["_app/immutable/assets/index.leNgIcjQ.css"];
export const fonts = [];
