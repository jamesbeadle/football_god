

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leaderboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/9.ah_ZGUkU.js","_app/immutable/chunks/index.BhfKUY7o.js","_app/immutable/chunks/vendor.OIOqmf8P.js"];
export const stylesheets = ["_app/immutable/assets/index.leNgIcjQ.css"];
export const fonts = [];
