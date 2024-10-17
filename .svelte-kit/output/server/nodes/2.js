

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.B-J1X2An.js","_app/immutable/chunks/index.USIdQ0FB.js","_app/immutable/chunks/vendor.KAmkBA2V.js"];
export const stylesheets = ["_app/immutable/assets/index.C2dF8wF_.css"];
export const fonts = [];
