

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DfWwal1U.js","_app/immutable/chunks/index.USIdQ0FB.js","_app/immutable/chunks/vendor.KAmkBA2V.js"];
export const stylesheets = ["_app/immutable/assets/index.C2dF8wF_.css"];
export const fonts = [];
