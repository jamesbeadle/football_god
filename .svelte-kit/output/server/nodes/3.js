

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/add-fixture-data/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.CXeylW46.js","_app/immutable/chunks/index.USIdQ0FB.js","_app/immutable/chunks/vendor.KAmkBA2V.js"];
export const stylesheets = ["_app/immutable/assets/index.C2dF8wF_.css"];
export const fonts = [];
