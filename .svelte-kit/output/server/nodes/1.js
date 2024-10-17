

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.B8SW2R3E.js","_app/immutable/chunks/index.USIdQ0FB.js","_app/immutable/chunks/vendor.KAmkBA2V.js"];
export const stylesheets = ["_app/immutable/assets/index.C2dF8wF_.css"];
export const fonts = [];
